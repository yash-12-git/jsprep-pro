export interface OutputQuestion {
  id: number
  cat: 'Event Loop & Promises' | 'Closures & Scope' | "'this' Binding" | 'Hoisting' | 'Type Coercion'
  difficulty: 'easy' | 'medium' | 'hard'
  title: string
  code: string
  answer: string
  explanation: string
  keyInsight: string
  tags: string[]
}

export const OUTPUT_CATEGORIES = [
  'Event Loop & Promises',
  'Closures & Scope',
  "'this' Binding",
  'Hoisting',
  'Type Coercion',
] as const

export const outputQuestions: OutputQuestion[] = [

  // ─── EVENT LOOP & PROMISES ───────────────────────────────────────────
  {
    id: 100, cat: 'Event Loop & Promises', difficulty: 'medium',
    title: 'Classic setTimeout vs Promise',
    tags: ['event-loop', 'microtask', 'macrotask'],
    code: `console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');`,
    answer: '1\n4\n3\n2',
    explanation: 'Sync code runs first (1, 4). Then microtasks drain (Promise → 3). Then macrotask queue (setTimeout → 2).',
    keyInsight: 'Microtasks (Promises) always run before macrotasks (setTimeout), even with 0ms delay.'
  },
  {
    id: 101, cat: 'Event Loop & Promises', difficulty: 'hard',
    title: 'Nested setTimeout and Promise',
    tags: ['event-loop', 'microtask', 'nesting'],
    code: `console.log('start');

setTimeout(() => {
  console.log('timeout 1');
  Promise.resolve().then(() => console.log('promise inside timeout'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('promise 1');
    setTimeout(() => console.log('timeout inside promise'), 0);
  })
  .then(() => console.log('promise 2'));

console.log('end');`,
    answer: 'start\nend\npromise 1\npromise 2\ntimeout 1\npromise inside timeout\ntimeout inside promise',
    explanation: `1. Sync: "start", "end"
2. Microtask queue: "promise 1" (queues a setTimeout), then "promise 2"
3. Macrotask: "timeout 1" (queues a microtask), then its microtask "promise inside timeout"
4. Last macrotask: "timeout inside promise"`,
    keyInsight: 'Each macrotask fully drains the microtask queue before the next macrotask runs.'
  },
  {
    id: 102, cat: 'Event Loop & Promises', difficulty: 'medium',
    title: 'async/await execution order',
    tags: ['async-await', 'microtask'],
    code: `async function foo() {
  console.log('foo start');
  await Promise.resolve();
  console.log('foo end');
}

console.log('1');
foo();
console.log('2');`,
    answer: '1\nfoo start\n2\nfoo end',
    explanation: 'foo() runs synchronously until the first await. The await suspends foo and returns control. "2" prints. Then the microtask resumes foo and prints "foo end".',
    keyInsight: 'Everything before the first await in an async function runs synchronously.'
  },
  {
    id: 103, cat: 'Event Loop & Promises', difficulty: 'hard',
    title: 'Promise chaining order',
    tags: ['promise', 'then-chain'],
    code: `Promise.resolve()
  .then(() => {
    console.log(1);
    return Promise.resolve(2);
  })
  .then(v => console.log(v));

Promise.resolve()
  .then(() => console.log(3))
  .then(() => console.log(4));`,
    answer: '1\n3\n4\n2',
    explanation: `Round 1 microtasks: logs 1 (but returning a Promise adds extra ticks), logs 3.
Round 2: logs 4 (chained from 3). The inner Promise.resolve(2) takes 2 extra microtask ticks to unwrap.
Round 3+: logs 2 last.`,
    keyInsight: 'Returning a Promise from .then() adds 2 extra microtask ticks — it\'s slower than returning a plain value.'
  },
  {
    id: 104, cat: 'Event Loop & Promises', difficulty: 'medium',
    title: 'Promise constructor is synchronous',
    tags: ['promise', 'constructor'],
    code: `console.log('1');

new Promise((resolve) => {
  console.log('2');
  resolve();
  console.log('3');
}).then(() => console.log('4'));

console.log('5');`,
    answer: '1\n2\n3\n5\n4',
    explanation: 'The Promise executor function runs synchronously. resolve() schedules the .then callback as a microtask but does NOT stop execution. "3" still prints before "5".',
    keyInsight: 'The Promise executor is synchronous. Only .then() callbacks are async (microtasks).'
  },
  {
    id: 105, cat: 'Event Loop & Promises', difficulty: 'hard',
    title: 'async/await vs .then chain',
    tags: ['async-await', 'promise', 'order'],
    code: `async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2');
}

console.log('start');
async1();
console.log('end');`,
    answer: 'start\nasync1 start\nasync2\nend\nasync1 end',
    explanation: '"start" logs. async1() called: logs "async1 start", calls async2(). async2 logs "async2" and returns. await suspends async1. Control returns to sync: "end" logs. Microtask resumes: "async1 end".',
    keyInsight: 'await suspends only the current async function — outer sync code continues immediately.'
  },
  {
    id: 106, cat: 'Event Loop & Promises', difficulty: 'hard',
    title: 'Multiple awaits',
    tags: ['async-await', 'microtask', 'multiple'],
    code: `async function run() {
  console.log('A');
  await null;
  console.log('B');
  await null;
  console.log('C');
}

run();
console.log('D');`,
    answer: 'A\nD\nB\nC',
    explanation: '"A" logs sync. First await suspends, "D" logs. Microtask 1 resumes: "B" logs. Second await suspends again. Microtask 2: "C" logs.',
    keyInsight: 'Each await is a suspension point — code after it resumes in a new microtask tick.'
  },

  // ─── CLOSURES & SCOPE ────────────────────────────────────────────────
  {
    id: 200, cat: 'Closures & Scope', difficulty: 'easy',
    title: 'Classic var in loop closure',
    tags: ['closure', 'var', 'loop'],
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
    answer: '3\n3\n3',
    explanation: 'var is function-scoped, not block-scoped. All 3 callbacks close over the SAME i variable. By the time they run, the loop has finished and i = 3.',
    keyInsight: 'var leaks out of block scope. All closures share one variable.'
  },
  {
    id: 201, cat: 'Closures & Scope', difficulty: 'easy',
    title: 'let in loop closure (fix)',
    tags: ['closure', 'let', 'loop'],
    code: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
    answer: '0\n1\n2',
    explanation: 'let is block-scoped. Each loop iteration creates a NEW binding of i. Each closure captures its own unique i.',
    keyInsight: 'let creates a new variable per iteration — each closure gets its own copy.'
  },
  {
    id: 202, cat: 'Closures & Scope', difficulty: 'medium',
    title: 'Closure counter',
    tags: ['closure', 'counter', 'state'],
    code: `function makeCounter() {
  let count = 0;
  return {
    inc: () => ++count,
    dec: () => --count,
    val: () => count
  };
}

const a = makeCounter();
const b = makeCounter();

a.inc(); a.inc(); b.inc();
console.log(a.val());
console.log(b.val());`,
    answer: '2\n1',
    explanation: 'Each makeCounter() call creates an independent closure with its own count. a and b do not share state.',
    keyInsight: 'Each function call creates a fresh closure environment — independent state.'
  },
  {
    id: 203, cat: 'Closures & Scope', difficulty: 'medium',
    title: 'IIFE closure',
    tags: ['closure', 'iife', 'loop'],
    code: `for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 0);
  })(i);
}`,
    answer: '0\n1\n2',
    explanation: 'The IIFE creates a new function scope for each iteration, capturing the current value of i as j. This was the pre-let fix for the classic closure bug.',
    keyInsight: 'IIFEs create new scope — the pre-let solution to capture loop variable values.'
  },
  {
    id: 204, cat: 'Closures & Scope', difficulty: 'hard',
    title: 'Closure variable lookup',
    tags: ['closure', 'scope-chain'],
    code: `let x = 'global';

function outer() {
  let x = 'outer';
  function inner() {
    console.log(x);
  }
  return inner;
}

const fn = outer();
x = 'changed';
fn();`,
    answer: 'outer',
    explanation: 'inner closes over the x in outer\'s scope (\'outer\'), not the global x. Even though global x changed to \'changed\', inner\'s closure references outer\'s x which never changed.',
    keyInsight: 'Closures capture the variable from their specific lexical scope, not outer scopes with the same name.'
  },
  {
    id: 205, cat: 'Closures & Scope', difficulty: 'hard',
    title: 'Shared closure mutation',
    tags: ['closure', 'shared-reference'],
    code: `function makeAdders() {
  const adders = [];
  for (var i = 1; i <= 3; i++) {
    adders.push(function(x) { return x + i; });
  }
  return adders;
}

const [add1, add2, add3] = makeAdders();
console.log(add1(10));
console.log(add2(10));
console.log(add3(10));`,
    answer: '14\n14\n14',
    explanation: 'All functions close over the same var i. After the loop, i = 4 (incremented past condition). So all return 10 + 4 = 14.',
    keyInsight: 'All three functions share the same i variable — and i is 4 after the loop ends.'
  },
  {
    id: 206, cat: 'Closures & Scope', difficulty: 'medium',
    title: 'Block scope with let',
    tags: ['block-scope', 'let', 'const'],
    code: `{
  let a = 1;
  var b = 2;
}

console.log(typeof a);
console.log(typeof b);`,
    answer: 'undefined\nnumber',
    explanation: 'let is block-scoped — a is not accessible outside the block. typeof a returns "undefined" without throwing. var leaks out of the block.',
    keyInsight: 'typeof on undeclared variables returns "undefined" (doesn\'t throw). let is block-scoped, var is not.'
  },

  // ─── THIS BINDING ────────────────────────────────────────────────────
  {
    id: 300, cat: "'this' Binding", difficulty: 'medium',
    title: 'Method extracted from object',
    tags: ['this', 'method', 'context-loss'],
    code: `const obj = {
  name: 'Alice',
  greet() {
    console.log(this.name);
  }
};

const greet = obj.greet;
greet();`,
    answer: 'undefined',
    explanation: 'When greet is extracted from the object and called as a plain function, this is undefined (strict mode) or the global object (non-strict). Either way, this.name is undefined.',
    keyInsight: 'this is determined by HOW the function is called, not where it was defined.'
  },
  {
    id: 301, cat: "'this' Binding", difficulty: 'medium',
    title: 'Arrow function this',
    tags: ['this', 'arrow-function', 'lexical'],
    code: `const obj = {
  name: 'Bob',
  greet: () => {
    console.log(this?.name);
  },
  greetRegular() {
    console.log(this.name);
  }
};

obj.greet();
obj.greetRegular();`,
    answer: 'undefined\nBob',
    explanation: 'Arrow functions inherit this from their lexical scope (where they were defined). At the object literal level, this is the global object/undefined — not the object. greetRegular() uses this = obj correctly.',
    keyInsight: 'Arrow functions have no own this — they capture it from the surrounding scope at definition time.'
  },
  {
    id: 302, cat: "'this' Binding", difficulty: 'hard',
    title: 'this in nested function',
    tags: ['this', 'nested', 'context'],
    code: `const obj = {
  value: 42,
  getValue() {
    function inner() {
      return this?.value;
    }
    return inner();
  }
};

console.log(obj.getValue());`,
    answer: 'undefined',
    explanation: 'inner() is called as a plain function, not as a method. So this inside inner is undefined (strict) or global. It does NOT inherit obj\'s this.',
    keyInsight: 'Regular nested functions lose the outer this. Fix: use arrow function or const self = this.'
  },
  {
    id: 303, cat: "'this' Binding", difficulty: 'hard',
    title: 'bind creates new function',
    tags: ['this', 'bind', 'immutable'],
    code: `function greet() {
  console.log(this.name);
}

const alice = { name: 'Alice' };
const bob = { name: 'Bob' };

const greetAlice = greet.bind(alice);
greetAlice.call(bob);`,
    answer: 'Alice',
    explanation: 'bind() creates a permanently bound function — this cannot be overridden by call(), apply(), or even new (with some exceptions). The bound this always wins.',
    keyInsight: 'A bound function\'s this is permanent. call/apply cannot override it.'
  },
  {
    id: 304, cat: "'this' Binding", difficulty: 'medium',
    title: 'setTimeout this loss',
    tags: ['this', 'settimeout', 'context-loss'],
    code: `const timer = {
  seconds: 0,
  start() {
    setTimeout(function() {
      this.seconds++;
      console.log(this.seconds);
    }, 100);
  }
};

timer.start();`,
    answer: 'NaN',
    explanation: 'The regular function callback passed to setTimeout loses context. this becomes the global object (or undefined in strict). global.seconds is undefined, undefined++ is NaN.',
    keyInsight: 'setTimeout callbacks lose their this. Fix with arrow function: setTimeout(() => { this.seconds++ })'
  },
  {
    id: 305, cat: "'this' Binding", difficulty: 'hard',
    title: 'this in class methods',
    tags: ['this', 'class', 'event-listener'],
    code: `class Counter {
  count = 0;

  increment() {
    this.count++;
    console.log(this.count);
  }
}

const c = new Counter();
const inc = c.increment;
inc();`,
    answer: 'TypeError: Cannot set properties of undefined',
    explanation: 'Extracting the method loses the class instance as this. In strict mode (classes always use strict), this is undefined. Accessing undefined.count throws a TypeError.',
    keyInsight: 'Class methods are not auto-bound. Always bind in constructor or use arrow class fields.'
  },

  // ─── HOISTING ────────────────────────────────────────────────────────
  {
    id: 400, cat: 'Hoisting', difficulty: 'easy',
    title: 'var hoisting',
    tags: ['hoisting', 'var', 'undefined'],
    code: `console.log(x);
var x = 5;
console.log(x);`,
    answer: 'undefined\n5',
    explanation: 'var declarations are hoisted (moved to top of scope) but NOT initializations. So x exists but is undefined until the assignment runs.',
    keyInsight: 'var hoisting: declaration hoisted, initialization stays. Result: undefined, not ReferenceError.'
  },
  {
    id: 401, cat: 'Hoisting', difficulty: 'easy',
    title: 'Function declaration hoisting',
    tags: ['hoisting', 'function-declaration'],
    code: `console.log(foo());

function foo() {
  return 'hello';
}`,
    answer: 'hello',
    explanation: 'Function declarations are fully hoisted — both name AND body. You can call them before they appear in code.',
    keyInsight: 'Function declarations are hoisted completely. Function expressions are not.'
  },
  {
    id: 402, cat: 'Hoisting', difficulty: 'medium',
    title: 'Function expression not hoisted',
    tags: ['hoisting', 'function-expression', 'var'],
    code: `console.log(typeof foo);
console.log(foo());

var foo = function() {
  return 'hello';
};`,
    answer: 'undefined\nTypeError: foo is not a function',
    explanation: 'var foo is hoisted as undefined. Calling undefined() throws TypeError. The function is not assigned until that line executes.',
    keyInsight: 'Function expressions stored in var are NOT hoisted as functions — only the var declaration is.'
  },
  {
    id: 403, cat: 'Hoisting', difficulty: 'medium',
    title: 'let temporal dead zone',
    tags: ['hoisting', 'let', 'tdz'],
    code: `console.log(typeof x);
console.log(typeof y);

let x = 1;
var y = 2;`,
    answer: 'ReferenceError: Cannot access \'x\' before initialization',
    explanation: 'let is hoisted but stays in the Temporal Dead Zone (TDZ) until its declaration. Accessing it before declaration throws ReferenceError, not undefined. typeof does NOT save you here.',
    keyInsight: 'let/const are in TDZ from block start to declaration. Even typeof throws ReferenceError in TDZ.'
  },
  {
    id: 404, cat: 'Hoisting', difficulty: 'hard',
    title: 'Function vs var hoisting order',
    tags: ['hoisting', 'function', 'var', 'order'],
    code: `console.log(foo);

var foo = 'bar';

function foo() {
  return 'function';
}

console.log(foo);`,
    answer: '[Function: foo]\nbar',
    explanation: 'Function declarations take priority over var during hoisting. So foo is the function initially. Then the var assignment overwrites it with "bar".',
    keyInsight: 'Function declarations win over var during hoisting. But later assignments still overwrite.'
  },
  {
    id: 405, cat: 'Hoisting', difficulty: 'hard',
    title: 'Hoisting inside blocks',
    tags: ['hoisting', 'block', 'function'],
    code: `console.log(typeof foo);

{
  function foo() {}
}

console.log(typeof foo);`,
    answer: 'undefined\nfunction',
    explanation: 'In non-strict mode, block-level function declarations are partially hoisted to the enclosing function scope but only initialized when the block is reached. Behavior varies across environments.',
    keyInsight: 'Block-level function declarations behave inconsistently — avoid them. Use function expressions inside blocks.'
  },

  // ─── TYPE COERCION ───────────────────────────────────────────────────
  {
    id: 500, cat: 'Type Coercion', difficulty: 'easy',
    title: 'Loose equality coercion',
    tags: ['coercion', 'equality', 'typeof'],
    code: `console.log(0 == false);
console.log(1 == true);
console.log('' == false);
console.log(null == undefined);
console.log(null == false);`,
    answer: 'true\ntrue\ntrue\ntrue\nfalse',
    explanation: '0==false: both coerce to 0. 1==true: both coerce to 1. ""==false: both coerce to 0. null==undefined: special case in spec. null==false: null only equals null/undefined, not false.',
    keyInsight: 'null only loosely equals null and undefined — nothing else. This trips everyone up.'
  },
  {
    id: 501, cat: 'Type Coercion', difficulty: 'medium',
    title: 'Addition vs concatenation',
    tags: ['coercion', 'addition', 'string'],
    code: `console.log(1 + '2');
console.log('3' - 1);
console.log(true + true);
console.log([] + []);
console.log([] + {});
console.log({} + []);`,
    answer: '"12"\n2\n2\n""\n"[object Object]"\n0',
    explanation: `1+'2': number+string = string concat "12".
'3'-1: - forces numeric, 3-1=2.
true+true: true coerces to 1, 1+1=2.
[]+[]: both to string "", ""+"" = "".
[]+{}: ""+"[object Object]".
{}+[]: {} parsed as empty block, +[] = +0 = 0.`,
    keyInsight: '+ is overloaded (concat/add). If either side is a string, it concatenates. - always forces numbers.'
  },
  {
    id: 502, cat: 'Type Coercion', difficulty: 'medium',
    title: 'Falsy values comparison',
    tags: ['coercion', 'falsy', 'equality'],
    code: `console.log(false == 0);
console.log(false == '');
console.log(false == '0');
console.log(0 == '');
console.log(0 == '0');
console.log('' == '0');`,
    answer: 'true\ntrue\ntrue\ntrue\ntrue\nfalse',
    explanation: 'All combinations of false/0/"" coerce to 0 and are equal. But "0" as a string and "" as a string are NOT equal to each other — string comparison, no coercion needed.',
    keyInsight: 'Coercion is not transitive: false==0, false=="", but 0!="0" in string context.'
  },
  {
    id: 503, cat: 'Type Coercion', difficulty: 'medium',
    title: 'NaN comparison',
    tags: ['coercion', 'nan', 'equality'],
    code: `console.log(NaN == NaN);
console.log(NaN === NaN);
console.log(NaN != NaN);
console.log(Number.isNaN(NaN));
console.log(isNaN('hello'));`,
    answer: 'false\nfalse\ntrue\ntrue\ntrue',
    explanation: 'NaN is the only value not equal to itself (both == and ===). Use Number.isNaN() for reliable check. Legacy isNaN() coerces first — isNaN("hello") converts "hello" to NaN then returns true.',
    keyInsight: 'NaN !== NaN. Always use Number.isNaN() not isNaN() — isNaN coerces its argument first.'
  },
  {
    id: 504, cat: 'Type Coercion', difficulty: 'hard',
    title: 'Object to primitive coercion',
    tags: ['coercion', 'object', 'valueof', 'tostring'],
    code: `const obj = {
  valueOf() { return 42; },
  toString() { return 'hello'; }
};

console.log(obj + 1);
console.log(\`\${obj}\`);
console.log(obj * 2);`,
    answer: '43\nhello\n84',
    explanation: 'For + with number, valueOf() is preferred → 42+1=43. Template literals prefer toString() → "hello". Arithmetic (*) forces numeric: valueOf() → 42*2=84.',
    keyInsight: 'valueOf() is preferred for arithmetic. toString() for string contexts. You can customize both.'
  },
  {
    id: 505, cat: 'Type Coercion', difficulty: 'hard',
    title: 'Unary plus operator',
    tags: ['coercion', 'unary', 'conversion'],
    code: `console.log(+true);
console.log(+false);
console.log(+null);
console.log(+undefined);
console.log(+'42');
console.log(+'');
console.log(+[]);
console.log(+{});`,
    answer: '1\n0\n0\nNaN\n42\n0\n0\nNaN',
    explanation: 'Unary + converts to number. true→1, false→0, null→0, undefined→NaN. "42"→42, ""→0. []→""→0. {}→"[object Object]"→NaN.',
    keyInsight: 'Unary + is the fastest type-to-number conversion. Memorize: null→0, undefined→NaN, []→0, {}→NaN.'
  },
  {
    id: 506, cat: 'Type Coercion', difficulty: 'medium',
    title: 'Comparison coercion',
    tags: ['coercion', 'comparison', 'greater-than'],
    code: `console.log('10' > '9');
console.log('10' > 9);
console.log(null > 0);
console.log(null == 0);
console.log(null >= 0);`,
    answer: 'false\ntrue\nfalse\nfalse\ntrue',
    explanation: '"10">"9": string comparison — "1" vs "9" by char code, "1"<"9" so false. "10">9: string vs number, "10"→10, 10>9=true. null: null==0 is false (special rule). null>=0 is true (numeric: 0>=0). null>0 is false (numeric: 0>0).',
    keyInsight: 'String comparison is lexicographic (char by char). null equality is special — it only equals undefined.'
  },
  {
    id: 507, cat: 'Type Coercion', difficulty: 'hard',
    title: 'Tricky array coercion',
    tags: ['coercion', 'array', 'tostring'],
    code: `console.log([] == ![]);
console.log([] == false);
console.log(+[]);
console.log(+[1]);
console.log(+[1,2]);`,
    answer: 'true\ntrue\n0\n1\nNaN',
    explanation: `[]==![]: ![] is false ([] is truthy). []==false. [].toString()="" then +"" =0. false→0. 0==0 → true.
[]==false: [].toString()="", +""=0, false→0, 0==0→true.
+[]: []→""→0.
+[1]: [1]→"1"→1.
+[1,2]: [1,2]→"1,2"→NaN.`,
    keyInsight: 'Arrays coerce to strings via .join(","). []==![] is true — one of JS\'s most infamous "wat" moments.'
  },

  // ─── MORE EVENT LOOP ─────────────────────────────────────────────────
  {
    id: 107, cat: 'Event Loop & Promises', difficulty: 'hard',
    title: 'queueMicrotask vs Promise',
    tags: ['microtask', 'queueMicrotask'],
    code: `console.log('1');

queueMicrotask(() => console.log('2'));

Promise.resolve().then(() => console.log('3'));

queueMicrotask(() => console.log('4'));

console.log('5');`,
    answer: '1\n5\n2\n3\n4',
    explanation: 'queueMicrotask and Promise.then both add to the microtask queue in order. 1 and 5 run sync. Then microtasks drain in order: 2, 3, 4.',
    keyInsight: 'queueMicrotask and Promise.resolve().then() are equivalent in priority — FIFO within the microtask queue.'
  },
  {
    id: 108, cat: 'Event Loop & Promises', difficulty: 'medium',
    title: 'Promise.all ordering',
    tags: ['promise-all', 'order'],
    code: `async function delay(ms, val) {
  await new Promise(r => setTimeout(r, ms));
  return val;
}

const [a, b, c] = await Promise.all([
  delay(300, 'slow'),
  delay(100, 'fast'),
  delay(200, 'medium')
]);

console.log(a, b, c);`,
    answer: 'slow fast medium',
    explanation: 'Promise.all preserves the order of results matching the input array — regardless of which resolves first. "fast" finishes first but appears second in results.',
    keyInsight: 'Promise.all result order matches INPUT order, not resolution order.'
  },

  // ─── MORE CLOSURES ───────────────────────────────────────────────────
  {
    id: 207, cat: 'Closures & Scope', difficulty: 'hard',
    title: 'Module pattern with closure',
    tags: ['closure', 'module', 'iife'],
    code: `const counter = (() => {
  let _count = 0;
  return {
    increment() { return ++_count; },
    reset() { _count = 0; },
    get value() { return _count; }
  };
})();

counter.increment();
counter.increment();
console.log(counter.value);
console.log(counter._count);
counter.reset();
console.log(counter.value);`,
    answer: '2\nundefined\n0',
    explanation: '_count is private inside the IIFE closure. The returned object can access it via closure, but external code cannot. counter._count is undefined.',
    keyInsight: 'IIFE + closure = module pattern for private state. The gold standard before ES modules.'
  },
  {
    id: 208, cat: 'Closures & Scope', difficulty: 'medium',
    title: 'Scope chain lookup',
    tags: ['scope', 'scope-chain', 'lookup'],
    code: `let a = 1;

function outer() {
  let b = 2;
  function inner() {
    let c = 3;
    console.log(a, b, c);
  }
  inner();
}

outer();`,
    answer: '1 2 3',
    explanation: 'inner can access c (own scope), b (outer\'s scope via closure), and a (global via scope chain). JS walks up the scope chain until it finds the variable.',
    keyInsight: 'Scope chain: inner function looks up through all enclosing scopes until global.'
  },

  // ─── MORE THIS ───────────────────────────────────────────────────────
  {
    id: 306, cat: "'this' Binding", difficulty: 'hard',
    title: 'call chain with this',
    tags: ['this', 'call', 'prototype'],
    code: `function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return 'Hi, I am ' + this.name;
};

const p = new Person('Alice');
const greet = p.greet;

console.log(p.greet());
console.log(greet());`,
    answer: 'Hi, I am Alice\nHi, I am undefined',
    explanation: 'p.greet() calls it as a method — this = p. greet() calls it as plain function — this = global/undefined, so this.name = undefined.',
    keyInsight: 'Methods only keep their this when called on the object. Extract them and this is lost.'
  },
]

export const FREE_OUTPUT_LIMIT = 5
