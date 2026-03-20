/**
 * src/lib/codeRunner.ts
 *
 * Safe client-side JS execution in a sandboxed iframe.
 *
 * Fixes applied:
 * 1. Uses `srcdoc` attribute — never accesses iframe.contentDocument, which
 *    is blocked when sandbox="allow-scripts" (no allow-same-origin).
 * 2. Sends 'done' after a 200ms delay so Promise microtasks and
 *    setTimeout(fn,0) macrotasks have time to fire before the iframe is removed.
 * 3. 3-second hard timeout kills infinite loops.
 */

export interface RunResult {
  output: string[];
  error: string | null;
  timed_out: boolean;
}

// APIs that can't work in a sandboxed iframe — warn instead of running silently
const UNSUPPORTED_APIS = [
  "fetch(",
  "XMLHttpRequest",
  "axios",
  "http.get",
  "https.get",
  "document.",
  "window.location",
  "localStorage",
  "sessionStorage",
  "navigator.",
  "alert(",
  "confirm(",
  "prompt(",
];

export function codeUsesUnsupportedAPIs(code: string): string | null {
  for (const api of UNSUPPORTED_APIS) {
    if (code.includes(api)) return api;
  }
  return null;
}

export async function runCode(code: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.cssText =
      "display:none;width:0;height:0;border:none;position:absolute;top:-9999px";
    // allow-scripts only — no allow-same-origin so sandboxed code can't touch parent
    iframe.setAttribute("sandbox", "allow-scripts");
    document.body.appendChild(iframe);

    const output: string[] = [];
    let settled = false;

    const hardTimeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({ output, error: null, timed_out: true });
    }, 3000);

    function cleanup() {
      clearTimeout(hardTimeout);
      try {
        document.body.removeChild(iframe);
      } catch {}
    }

    function handler(e: MessageEvent) {
      if (e.source !== iframe.contentWindow) return;
      const msg = e.data;
      if (!msg || msg.__src !== "jsprep") return;

      if (msg.type === "log") {
        output.push(msg.value);
      } else if (msg.type === "done") {
        if (settled) return;
        settled = true;
        window.removeEventListener("message", handler);
        cleanup();
        resolve({ output, error: null, timed_out: false });
      } else if (msg.type === "error") {
        if (settled) return;
        settled = true;
        window.removeEventListener("message", handler);
        cleanup();
        resolve({ output, error: msg.value, timed_out: false });
      }
    }

    window.addEventListener("message", handler);

    // Inject via srcdoc — never reads iframe.contentDocument
    // 200ms delay before 'done' so microtasks (Promise.then) and
    // one round of macrotasks (setTimeout 0) can fire first.
    iframe.srcdoc = `<!DOCTYPE html><html><body><script>
(function(){
  var _log = function(){
    var value = Array.prototype.slice.call(arguments).map(function(a){
      if(a===undefined) return 'undefined'
      if(a===null) return 'null'
      if(typeof a==='function') return a.toString()
      if(typeof a==='object'){ try{ return JSON.stringify(a,null,2) }catch(e){ return '[object]' } }
      return String(a)
    }).join(' ')
    window.parent.postMessage({__src:'jsprep',type:'log',value:value},'*')
  }
  console.log=_log; console.warn=_log; console.info=_log; console.error=_log

  try{
    ${code}
    // Wait 200ms for Promise microtasks + setTimeout(0) macrotasks
    setTimeout(function(){
      window.parent.postMessage({__src:'jsprep',type:'done'},'*')
    }, 200)
  } catch(e){
    window.parent.postMessage({__src:'jsprep',type:'error',value:e.message},'*')
  }
})()
<\/script></body></html>`;
  });
}
