/**
 * src/lib/codeRunner.ts
 *
 * Safe client-side JS execution in a sandboxed iframe.
 *
 * - Uses `srcdoc`, never iframe.contentDocument, which is blocked when
 *   sandbox="allow-scripts" (no allow-same-origin).
 * - The user's code runs in its own <script>, after a setup script that
 *   listens for errors, so a syntax error is reported instead of timing out.
 *   It stays a classic script, so top-level `var` and `this` behave as in a
 *   browser console, which output questions rely on.
 * - Finishes once every pending timer has fired, so delayed logs aren't lost.
 * - 3-second hard timeout stops infinite loops and very long timers.
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

    // The user's code can't close its own <script> early.
    const userCode = code.replace(/<\/script/gi, "<\\/script");

    iframe.srcdoc = `<!DOCTYPE html><html><body><script>
(function(){
  var post = function(type, value){
    window.parent.postMessage({__src:'jsprep',type:type,value:value},'*')
  }
  var _log = function(){
    var value = Array.prototype.slice.call(arguments).map(function(a){
      if(a===undefined) return 'undefined'
      if(a===null) return 'null'
      if(typeof a==='function') return a.toString()
      if(typeof a==='object'){ try{ return JSON.stringify(a,null,2) }catch(e){ return '[object]' } }
      return String(a)
    }).join(' ')
    post('log', value)
  }
  console.log=_log; console.warn=_log; console.info=_log; console.error=_log

  // Errors while the code first runs, syntax errors included, end the run.
  // Errors inside later timer callbacks are ignored, as before.
  var syncPhase = true
  window.addEventListener('error', function(ev){
    if (!syncPhase) return
    syncPhase = false
    post('error', ev.error && ev.error.message ? ev.error.message : String(ev.message).replace(/^Uncaught /, ''))
  })

  // Track pending timers so the run ends when the last one has fired.
  var _setTimeout = window.setTimeout, _clearTimeout = window.clearTimeout
  var _setInterval = window.setInterval, _clearInterval = window.clearInterval
  var pending = {}, count = 0
  var check = function(){
    _setTimeout(function(){ if (count === 0) post('done') }, 0)
  }
  window.setTimeout = function(fn, ms){
    var args = Array.prototype.slice.call(arguments, 2)
    var id = _setTimeout(function(){
      delete pending[id]; count--
      try { typeof fn === 'function' ? fn.apply(null, args) : eval(fn) } finally { check() }
    }, ms)
    pending[id] = true; count++
    return id
  }
  window.clearTimeout = function(id){
    if (pending[id]) { delete pending[id]; count--; check() }
    _clearTimeout(id)
  }
  window.setInterval = function(){
    var id = _setInterval.apply(null, arguments)
    pending[id] = true; count++
    return id
  }
  window.clearInterval = function(id){
    if (pending[id]) { delete pending[id]; count--; check() }
    _clearInterval(id)
  }
  window.__jsprepFinish = function(){
    if (!syncPhase) return
    syncPhase = false
    check()
  }
})()
<\/script><script>
${userCode}
<\/script><script>
window.__jsprepFinish()
<\/script></body></html>`;
  });
}
