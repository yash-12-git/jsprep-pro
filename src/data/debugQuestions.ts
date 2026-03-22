/**
 * src/data/debugQuestions.ts
 *
 * CONTRACT — every question satisfies ALL of these:
 *  ✅ Pure JS only — no fetch, DOM, React, Node.js APIs
 *  ✅ brokenCode runs in sandbox WITHOUT throwing an error
 *  ✅ brokenCode produces WRONG console.log output (bug is silent)
 *  ✅ fixedCode logs expectedOutput exactly
 *  ✅ expectedOutput never contains "Error", "TypeError", "ReferenceError" etc.
 *  ✅ Teaches ONE core JS concept per question
 */

export interface DebugQuestion {
  id: number;
  cat:
    | "Closures & Scope"
    | "'this' Binding"
    | "Event Loop & Promises"
    | "Prototypes & Inheritance"
    | "Type Coercion"
    | "Array & Object Mutations"
    | "Modern JS";
  difficulty: "easy" | "medium" | "hard";
  title: string;
  description: string;
  brokenCode: string;
  bugDescription: string;
  fixedCode: string;
  expectedOutput: string; // what fixedCode logs — used for seeding & AI evaluation
  explanation: string;
  keyInsight: string;
  tags: string[];
  companies?: string[];
}

export const DEBUG_CATEGORIES = [
  "Closures & Scope",
  "'this' Binding",
  "Event Loop & Promises",
  "Prototypes & Inheritance",
  "Type Coercion",
  "Array & Object Mutations",
  "Modern JS",
] as const;

export const debugQuestions: DebugQuestion[] = [
  // ─── CLOSURES & SCOPE ─────────────────────────────────────────────────────

  {
    id: 100,
    cat: "Closures & Scope",
    difficulty: "easy",
    title: "var in loop — all closures share one variable",
    description:
      "This should log 0, 1, 2 but logs something else. Find and fix the bug.",
    tags: ["closure", "var", "loop", "scope"],
    brokenCode: `const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => console.log(i));
}
fns.forEach(f => f());`,
    bugDescription:
      "var is function-scoped, not block-scoped. All three closures share the same i. By the time they run, i is already 3.",
    fixedCode: `const fns = [];
for (let i = 0; i < 3; i++) {
  fns.push(() => console.log(i));
}
fns.forEach(f => f());`,
    expectedOutput: "0\n1\n2",
    explanation:
      "let creates a new binding per loop iteration. Each closure captures its own i — 0, 1, 2 — instead of sharing the single var i.",
    keyInsight:
      "var in loops + closures = all closures see the final value. Always use let when creating closures inside loops.",
  },

  {
    id: 101,
    cat: "Closures & Scope",
    difficulty: "medium",
    title: "Counter factory shares global state",
    description:
      "Two counters should be independent but they interfere. Fix it.",
    tags: ["closure", "factory", "scope"],
    brokenCode: `let count = 0;

function makeCounter() {
  return {
    increment() { count++; },
    value()     { return count; },
  };
}

const a = makeCounter();
const b = makeCounter();
a.increment();
a.increment();
b.increment();
console.log(a.value());
console.log(b.value());`,
    bugDescription:
      "count is declared outside makeCounter — all counters share the same variable. a and b are not independent.",
    fixedCode: `function makeCounter() {
  let count = 0;
  return {
    increment() { count++; },
    value()     { return count; },
  };
}

const a = makeCounter();
const b = makeCounter();
a.increment();
a.increment();
b.increment();
console.log(a.value());
console.log(b.value());`,
    expectedOutput: "2\n1",
    explanation:
      "Moving count inside makeCounter creates a new independent variable per call via closure.",
    keyInsight:
      "For factory functions, declare state inside the factory — each call gets its own private closure.",
  },

  {
    id: 102,
    cat: "Closures & Scope",
    difficulty: "medium",
    title: "Shared memoize cache across all functions",
    description:
      "triple(5) returns 10 instead of 15. Fix the memoize function.",
    tags: ["closure", "memoization", "cache"],
    brokenCode: `const cache = {};

function memoize(fn) {
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    cache[key] = fn(...args);
    return cache[key];
  };
}

const double = memoize(x => x * 2);
const triple = memoize(x => x * 3);

double(5);
console.log(triple(5));`,
    bugDescription:
      'cache is declared outside memoize — all memoized functions share one global cache. double(5)=10 is stored under key "[5]". triple(5) finds "[5]" and returns 10.',
    fixedCode: `function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    cache[key] = fn(...args);
    return cache[key];
  };
}

const double = memoize(x => x * 2);
const triple = memoize(x => x * 3);

double(5);
console.log(triple(5));`,
    expectedOutput: "15",
    explanation:
      "Moving cache inside memoize gives each memoized function its own private cache via closure.",
    keyInsight:
      "State inside a factory function is private to each returned function — this is the closure encapsulation pattern.",
  },

  {
    id: 103,
    cat: "Closures & Scope",
    difficulty: "easy",
    title: "Wallet exposes stale primitive snapshot",
    description:
      "w._balance shows 100 after a deposit of 50. getBalance shows 150. What's the bug?",
    tags: ["closure", "encapsulation", "primitive"],
    brokenCode: `function createWallet(initial) {
  let _balance = initial;
  return {
    _balance,
    deposit(n)   { _balance += n; },
    getBalance() { return _balance; },
  };
}

const w = createWallet(100);
w.deposit(50);
console.log(w._balance);
console.log(w.getBalance());`,
    bugDescription:
      "return { _balance } copies the primitive value (100) at creation time. It does not create a live reference. Deposits update the closure variable but not the snapshot in the object.",
    fixedCode: `function createWallet(initial) {
  let _balance = initial;
  return {
    deposit(n)   { _balance += n; },
    getBalance() { return _balance; },
  };
}

const w = createWallet(100);
w.deposit(50);
console.log(w._balance);
console.log(w.getBalance());`,
    expectedOutput: "undefined\n150",
    explanation:
      "Removing _balance from the returned object makes it truly private. The only way to read it is getBalance(), which always reads the live closure variable.",
    keyInsight:
      "Returning a primitive copies its value. Expose only methods that close over the variable — that is true encapsulation.",
  },

  {
    id: 104,
    cat: "Closures & Scope",
    difficulty: "hard",
    title: "Default parameter creates new function every call",
    description: "The WeakMap cache never hits on repeated calls. Fix it.",
    tags: ["closure", "default-params", "weakmap", "identity"],
    brokenCode: `const cache = new WeakMap();

function process(data, transform = x => x * 2) {
  if (cache.has(transform)) {
    console.log('hit');
    return cache.get(transform)(data);
  }
  console.log('miss');
  cache.set(transform, transform);
  return transform(data);
}

process(5);
process(5);`,
    bugDescription:
      "The default x => x * 2 is a NEW function object on every call. Each invocation gets a unique reference — WeakMap.has() never finds it.",
    fixedCode: `const defaultTransform = x => x * 2;
const cache = new WeakMap();

function process(data, transform = defaultTransform) {
  if (cache.has(transform)) {
    console.log('hit');
    return cache.get(transform)(data);
  }
  console.log('miss');
  cache.set(transform, transform);
  return transform(data);
}

process(5);
process(5);`,
    expectedOutput: "miss\nhit",
    explanation:
      "Defining the default outside gives it a stable identity. Same reference every time, so WeakMap finds it on the second call.",
    keyInsight:
      "Default parameter expressions are re-evaluated on every call. If identity matters (WeakMap, memoization), define the constant outside.",
  },

  {
    id: 105,
    cat: "Closures & Scope",
    difficulty: "medium",
    title: "Shared mutable default accumulates state",
    description: "p2 should have one tag but has two. Fix it.",
    tags: ["closure", "default-params", "mutation"],
    brokenCode: `const DEFAULT = { tags: [] };

function createPost(title, config = DEFAULT) {
  config.tags.push('published');
  return { title, tags: config.tags };
}

const p1 = createPost('Hello');
const p2 = createPost('World');
console.log(p1.tags.length);
console.log(p2.tags.length);`,
    bugDescription:
      "DEFAULT is a shared object. push() mutates the shared tags array. p2 starts with p1's tag already in it.",
    fixedCode: `function createPost(title, config = {}) {
  const tags = [...(config.tags ?? []), 'published'];
  return { title, tags };
}

const p1 = createPost('Hello');
const p2 = createPost('World');
console.log(p1.tags.length);
console.log(p2.tags.length);`,
    expectedOutput: "1\n1",
    explanation:
      "Using {} as default and spreading creates a fresh array per call. No shared state between calls.",
    keyInsight:
      "Never mutate default parameter objects. Use {} and create fresh arrays/objects inside the function body.",
  },

  // ─── 'THIS' BINDING ───────────────────────────────────────────────────────

  {
    id: 200,
    cat: "'this' Binding",
    difficulty: "easy",
    title: "Method detached from object loses this",
    description:
      "greet() should log the person's name but logs undefined. Fix it.",
    tags: ["this", "method", "bind"],
    brokenCode: `const person = {
  name: 'Alice',
  greet() { console.log('Hello, ' + this.name); },
};

const greet = person.greet;
greet();`,
    bugDescription:
      "Assigning the method to a variable detaches it from the object. When called as a plain function, this is undefined — not person.",
    fixedCode: `const person = {
  name: 'Alice',
  greet() { console.log('Hello, ' + this.name); },
};

const greet = person.greet.bind(person);
greet();`,
    expectedOutput: "Hello, Alice",
    explanation:
      "bind(person) permanently ties this to person regardless of how greet is later called.",
    keyInsight:
      "this is determined by the call site, not the definition site. Bind when storing a method as a variable.",
  },

  {
    id: 201,
    cat: "'this' Binding",
    difficulty: "easy",
    title: "Arrow function as object method has no own this",
    description: "The greeting logs undefined instead of the name. Fix it.",
    tags: ["this", "arrow", "method"],
    brokenCode: `const obj = {
  name: 'JSPrep',
  greet: () => console.log('Hi from ' + (this && this.name)),
};

obj.greet();`,
    bugDescription:
      "Arrow functions inherit this from the enclosing lexical scope. At the module level this is undefined — not obj.",
    fixedCode: `const obj = {
  name: 'JSPrep',
  greet() { console.log('Hi from ' + this.name); },
};

obj.greet();`,
    expectedOutput: "Hi from JSPrep",
    explanation:
      "Regular method shorthand greet() { } has its own this, correctly set to obj when called as obj.greet().",
    keyInsight:
      "Never use arrow functions as object methods that rely on this. Use method shorthand instead.",
  },

  {
    id: 202,
    cat: "'this' Binding",
    difficulty: "medium",
    title: "Regular callback inside method loses this",
    description:
      "The setTimeout callback should log the counter value but logs undefined. Fix it.",
    tags: ["this", "callback", "arrow", "settimeout"],
    brokenCode: `const counter = {
  value: 42,
  logAfterDelay() {
    setTimeout(function() {
      console.log(this && this.value);
    }, 0);
  },
};

counter.logAfterDelay();`,
    bugDescription:
      "Regular function callbacks lose their this context. Inside the setTimeout, this is undefined — not counter.",
    fixedCode: `const counter = {
  value: 42,
  logAfterDelay() {
    setTimeout(() => {
      console.log(this.value);
    }, 0);
  },
};

counter.logAfterDelay();`,
    expectedOutput: "42",
    explanation:
      "Arrow function callbacks inherit this from their enclosing scope — here, the logAfterDelay method where this is counter.",
    keyInsight:
      "Use arrow functions as callbacks inside methods to preserve the outer this.",
  },

  {
    id: 203,
    cat: "'this' Binding",
    difficulty: "medium",
    title: "bind is permanent — call cannot override it",
    description:
      "The second call should log Bob but still logs Alice. Fix it to log both correctly.",
    tags: ["this", "bind", "call"],
    brokenCode: `function getName() {
  console.log(this.name);
}

const alice = { name: 'Alice' };
const bob   = { name: 'Bob'   };

const boundAlice = getName.bind(alice);
boundAlice();
boundAlice.call(bob);`,
    bugDescription:
      "bind permanently fixes this. .call(bob) cannot override a bound function — it still runs with alice as this.",
    fixedCode: `function getName() {
  console.log(this.name);
}

const alice = { name: 'Alice' };
const bob   = { name: 'Bob'   };

const boundAlice = getName.bind(alice);
boundAlice();
getName.call(bob);`,
    expectedOutput: "Alice\nBob",
    explanation:
      "To use bob's context, call the original unbound function with .call(bob) — not the bound version.",
    keyInsight:
      "bind() creates a permanently bound function. call/apply cannot override it. Keep a reference to the original if you need different contexts.",
  },

  // ─── EVENT LOOP & PROMISES ────────────────────────────────────────────────

  {
    id: 300,
    cat: "Event Loop & Promises",
    difficulty: "easy",
    title: "Missing return in Promise chain drops value",
    description:
      "The final log should print 10 but prints undefined. Fix the chain.",
    tags: ["promise", "return", "chain"],
    brokenCode: `Promise.resolve(5)
  .then(n => {
    n * 2;
  })
  .then(n => console.log(n));`,
    bugDescription:
      "The first .then has no return statement — it returns undefined implicitly. The next .then receives undefined, not 10.",
    fixedCode: `Promise.resolve(5)
  .then(n => {
    return n * 2;
  })
  .then(n => console.log(n));`,
    expectedOutput: "10",
    explanation:
      "Every .then that transforms a value must explicitly return it. Without return, the next handler in the chain receives undefined.",
    keyInsight:
      "Always return from .then() when you need the value downstream. Missing return is the most common Promise bug.",
  },

  {
    id: 301,
    cat: "Event Loop & Promises",
    difficulty: "medium",
    title: "Async function result is a Promise — not awaited",
    description:
      "The log should print 42 but prints a Promise object. Fix without changing getValue.",
    tags: ["async", "promise", "await"],
    brokenCode: `async function getValue() {
  return 42;
}

const result = getValue();
console.log(typeof result);`,
    bugDescription:
      'async functions always return a Promise. Without await or .then(), result is the Promise object — typeof gives "object", not "number".',
    fixedCode: `async function getValue() {
  return 42;
}

getValue().then(result => console.log(typeof result));`,
    expectedOutput: "number",
    explanation:
      "Chaining .then() unwraps the Promise. Now result inside the callback is the actual number 42.",
    keyInsight:
      "Calling an async function returns a Promise. You must .then() or await it to get the resolved value.",
  },

  {
    id: 302,
    cat: "Event Loop & Promises",
    difficulty: "medium",
    title: "Sequential awaits for independent operations",
    description:
      "The two operations are independent but run one after the other. Fix for parallel execution.",
    tags: ["promise", "parallel", "promise-all"],
    brokenCode: `function delay(ms, val) {
  return new Promise(r => setTimeout(() => r(val), ms));
}

async function run() {
  const a = await delay(50, 'a');
  const b = await delay(50, 'b');
  console.log(a);
  console.log(b);
}

run();`,
    bugDescription:
      "Sequential awaits mean b only starts after a resolves. Total time is ~100ms. These are independent and can run in parallel.",
    fixedCode: `function delay(ms, val) {
  return new Promise(r => setTimeout(() => r(val), ms));
}

async function run() {
  const [a, b] = await Promise.all([
    delay(50, 'a'),
    delay(50, 'b'),
  ]);
  console.log(a);
  console.log(b);
}

run();`,
    expectedOutput: "a\nb",
    explanation:
      "Promise.all fires both at the same time. Total time is ~50ms. Output order follows the array order, not resolution order.",
    keyInsight:
      "Sequential awaits for independent operations is a performance bug. Use Promise.all to run independent async operations in parallel.",
  },

  // ─── PROTOTYPES & INHERITANCE ────────────────────────────────────────────

  {
    id: 400,
    cat: "Prototypes & Inheritance",
    difficulty: "medium",
    title: "Shared array on prototype mutates all instances",
    description:
      "Adding to list1 should not affect list2 but it does. Fix the class.",
    tags: ["prototype", "mutation", "constructor"],
    brokenCode: `function TodoList() {}
TodoList.prototype.items = [];

const list1 = new TodoList();
const list2 = new TodoList();

list1.items.push('Buy milk');
console.log(list1.items.length);
console.log(list2.items.length);`,
    bugDescription:
      "Arrays on the prototype are shared by all instances. list1.items.push() mutates the single shared array, so list2 sees it too.",
    fixedCode: `function TodoList() {
  this.items = [];
}

const list1 = new TodoList();
const list2 = new TodoList();

list1.items.push('Buy milk');
console.log(list1.items.length);
console.log(list2.items.length);`,
    expectedOutput: "1\n0",
    explanation:
      "Initializing items in the constructor creates a fresh independent array per instance.",
    keyInsight:
      "Never put mutable state on a prototype. Always initialize arrays and objects in the constructor.",
  },

  {
    id: 401,
    cat: "Prototypes & Inheritance",
    difficulty: "medium",
    title: "hasOwnProperty vs in — different results for prototype method",
    description:
      "One check logs true and the other false for the same property. Predict and verify.",
    tags: ["prototype", "hasOwnProperty", "in"],
    brokenCode: `function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return this.name + ' speaks';
};

const dog = new Animal('Rex');

// Both checks reference 'speak' — what do they log?
if (dog.hasOwnProperty('speak') === ('speak' in dog)) {
  console.log('same');
} else {
  console.log('different');
}
console.log(dog.hasOwnProperty('speak'));
console.log('speak' in dog);`,
    bugDescription:
      "The developer expects both checks to return the same result. hasOwnProperty only checks own properties; in checks the whole prototype chain.",
    fixedCode: `function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return this.name + ' speaks';
};

const dog = new Animal('Rex');

if (dog.hasOwnProperty('speak') === ('speak' in dog)) {
  console.log('same');
} else {
  console.log('different');
}
console.log(dog.hasOwnProperty('speak'));
console.log('speak' in dog);`,
    expectedOutput: "different\nfalse\ntrue",
    explanation:
      "speak lives on the prototype — hasOwnProperty returns false. The in operator checks the entire chain — returns true.",
    keyInsight:
      "hasOwnProperty = own properties only. in = entire prototype chain. Use hasOwnProperty to distinguish instance vs inherited properties.",
  },

  // ─── TYPE COERCION ───────────────────────────────────────────────────────

  {
    id: 500,
    cat: "Type Coercion",
    difficulty: "easy",
    title: "NaN comparison is always false",
    description:
      'validate(NaN) should log "invalid" but logs "valid". Fix the check.',
    tags: ["nan", "comparison", "Number.isNaN"],
    brokenCode: `function validate(n) {
  if (n === NaN) {
    console.log('invalid');
  } else {
    console.log('valid: ' + n);
  }
}

validate(NaN);
validate(5);`,
    bugDescription:
      "NaN is the only value not equal to itself. n === NaN is always false for any value, including NaN.",
    fixedCode: `function validate(n) {
  if (Number.isNaN(n)) {
    console.log('invalid');
  } else {
    console.log('valid: ' + n);
  }
}

validate(NaN);
validate(5);`,
    expectedOutput: "invalid\nvalid: 5",
    explanation:
      "Number.isNaN() is the only reliable way to detect NaN. The global isNaN() coerces its argument first — Number.isNaN() does not.",
    keyInsight:
      "Never use === NaN. NaN !== NaN is always true. Use Number.isNaN().",
  },

  {
    id: 501,
    cat: "Type Coercion",
    difficulty: "easy",
    title: 'Loose equality treats 0 and "" as false',
    description:
      'isActive(0) should log "active: 0" but logs "inactive". Fix the check.',
    tags: ["coercion", "equality", "loose"],
    brokenCode: `function isActive(status) {
  if (status == false) {
    console.log('inactive');
  } else {
    console.log('active: ' + status);
  }
}

isActive(0);
isActive('');`,
    bugDescription:
      '== coerces both sides. 0 == false and "" == false are both true because all three coerce to 0. Valid status values 0 and "" are incorrectly treated as inactive.',
    fixedCode: `function isActive(status) {
  if (status === false) {
    console.log('inactive');
  } else {
    console.log('active: ' + status);
  }
}

isActive(0);
isActive('');`,
    expectedOutput: "active: 0\nactive: ",
    explanation:
      'With ===, only the boolean false is inactive. 0 and "" are valid statuses that pass through correctly.',
    keyInsight:
      'Use === when distinguishing false from other falsy values like 0, "", and null.',
  },

  {
    id: 502,
    cat: "Type Coercion",
    difficulty: "medium",
    title: "Plus operator concatenates strings instead of adding",
    description: 'The total should be 30 but logs "1020". Fix the function.',
    tags: ["coercion", "plus", "string", "number"],
    brokenCode: `function getTotal(a, b) {
  console.log(a + b);
}

getTotal('10', '20');`,
    bugDescription:
      'When either operand of + is a string, JS converts the other to a string and concatenates. "10" + "20" = "1020".',
    fixedCode: `function getTotal(a, b) {
  console.log(Number(a) + Number(b));
}

getTotal('10', '20');`,
    expectedOutput: "30",
    explanation:
      "Number() converts strings to numbers first. Then + performs numeric addition.",
    keyInsight:
      "+ prefers string concatenation when either operand is a string. Always explicitly convert with Number() when you need addition.",
  },

  // ─── ARRAY & OBJECT MUTATIONS ────────────────────────────────────────────

  {
    id: 600,
    cat: "Array & Object Mutations",
    difficulty: "easy",
    title: "Assignment copies reference — both variables point to same array",
    description:
      "sorted should be independent but original is modified too. Fix it.",
    tags: ["array", "mutation", "reference", "spread"],
    brokenCode: `const original = [3, 1, 2];
const sorted = original;
sorted.sort();
console.log(original.join(','));
console.log(sorted.join(','));`,
    bugDescription:
      "= for arrays copies the reference, not the data. sorted and original point to the same array. Sorting one sorts both.",
    fixedCode: `const original = [3, 1, 2];
const sorted = [...original];
sorted.sort();
console.log(original.join(','));
console.log(sorted.join(','));`,
    expectedOutput: "3,1,2\n1,2,3",
    explanation:
      "Spread [...original] creates a new independent array. Sorting sorted no longer affects original.",
    keyInsight:
      "= for arrays copies the reference. Use [...arr] or Array.from(arr) to create an independent copy.",
  },

  {
    id: 601,
    cat: "Array & Object Mutations",
    difficulty: "medium",
    title: "map returns new array but objects inside are still references",
    description:
      "Updating the copy's age should not change the original but it does. Fix it.",
    tags: ["array", "map", "shallow", "mutation"],
    brokenCode: `const users = [{ id: 1, name: 'Alice', age: 25 }];

function birthday(arr) {
  return arr.map(user => {
    user.age++;
    return user;
  });
}

const updated = birthday(users);
console.log(users[0].age);
console.log(updated[0].age);`,
    bugDescription:
      "map returns a new array but user is still a reference to the original object. user.age++ mutates the original.",
    fixedCode: `const users = [{ id: 1, name: 'Alice', age: 25 }];

function birthday(arr) {
  return arr.map(user => ({ ...user, age: user.age + 1 }));
}

const updated = birthday(users);
console.log(users[0].age);
console.log(updated[0].age);`,
    expectedOutput: "25\n26",
    explanation:
      "Spread { ...user, age: user.age + 1 } creates a new object for each element. The originals are untouched.",
    keyInsight:
      "map creates a new array but elements remain shared references. Spread objects inside map to create independent copies.",
  },

  {
    id: 602,
    cat: "Array & Object Mutations",
    difficulty: "medium",
    title: "Object.assign first argument is mutated",
    description:
      'defaults.lang should stay "en" but becomes "fr". Fix the merge.',
    tags: ["object", "assign", "mutation"],
    brokenCode: `const defaults  = { theme: 'light', lang: 'en' };
const userPrefs = { lang: 'fr' };
const settings  = Object.assign(defaults, userPrefs);

console.log(defaults.lang);
console.log(settings.lang);`,
    bugDescription:
      "Object.assign(target, ...sources) mutates and returns the target. defaults is the target here — it gets mutated.",
    fixedCode: `const defaults  = { theme: 'light', lang: 'en' };
const userPrefs = { lang: 'fr' };
const settings  = Object.assign({}, defaults, userPrefs);

console.log(defaults.lang);
console.log(settings.lang);`,
    expectedOutput: "en\nfr",
    explanation:
      "Using {} as the first argument creates a new merge target. defaults is now a source, not the target — it stays unchanged.",
    keyInsight:
      "Always use {} as the first argument to Object.assign to avoid mutating sources: Object.assign({}, defaults, overrides).",
  },

  {
    id: 603,
    cat: "Array & Object Mutations",
    difficulty: "medium",
    title: "Spread is shallow — nested array is still shared",
    description:
      "Pushing to the copy's scores array also modifies the original. Fix it.",
    tags: ["spread", "shallow", "nested", "mutation"],
    brokenCode: `const original = { name: 'Alice', scores: [90, 85] };
const copy = { ...original };

copy.scores.push(95);

console.log(original.scores.length);
console.log(copy.scores.length);`,
    bugDescription:
      "Spread creates a shallow copy. copy.scores and original.scores are the same array reference. Pushing to one pushes to both.",
    fixedCode: `const original = { name: 'Alice', scores: [90, 85] };
const copy = { ...original, scores: [...original.scores] };

copy.scores.push(95);

console.log(original.scores.length);
console.log(copy.scores.length);`,
    expectedOutput: "2\n3",
    explanation:
      "Explicitly spreading the nested array creates a new independent copy of scores.",
    keyInsight:
      "Spread is one level deep. Always explicitly spread nested arrays/objects that you plan to mutate independently.",
  },

  // ─── MODERN JS ───────────────────────────────────────────────────────────

  {
    id: 700,
    cat: "Modern JS",
    difficulty: "easy",
    title: "Manual swap loses original value",
    description: 'The swap logs "2 2" instead of "2 1". Fix it.',
    tags: ["destructuring", "swap"],
    brokenCode: `let a = 1;
let b = 2;
a = b;
b = a;
console.log(a, b);`,
    bugDescription:
      "a = b makes a = 2. Then b = a reads the already-changed a (2) — so b becomes 2. The original value of a (1) is lost.",
    fixedCode: `let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a, b);`,
    expectedOutput: "2 1",
    explanation:
      "Destructuring swap evaluates the right side first as a snapshot [2, 1], then assigns both simultaneously.",
    keyInsight:
      "Destructuring swap is atomic — values are captured before assignment. Sequential swap loses the original without a temp variable.",
  },

  {
    id: 701,
    cat: "Modern JS",
    difficulty: "easy",
    title: "sort() mutates the original array",
    description:
      "getSorted should return a sorted copy but the original is sorted too. Fix it.",
    tags: ["sort", "mutation", "spread"],
    brokenCode: `function getSorted(arr) {
  return arr.sort((a, b) => a - b);
}

const nums = [3, 1, 4, 1, 5];
const sorted = getSorted(nums);
console.log(nums.join(','));
console.log(sorted.join(','));`,
    bugDescription:
      "Array.sort() sorts in place and returns the same array. nums and sorted are the same array after the call.",
    fixedCode: `function getSorted(arr) {
  return [...arr].sort((a, b) => a - b);
}

const nums = [3, 1, 4, 1, 5];
const sorted = getSorted(nums);
console.log(nums.join(','));
console.log(sorted.join(','));`,
    expectedOutput: "3,1,4,1,5\n1,1,3,4,5",
    explanation:
      "Spread creates a copy before sorting. The original nums is untouched.",
    keyInsight:
      "sort() mutates in place. Always copy first: [...arr].sort(). ES2023 adds arr.toSorted() as a built-in immutable alternative.",
  },

  {
    id: 702,
    cat: "Modern JS",
    difficulty: "medium",
    title: "Regex with global flag alternates true/false",
    description:
      "The same valid email fails validation on the second call. Fix it.",
    tags: ["regex", "global", "lastindex", "stateful"],
    brokenCode: `const emailRegex = /^\\w+@\\w+\\.\\w+$/gi;

function isValid(email) {
  return emailRegex.test(email);
}

console.log(isValid('a@b.com'));
console.log(isValid('a@b.com'));`,
    bugDescription:
      "With the g flag, regex.test() advances lastIndex after a match. The next call starts from the advanced position — past the string end — returns false and resets to 0.",
    fixedCode: `const emailRegex = /^\\w+@\\w+\\.\\w+$/i;

function isValid(email) {
  return emailRegex.test(email);
}

console.log(isValid('a@b.com'));
console.log(isValid('a@b.com'));`,
    expectedOutput: "true\ntrue",
    explanation:
      "Removing g makes the regex stateless — always starts from position 0. g is only needed when finding multiple matches with exec() in a loop.",
    keyInsight:
      "The g flag makes regex stateful via lastIndex. Never use g for simple test() checks — it alternates true/false. Remove g or reset lastIndex = 0.",
  },

  {
    id: 703,
    cat: "Modern JS",
    difficulty: "hard",
    title: "Iterator is single-use — second loop produces nothing",
    description:
      "The second for...of should log the same values but logs nothing. Fix the iterable.",
    tags: ["iterator", "symbol-iterator", "closure"],
    brokenCode: `const range = {
  data: [1, 2, 3],
  index: 0,
  [Symbol.iterator]() {
    return {
      next: () => {
        if (this.index < this.data.length) {
          return { value: this.data[this.index++], done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const n of range) console.log(n);
for (const n of range) console.log(n);`,
    bugDescription:
      "index is stored on the range object itself — shared across all iterations. After the first loop, index = 3. The second loop starts with index = 3 and immediately gets done: true.",
    fixedCode: `const range = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    const data = this.data;
    return {
      next() {
        if (index < data.length) {
          return { value: data[index++], done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const n of range) console.log(n);
for (const n of range) console.log(n);`,
    expectedOutput: "1\n2\n3\n1\n2\n3",
    explanation:
      "index is now a local variable in the [Symbol.iterator]() call — a fresh closure per iteration. Each for...of gets a brand-new independent iterator.",
    keyInsight:
      "An iterable must return a FRESH iterator each time [Symbol.iterator]() is called. Never store iterator state on the iterable itself.",
  },

  {
    id: 704,
    cat: "Modern JS",
    difficulty: "medium",
    title: "Custom error class not extending Error",
    description:
      "e instanceof Error should be true but is false. Fix the class.",
    tags: ["class", "error", "extends", "instanceof"],
    brokenCode: `class AppError {
  constructor(message, code) {
    this.message = message;
    this.code    = code;
    this.name    = 'AppError';
  }
}

try {
  throw new AppError('Something went wrong', 500);
} catch (e) {
  console.log(e instanceof Error);
  console.log(e.name);
  console.log(e.message);
}`,
    bugDescription:
      "AppError does not extend Error. It has no prototype relationship to Error so instanceof Error is false and there is no stack trace.",
    fixedCode: `class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

try {
  throw new AppError('Something went wrong', 500);
} catch (e) {
  console.log(e instanceof Error);
  console.log(e.name);
  console.log(e.message);
}`,
    expectedOutput: "true\nAppError\nSomething went wrong",
    explanation:
      'extends Error + super(message) establishes the prototype chain. this.name overrides the default "Error" string.',
    keyInsight:
      "Custom errors must extend Error to pass instanceof checks, get a stack trace, and work correctly with error monitoring tools.",
  },
];
