/**
 * src/data/polyfillQuestions.ts
 * 25 polyfill implementation questions.
 * Sandbox contract: stubCode + testCode concatenated → runs in iframe
 * testCode logs "PASS: X" or "FAIL: X — reason" only
 */

export interface PolyfillQuestion {
  id: number;
  cat:
    | "Array Methods"
    | "Function Methods"
    | "Promise Methods"
    | "Utility Functions"
    | "Object Methods";
  difficulty: "easy" | "medium" | "hard";
  title: string;
  description: string;
  stubCode: string;
  testCode: string;
  solutionCode: string;
  expectedOutput: string;
  explanation: string;
  keyInsight: string;
  companies: string[];
  tags: string[];
  answer?: string; // for future use if we want to show reference answer in Markdown format
}

export const POLYFILL_CATEGORIES = [
  "Array Methods",
  "Function Methods",
  "Promise Methods",
  "Utility Functions",
  "Object Methods",
] as const;

export const polyfillQuestions: PolyfillQuestion[] = [
  {
    id: 1001,
    cat: "Array Methods",
    difficulty: "easy",
    title: "Implement Array.prototype.map",
    tags: ["array", "map", "prototype"],
    companies: ["Razorpay", "Flipkart", "Amazon", "Microsoft"],
    description:
      "Implement Array.prototype.map without using native map. Call callback with (element, index, array) and return a new array.",
    stubCode:
      "Array.prototype.myMap = function(callback, thisArg) {\n  // Your implementation here\n};",
    solutionCode:
      "Array.prototype.myMap = function(callback, thisArg) {\n  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');\n  const result = [];\n  for (let i = 0; i < this.length; i++) {\n    if (i in this) result[i] = callback.call(thisArg, this[i], i, this);\n  }\n  return result;\n};",
    testCode:
      "(function() {\n  try {\n    const r1 = [1,2,3].myMap(x => x * 2);\n    console.log(JSON.stringify(r1) === '[2,4,6]' ? 'PASS: basic' : 'FAIL: basic \u2014 got ' + JSON.stringify(r1));\n    const r2 = [].myMap(x => x);\n    console.log(JSON.stringify(r2) === '[]' ? 'PASS: empty' : 'FAIL: empty');\n    const r3 = ['a','b','c'].myMap((v,i) => i + ':' + v);\n    console.log(JSON.stringify(r3) === '[\"0:a\",\"1:b\",\"2:c\"]' ? 'PASS: index' : 'FAIL: index \u2014 got ' + JSON.stringify(r3));\n    const obj = { mul: 3 };\n    const r4 = [1,2,3].myMap(function(x) { return x * this.mul; }, obj);\n    console.log(JSON.stringify(r4) === '[3,6,9]' ? 'PASS: thisArg' : 'FAIL: thisArg \u2014 got ' + JSON.stringify(r4));\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput: "PASS: basic\nPASS: empty\nPASS: index\nPASS: thisArg",
    explanation:
      "Iterate with for loop. Check i in this for sparse arrays. Call callback.call(thisArg, element, index, array). Return the new array.",
    keyInsight:
      "Use i in this to handle sparse arrays. The callback receives (element, index, originalArray).",
  },
  {
    id: 1002,
    cat: "Array Methods",
    difficulty: "easy",
    title: "Implement Array.prototype.filter",
    tags: ["array", "filter", "prototype"],
    companies: ["Razorpay", "Flipkart", "Google", "Amazon"],
    description:
      "Implement Array.prototype.filter. Returns a new array with elements for which callback returns truthy.",
    stubCode:
      "Array.prototype.myFilter = function(callback, thisArg) {\n  // Your implementation here\n};",
    solutionCode:
      "Array.prototype.myFilter = function(callback, thisArg) {\n  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');\n  const result = [];\n  for (let i = 0; i < this.length; i++) {\n    if (i in this && callback.call(thisArg, this[i], i, this)) result.push(this[i]);\n  }\n  return result;\n};",
    testCode:
      "(function() {\n  try {\n    const r1 = [1,2,3,4,5].myFilter(x => x % 2 === 0);\n    console.log(JSON.stringify(r1) === '[2,4]' ? 'PASS: basic' : 'FAIL: basic \u2014 got ' + JSON.stringify(r1));\n    const r2 = [].myFilter(x => x);\n    console.log(JSON.stringify(r2) === '[]' ? 'PASS: empty' : 'FAIL: empty');\n    const r3 = [1,2,3].myFilter(x => x > 10);\n    console.log(JSON.stringify(r3) === '[]' ? 'PASS: no match' : 'FAIL: no match');\n    const r4 = ['a','b','c'].myFilter((v,i) => i > 0);\n    console.log(JSON.stringify(r4) === '[\"b\",\"c\"]' ? 'PASS: index' : 'FAIL: index \u2014 got ' + JSON.stringify(r4));\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput: "PASS: basic\nPASS: empty\nPASS: no match\nPASS: index",
    explanation:
      "Only push when callback returns truthy. Use push() not index assignment \u2014 result must be dense.",
    keyInsight:
      "filter result is always dense \u2014 use push(), not result[i] = ...",
  },
  {
    id: 1003,
    cat: "Array Methods",
    difficulty: "medium",
    title: "Implement Array.prototype.reduce",
    tags: ["array", "reduce", "accumulator"],
    companies: ["Razorpay", "Flipkart", "Google", "Amazon", "Microsoft"],
    description:
      "Implement Array.prototype.reduce. Handle both with and without an initial value. Throw TypeError on empty array with no initial value.",
    stubCode:
      "Array.prototype.myReduce = function(callback, initialValue) {\n  // Handle both cases: with and without initialValue\n  // Hint: use arguments.length to detect missing initialValue\n};",
    solutionCode:
      "Array.prototype.myReduce = function(callback, initialValue) {\n  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');\n  const len = this.length;\n  let acc, startIdx;\n  if (arguments.length >= 2) {\n    acc = initialValue; startIdx = 0;\n  } else {\n    if (len === 0) throw new TypeError('Reduce of empty array with no initial value');\n    startIdx = 0;\n    while (startIdx < len && !(startIdx in this)) startIdx++;\n    if (startIdx >= len) throw new TypeError('Reduce of empty array with no initial value');\n    acc = this[startIdx++];\n  }\n  for (let i = startIdx; i < len; i++) {\n    if (i in this) acc = callback(acc, this[i], i, this);\n  }\n  return acc;\n};",
    testCode:
      "(function() {\n  try {\n    const r1 = [1,2,3,4].myReduce((acc,v) => acc + v, 0);\n    console.log(r1 === 10 ? 'PASS: sum' : 'FAIL: sum \u2014 got ' + r1);\n    const r2 = [1,2,3,4].myReduce((acc,v) => acc + v);\n    console.log(r2 === 10 ? 'PASS: no initial' : 'FAIL: no initial \u2014 got ' + r2);\n    const r3 = [{n:1},{n:2},{n:3}].myReduce((acc,v) => acc + v.n, 0);\n    console.log(r3 === 6 ? 'PASS: object' : 'FAIL: object \u2014 got ' + r3);\n    const r4 = ['a','b','c'].myReduce((acc,v) => acc + v);\n    console.log(r4 === 'abc' ? 'PASS: string' : 'FAIL: string \u2014 got ' + r4);\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput: "PASS: sum\nPASS: no initial\nPASS: object\nPASS: string",
    explanation:
      "Use arguments.length >= 2 to distinguish missing initialValue from undefined. Without initial value, use first element as accumulator and start from index 1.",
    keyInsight:
      "Use arguments.length >= 2, not initialValue !== undefined. undefined is a valid initial value.",
  },
  {
    id: 1004,
    cat: "Array Methods",
    difficulty: "medium",
    title: "Implement Array.prototype.flat",
    tags: ["array", "flat", "recursive"],
    companies: ["Google", "Atlassian", "CRED", "Flipkart"],
    description:
      "Implement Array.prototype.flat(depth). Default depth 1. Infinity flattens completely.",
    stubCode:
      "Array.prototype.myFlat = function(depth = 1) {\n  // Flatten nested arrays to given depth\n};",
    solutionCode:
      "Array.prototype.myFlat = function(depth = 1) {\n  const result = [];\n  const flatten = (arr, d) => {\n    for (let i = 0; i < arr.length; i++) {\n      if (i in arr) {\n        Array.isArray(arr[i]) && d > 0 ? flatten(arr[i], d - 1) : result.push(arr[i]);\n      }\n    }\n  };\n  flatten(this, depth);\n  return result;\n};",
    testCode:
      "(function() {\n  try {\n    const r1 = [1,[2,[3,[4]]]].myFlat(1);\n    console.log(JSON.stringify(r1) === '[1,2,[3,[4]]]' ? 'PASS: depth 1' : 'FAIL: depth 1 \u2014 got ' + JSON.stringify(r1));\n    const r2 = [1,[2,[3,[4]]]].myFlat(2);\n    console.log(JSON.stringify(r2) === '[1,2,3,[4]]' ? 'PASS: depth 2' : 'FAIL: depth 2 \u2014 got ' + JSON.stringify(r2));\n    const r3 = [1,[2,[3,[4]]]].myFlat(Infinity);\n    console.log(JSON.stringify(r3) === '[1,2,3,4]' ? 'PASS: Infinity' : 'FAIL: Infinity \u2014 got ' + JSON.stringify(r3));\n    const r4 = [].myFlat();\n    console.log(JSON.stringify(r4) === '[]' ? 'PASS: empty' : 'FAIL: empty');\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput: "PASS: depth 1\nPASS: depth 2\nPASS: Infinity\nPASS: empty",
    explanation:
      "Recurse with depth counter. If item is array AND depth > 0, recurse with depth-1. Otherwise push.",
    keyInsight:
      "Infinity - 1 === Infinity \u2014 no special case needed for Infinity depth.",
  },
  {
    id: 1005,
    cat: "Array Methods",
    difficulty: "easy",
    title: "Implement Array.prototype.forEach",
    tags: ["array", "forEach", "prototype"],
    companies: ["Flipkart", "Amazon", "Meesho"],
    description:
      "Implement Array.prototype.forEach. Should always return undefined.",
    stubCode:
      "Array.prototype.myForEach = function(callback, thisArg) {\n  // Call callback for each element, always return undefined\n};",
    solutionCode:
      "Array.prototype.myForEach = function(callback, thisArg) {\n  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');\n  for (let i = 0; i < this.length; i++) {\n    if (i in this) callback.call(thisArg, this[i], i, this);\n  }\n};",
    testCode:
      "(function() {\n  try {\n    const collected = [];\n    [10,20,30].myForEach(x => collected.push(x));\n    console.log(JSON.stringify(collected) === '[10,20,30]' ? 'PASS: side effects' : 'FAIL: side effects');\n    const indices = [];\n    ['a','b'].myForEach((v,i) => indices.push(i));\n    console.log(JSON.stringify(indices) === '[0,1]' ? 'PASS: index' : 'FAIL: index');\n    const ret = [1,2].myForEach(x => x * 2);\n    console.log(ret === undefined ? 'PASS: returns undefined' : 'FAIL: returns undefined \u2014 got ' + ret);\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput: "PASS: side effects\nPASS: index\nPASS: returns undefined",
    explanation:
      "forEach is the simplest iteration. Critical: it must return undefined \u2014 no return statement.",
    keyInsight:
      "forEach always returns undefined. No return statement in the function body.",
  },
  {
    id: 1006,
    cat: "Array Methods",
    difficulty: "easy",
    title: "Implement Array.prototype.find and findIndex",
    tags: ["array", "find", "findIndex"],
    companies: ["Flipkart", "Swiggy", "Meesho", "Amazon"],
    description:
      "Implement both find (returns element or undefined) and findIndex (returns index or -1). Both stop at first match.",
    stubCode:
      "Array.prototype.myFind = function(callback, thisArg) {\n  // Return first matching element, or undefined\n};\n\nArray.prototype.myFindIndex = function(callback, thisArg) {\n  // Return index of first match, or -1\n};",
    solutionCode:
      "Array.prototype.myFind = function(callback, thisArg) {\n  for (let i = 0; i < this.length; i++) {\n    if (callback.call(thisArg, this[i], i, this)) return this[i];\n  }\n  return undefined;\n};\nArray.prototype.myFindIndex = function(callback, thisArg) {\n  for (let i = 0; i < this.length; i++) {\n    if (callback.call(thisArg, this[i], i, this)) return i;\n  }\n  return -1;\n};",
    testCode:
      "(function() {\n  try {\n    console.log([5,12,8,130].myFind(x => x > 10) === 12 ? 'PASS: found' : 'FAIL: found');\n    console.log([1,2,3].myFind(x => x > 10) === undefined ? 'PASS: not found' : 'FAIL: not found');\n    console.log([5,12,8,12].myFind(x => x > 10) === 12 ? 'PASS: first match' : 'FAIL: first match');\n    console.log([5,12,8].myFindIndex(x => x > 10) === 1 ? 'PASS: findIndex' : 'FAIL: findIndex');\n    console.log([1,2,3].myFindIndex(x => x > 10) === -1 ? 'PASS: findIndex -1' : 'FAIL: findIndex -1');\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput:
      "PASS: found\nPASS: not found\nPASS: first match\nPASS: findIndex\nPASS: findIndex -1",
    explanation:
      "Both stop at first match. find returns element, findIndex returns index. Sentinels: undefined and -1.",
    keyInsight:
      "find and findIndex stop at FIRST match unlike filter which collects all.",
  },
  {
    id: 1007,
    cat: "Array Methods",
    difficulty: "easy",
    title: "Implement Array.prototype.some and every",
    tags: ["array", "some", "every", "short-circuit"],
    companies: ["Flipkart", "Amazon", "Meesho", "Paytm"],
    description:
      "Implement some (true if any passes) and every (true if all pass). Both must short-circuit.",
    stubCode:
      "Array.prototype.mySome = function(callback, thisArg) {\n  // True if ANY element passes\n};\n\nArray.prototype.myEvery = function(callback, thisArg) {\n  // True if ALL elements pass\n};",
    solutionCode:
      "Array.prototype.mySome = function(callback, thisArg) {\n  for (let i = 0; i < this.length; i++) {\n    if (i in this && callback.call(thisArg, this[i], i, this)) return true;\n  }\n  return false;\n};\nArray.prototype.myEvery = function(callback, thisArg) {\n  for (let i = 0; i < this.length; i++) {\n    if (i in this && !callback.call(thisArg, this[i], i, this)) return false;\n  }\n  return true;\n};",
    testCode:
      "(function() {\n  try {\n    console.log([1,2,3,4].mySome(x => x > 3) === true ? 'PASS: some true' : 'FAIL: some true');\n    console.log([1,2,3,4].mySome(x => x > 10) === false ? 'PASS: some false' : 'FAIL: some false');\n    console.log([2,4,6].myEvery(x => x % 2 === 0) === true ? 'PASS: every true' : 'FAIL: every true');\n    console.log([2,3,6].myEvery(x => x % 2 === 0) === false ? 'PASS: every false' : 'FAIL: every false');\n    console.log([].myEvery(x => false) === true ? 'PASS: every empty' : 'FAIL: every empty');\n    console.log([].mySome(x => true) === false ? 'PASS: some empty' : 'FAIL: some empty');\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput:
      "PASS: some true\nPASS: some false\nPASS: every true\nPASS: every false\nPASS: every empty\nPASS: some empty",
    explanation:
      "some returns true on first pass. every returns false on first fail. Empty array: every=true (vacuous truth), some=false.",
    keyInsight:
      "every([]) === true (vacuously true). some([]) === false. These edge cases trip up many candidates.",
  },
  {
    id: 1008,
    cat: "Array Methods",
    difficulty: "hard",
    title: "Implement Array.from",
    tags: ["array", "Array.from", "iterable", "array-like"],
    companies: ["Google", "Atlassian", "CRED", "Razorpay"],
    description:
      "Implement Array.from(arrayLike, mapFn?). Works with array-like objects (length property) and iterables (Set, Map, string).",
    stubCode:
      "Array.myFrom = function(arrayLike, mapFn, thisArg) {\n  // Handle array-like objects (.length) and iterables (Symbol.iterator)\n};",
    solutionCode:
      "Array.myFrom = function(arrayLike, mapFn, thisArg) {\n  if (arrayLike == null) throw new TypeError('Array.from requires an array-like object');\n  const hasFn = mapFn !== undefined;\n  if (hasFn && typeof mapFn !== 'function') throw new TypeError(mapFn + ' is not a function');\n  if (arrayLike[Symbol.iterator]) {\n    const result = []; let i = 0;\n    for (const item of arrayLike) { result.push(hasFn ? mapFn.call(thisArg, item, i++) : item); }\n    return result;\n  }\n  const len = Math.floor(Math.abs(Number(arrayLike.length))) || 0;\n  const result = new Array(len);\n  for (let i = 0; i < len; i++) result[i] = hasFn ? mapFn.call(thisArg, arrayLike[i], i) : arrayLike[i];\n  return result;\n};",
    testCode:
      "(function() {\n  try {\n    const r1 = Array.myFrom({0:'a',1:'b',length:2});\n    console.log(JSON.stringify(r1) === '[\"a\",\"b\"]' ? 'PASS: array-like' : 'FAIL: array-like \u2014 got ' + JSON.stringify(r1));\n    const r2 = Array.myFrom(new Set([1,2,3]));\n    console.log(JSON.stringify(r2) === '[1,2,3]' ? 'PASS: iterable' : 'FAIL: iterable \u2014 got ' + JSON.stringify(r2));\n    const r3 = Array.myFrom({length:3}, (_,i) => i * 2);\n    console.log(JSON.stringify(r3) === '[0,2,4]' ? 'PASS: map fn' : 'FAIL: map fn \u2014 got ' + JSON.stringify(r3));\n    const r4 = Array.myFrom('abc');\n    console.log(JSON.stringify(r4) === '[\"a\",\"b\",\"c\"]' ? 'PASS: string' : 'FAIL: string \u2014 got ' + JSON.stringify(r4));\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput:
      "PASS: array-like\nPASS: iterable\nPASS: map fn\nPASS: string",
    explanation:
      "Check Symbol.iterator first for iterables, fall back to .length for array-likes.",
    keyInsight:
      "Check Symbol.iterator before .length. Iterables take priority. Strings are iterable.",
  },
  {
    id: 1009,
    cat: "Function Methods",
    difficulty: "medium",
    title: "Implement Function.prototype.bind",
    tags: ["function", "bind", "this", "partial-application"],
    companies: ["Razorpay", "Flipkart", "Google", "Amazon", "Microsoft"],
    description:
      "Implement Function.prototype.bind. Permanently set this, optionally pre-fill arguments (partial application). Support new.",
    stubCode:
      "Function.prototype.myBind = function(thisArg, ...args) {\n  // Return new function with 'this' permanently set\n  // Support partial application and 'new'\n};",
    solutionCode:
      "Function.prototype.myBind = function(thisArg, ...args) {\n  if (typeof this !== 'function') throw new TypeError('myBind must be called on a function');\n  const fn = this;\n  function bound(...laterArgs) {\n    return fn.apply(this instanceof bound ? this : thisArg, [...args, ...laterArgs]);\n  }\n  if (fn.prototype) bound.prototype = Object.create(fn.prototype);\n  return bound;\n};",
    testCode:
      "(function() {\n  try {\n    function greet(greeting, punct) { return greeting + ', ' + this.name + punct; }\n    const hi = greet.myBind({ name: 'Alice' }, 'Hello');\n    console.log(hi('!') === 'Hello, Alice!' ? 'PASS: basic' : 'FAIL: basic \u2014 got ' + hi('!'));\n    const add = (a,b,c) => a+b+c;\n    const add5 = add.myBind(null, 5);\n    console.log(add5(3,2) === 10 ? 'PASS: partial' : 'FAIL: partial \u2014 got ' + add5(3,2));\n    const obj = { x: 1 };\n    const getX = function() { return this.x; }.myBind(obj);\n    console.log(getX.call({ x: 99 }) === 1 ? 'PASS: permanent' : 'FAIL: permanent \u2014 got ' + getX.call({x:99}));\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput: "PASS: basic\nPASS: partial\nPASS: permanent",
    explanation:
      "Combine pre-filled args with later args via spread. Check instanceof for new support. bind is permanent \u2014 call cannot override it.",
    keyInsight:
      "Check this instanceof bound to support new. bind wins over call/apply \u2014 the bound this cannot be overridden.",
  },
  {
    id: 1010,
    cat: "Function Methods",
    difficulty: "medium",
    title: "Implement Function.prototype.call and apply",
    tags: ["function", "call", "apply", "this"],
    companies: ["Razorpay", "Flipkart", "Google", "Amazon"],
    description:
      "Implement call (args individually) and apply (args as array). Both set this explicitly using the property-on-context trick.",
    stubCode:
      "Function.prototype.myCall = function(thisArg, ...args) {\n  // Call this function with thisArg as 'this'\n};\n\nFunction.prototype.myApply = function(thisArg, argsArray) {\n  // Call with thisArg as 'this', args from array\n};",
    solutionCode:
      "Function.prototype.myCall = function(thisArg, ...args) {\n  const ctx = thisArg ?? globalThis;\n  const sym = Symbol();\n  ctx[sym] = this;\n  const result = ctx[sym](...args);\n  delete ctx[sym];\n  return result;\n};\nFunction.prototype.myApply = function(thisArg, argsArray) {\n  const ctx = thisArg ?? globalThis;\n  const sym = Symbol();\n  ctx[sym] = this;\n  const result = argsArray ? ctx[sym](...argsArray) : ctx[sym]();\n  delete ctx[sym];\n  return result;\n};",
    testCode:
      "(function() {\n  try {\n    function greet(g) { return g + ', ' + this.name; }\n    console.log(greet.myCall({ name: 'Bob' }, 'Hi') === 'Hi, Bob' ? 'PASS: call basic' : 'FAIL: call basic');\n    function sum(a,b,c) { return a+b+c; }\n    console.log(sum.myCall(null, 1, 2, 3) === 6 ? 'PASS: call args' : 'FAIL: call args');\n    console.log(greet.myApply({ name: 'Bob' }, ['Hi']) === 'Hi, Bob' ? 'PASS: apply basic' : 'FAIL: apply basic');\n    console.log(sum.myApply(null, [1,2,3]) === 6 ? 'PASS: apply args' : 'FAIL: apply args');\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput:
      "PASS: call basic\nPASS: call args\nPASS: apply basic\nPASS: apply args",
    explanation:
      "Attach function to context object using Symbol (no collision), call it, delete it. The Symbol key guarantees no existing property is overwritten.",
    keyInsight:
      "Use Symbol() as the temporary key when attaching the function to context \u2014 guarantees no collision.",
  },
  {
    id: 1011,
    cat: "Function Methods",
    difficulty: "medium",
    title: "Implement once()",
    tags: ["function", "once", "closure", "cache"],
    companies: ["Google", "Atlassian", "CRED", "Razorpay"],
    description:
      "Implement once(fn) \u2014 returns a wrapper that calls fn only the first time. Subsequent calls return the cached first result without invoking fn.",
    stubCode:
      "function once(fn) {\n  // Return a function that calls fn only once\n  // Subsequent calls return the first result\n}",
    solutionCode:
      "function once(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) { called = true; result = fn.apply(this, args); }\n    return result;\n  };\n}",
    testCode:
      "(function() {\n  try {\n    let count = 0;\n    const inc = once(() => ++count);\n    inc(); inc(); inc();\n    console.log(count === 1 ? 'PASS: called once' : 'FAIL: called once \u2014 count=' + count);\n    let n = 0;\n    const getN = once(() => ++n);\n    const r1 = getN(), r2 = getN(), r3 = getN();\n    console.log(r1 === 1 && r2 === 1 && r3 === 1 ? 'PASS: returns first' : 'FAIL: returns first \u2014 ' + [r1,r2,r3]);\n    let side = 0;\n    const noOp = once(() => { side = 42; return 'done'; });\n    noOp(); noOp();\n    console.log(side === 42 ? 'PASS: side effect once' : 'FAIL: side effect once');\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput:
      "PASS: called once\nPASS: returns first\nPASS: side effect once",
    explanation:
      "Use a called flag and cached result. After first call, return cached result without re-invoking fn.",
    keyInsight:
      "Cache the result \u2014 subsequent calls return the exact same value, not undefined.",
  },
  {
    id: 1012,
    cat: "Promise Methods",
    difficulty: "hard",
    title: "Implement Promise.all",
    tags: ["promise", "Promise.all", "async"],
    companies: ["Razorpay", "Swiggy", "PhonePe", "Google", "Atlassian"],
    description:
      "Implement Promise.all. Resolves with array of values in order. Rejects immediately on first rejection.",
    stubCode:
      "function myPromiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    // Resolve with all values, reject on first failure\n  });\n}",
    solutionCode:
      "function myPromiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    if (!promises || promises.length === 0) { resolve([]); return; }\n    const results = new Array(promises.length);\n    let remaining = promises.length;\n    promises.forEach((p, i) => {\n      Promise.resolve(p)\n        .then(v => { results[i] = v; if (--remaining === 0) resolve(results); })\n        .catch(reject);\n    });\n  });\n}",
    testCode:
      "(function() {\n  myPromiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])\n    .then(v => console.log(JSON.stringify(v) === '[1,2,3]' ? 'PASS: all resolve' : 'FAIL: all resolve \u2014 got ' + JSON.stringify(v)));\n  myPromiseAll([Promise.resolve(1), Promise.reject('err'), Promise.resolve(3)])\n    .then(() => console.log('FAIL: should reject'))\n    .catch(e => console.log(e === 'err' ? 'PASS: rejects on first' : 'FAIL: rejects on first \u2014 got ' + e));\n  myPromiseAll([])\n    .then(v => console.log(JSON.stringify(v) === '[]' ? 'PASS: empty' : 'FAIL: empty'));\n})();",
    expectedOutput: "PASS: all resolve\nPASS: rejects on first\nPASS: empty",
    explanation:
      "Store results by index (preserves order). Use counter for completion. .catch(reject) for fail-fast.",
    keyInsight:
      "Order is by index, not resolution order. Use a counter \u2014 not promise chaining \u2014 to track completion.",
  },
  {
    id: 1013,
    cat: "Promise Methods",
    difficulty: "hard",
    title: "Implement Promise.allSettled",
    tags: ["promise", "Promise.allSettled", "async"],
    companies: ["Razorpay", "Swiggy", "PhonePe", "Atlassian"],
    description:
      "Implement Promise.allSettled. Always resolves with {status, value/reason} objects. Never rejects.",
    stubCode:
      "function myPromiseAllSettled(promises) {\n  return new Promise((resolve) => {\n    // Never rejects \u2014 always resolves with status objects\n  });\n}",
    solutionCode:
      "function myPromiseAllSettled(promises) {\n  return new Promise(resolve => {\n    if (!promises || promises.length === 0) { resolve([]); return; }\n    const results = new Array(promises.length);\n    let remaining = promises.length;\n    promises.forEach((p, i) => {\n      Promise.resolve(p)\n        .then(value => { results[i] = { status: 'fulfilled', value }; })\n        .catch(reason => { results[i] = { status: 'rejected', reason }; })\n        .finally(() => { if (--remaining === 0) resolve(results); });\n    });\n  });\n}",
    testCode:
      "(function() {\n  myPromiseAllSettled([Promise.resolve(1), Promise.reject('oops'), Promise.resolve(3)])\n    .then(r => {\n      const ok = r[0].status === 'fulfilled' && r[0].value === 1 && r[1].status === 'rejected' && r[1].reason === 'oops' && r[2].status === 'fulfilled' && r[2].value === 3;\n      console.log(ok ? 'PASS: mixed' : 'FAIL: mixed \u2014 ' + JSON.stringify(r));\n    });\n  myPromiseAllSettled([Promise.resolve(1), Promise.resolve(2)])\n    .then(r => console.log(r.every(x => x.status === 'fulfilled') ? 'PASS: all fulfilled' : 'FAIL: all fulfilled'));\n  myPromiseAllSettled([Promise.reject('a'), Promise.reject('b')])\n    .then(r => console.log(r.every(x => x.status === 'rejected') ? 'PASS: all rejected' : 'FAIL: all rejected'));\n})();",
    expectedOutput: "PASS: mixed\nPASS: all fulfilled\nPASS: all rejected",
    explanation:
      "Wrap both success and failure in status objects. Use finally to decrement counter. The outer Promise only ever resolves.",
    keyInsight:
      "allSettled never rejects. Both .then and .catch produce status objects. .finally tracks completion.",
  },
  {
    id: 1014,
    cat: "Promise Methods",
    difficulty: "hard",
    title: "Implement Promise.race",
    tags: ["promise", "Promise.race", "async"],
    companies: ["Google", "Atlassian", "CRED", "Razorpay"],
    description:
      "Implement Promise.race. Settles with the first promise to resolve or reject.",
    stubCode:
      "function myPromiseRace(promises) {\n  return new Promise((resolve, reject) => {\n    // Settle with whichever promise settles first\n  });\n}",
    solutionCode:
      "function myPromiseRace(promises) {\n  return new Promise((resolve, reject) => {\n    for (const p of promises) Promise.resolve(p).then(resolve).catch(reject);\n  });\n}",
    testCode:
      "(function() {\n  const fast = new Promise(r => setTimeout(() => r('fast'), 10));\n  const slow = new Promise(r => setTimeout(() => r('slow'), 50));\n  myPromiseRace([slow, fast]).then(v => console.log(v === 'fast' ? 'PASS: fastest wins' : 'FAIL: fastest wins \u2014 got ' + v));\n  myPromiseRace([Promise.reject('first'), Promise.resolve('second')])\n    .then(() => console.log('FAIL: should reject'))\n    .catch(e => console.log(e === 'first' ? 'PASS: rejects first' : 'FAIL: rejects first \u2014 got ' + e));\n  myPromiseRace([Promise.resolve('a'), Promise.resolve('b')])\n    .then(v => console.log(v === 'a' ? 'PASS: resolves first' : 'FAIL: resolves first \u2014 got ' + v));\n})();",
    expectedOutput:
      "PASS: rejects first\nPASS: resolves first\nPASS: fastest wins",
    explanation:
      "Attach resolve and reject to every promise. First to settle wins \u2014 subsequent calls are no-ops since Promise can only settle once.",
    keyInsight:
      "Promise.race is a one-liner: attach the same resolve/reject to all. A Promise settles only once \u2014 subsequent calls are ignored.",
  },
  {
    id: 1015,
    cat: "Promise Methods",
    difficulty: "hard",
    title: "Implement Promise.any",
    tags: ["promise", "Promise.any", "AggregateError"],
    companies: ["Google", "Atlassian", "CRED"],
    description:
      "Implement Promise.any. Resolves with FIRST fulfilled. Rejects with AggregateError only if ALL reject.",
    stubCode:
      "function myPromiseAny(promises) {\n  return new Promise((resolve, reject) => {\n    // Resolve on first success, reject with AggregateError if all fail\n  });\n}",
    solutionCode:
      "function myPromiseAny(promises) {\n  return new Promise((resolve, reject) => {\n    if (!promises || promises.length === 0) { reject(new AggregateError([], 'All promises were rejected')); return; }\n    const errors = new Array(promises.length);\n    let rejectedCount = 0;\n    promises.forEach((p, i) => {\n      Promise.resolve(p)\n        .then(resolve)\n        .catch(reason => {\n          errors[i] = reason;\n          if (++rejectedCount === promises.length) reject(new AggregateError(errors, 'All promises were rejected'));\n        });\n    });\n  });\n}",
    testCode:
      "(function() {\n  myPromiseAny([Promise.reject('a'), Promise.resolve('first'), Promise.resolve('second')])\n    .then(v => console.log(v === 'first' ? 'PASS: first resolve' : 'FAIL: first resolve \u2014 got ' + v));\n  myPromiseAny([Promise.reject('a'), Promise.reject('b')])\n    .then(() => console.log('FAIL: should reject'))\n    .catch(e => console.log(e instanceof AggregateError ? 'PASS: all reject' : 'FAIL: all reject'));\n  myPromiseAny([Promise.reject('x'), Promise.resolve('ok')])\n    .then(v => console.log(v === 'ok' ? 'PASS: ignores reject' : 'FAIL: ignores reject'));\n})();",
    expectedOutput:
      "PASS: first resolve\nPASS: all reject\nPASS: ignores reject",
    explanation:
      "Resolve on first success. Collect rejections and only reject when all have rejected.",
    keyInsight:
      "Promise.any = opposite of Promise.all. any = first success or all-fail. all = first fail or all-success.",
  },
  {
    id: 1016,
    cat: "Utility Functions",
    difficulty: "medium",
    title: "Implement debounce",
    tags: ["debounce", "closure", "timer", "utility"],
    companies: ["Razorpay", "Flipkart", "Swiggy", "Google", "Amazon"],
    description:
      "Implement debounce(fn, delay). Delays invoking fn until after delay ms of inactivity.",
    stubCode:
      "function debounce(fn, delay) {\n  // Return a debounced version of fn\n  // Only calls fn after 'delay' ms of silence\n}",
    solutionCode:
      "function debounce(fn, delay) {\n  let timer = null;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => { fn.apply(this, args); timer = null; }, delay);\n  };\n}",
    testCode:
      "(function() {\n  let callCount = 0;\n  const debounced = debounce(() => callCount++, 50);\n  debounced(); debounced(); debounced(); debounced(); debounced();\n  setTimeout(() => {\n    console.log(callCount === 1 ? 'PASS: delays and batches' : 'FAIL: delays and batches \u2014 called ' + callCount);\n  }, 100);\n  let count2 = 0;\n  const d2 = debounce(() => count2++, 30);\n  d2();\n  setTimeout(() => d2(), 60);\n  setTimeout(() => {\n    console.log(count2 === 2 ? 'PASS: resets after delay' : 'FAIL: resets \u2014 count=' + count2);\n  }, 150);\n})();",
    expectedOutput: "PASS: delays and batches\nPASS: resets after delay",
    explanation:
      "clearTimeout + setTimeout on every call. Only the last in a rapid sequence runs.",
    keyInsight:
      "debounce = wait until quiet. clearTimeout then setTimeout. fn only runs after delay ms of silence.",
  },
  {
    id: 1017,
    cat: "Utility Functions",
    difficulty: "medium",
    title: "Implement throttle",
    tags: ["throttle", "closure", "timer", "utility"],
    companies: ["Razorpay", "Flipkart", "Swiggy", "Amazon"],
    description:
      "Implement throttle(fn, limit). fn executes at most once per limit ms. First call executes immediately.",
    stubCode:
      "function throttle(fn, limit) {\n  // Return a throttled version of fn\n  // Execute at most once per 'limit' ms\n}",
    solutionCode:
      "function throttle(fn, limit) {\n  let lastCall = 0;\n  return function(...args) {\n    const now = Date.now();\n    if (now - lastCall >= limit) { lastCall = now; return fn.apply(this, args); }\n  };\n}",
    testCode:
      "(function() {\n  let count = 0;\n  const throttled = throttle(() => count++, 50);\n  throttled(); throttled(); throttled();\n  console.log(count === 1 ? 'PASS: immediate first call' : 'FAIL: immediate \u2014 count=' + count);\n  setTimeout(() => {\n    throttled();\n    console.log(count === 2 ? 'PASS: fires after limit' : 'FAIL: fires after limit \u2014 count=' + count);\n  }, 60);\n  setTimeout(() => {\n    throttled(); throttled(); throttled();\n  }, 120);\n  setTimeout(() => {\n    console.log(count === 3 ? 'PASS: limits rate' : 'FAIL: limits rate \u2014 count=' + count);\n  }, 130);\n})();",
    expectedOutput:
      "PASS: immediate first call\nPASS: fires after limit\nPASS: limits rate",
    explanation:
      "Compare Date.now() against lastCall. Execute and update lastCall if enough time has passed.",
    keyInsight:
      "throttle = at most once per X ms. FIRST call fires immediately. Subsequent calls within the window are dropped.",
  },
  {
    id: 1018,
    cat: "Utility Functions",
    difficulty: "medium",
    title: "Implement memoize",
    tags: ["memoize", "cache", "closure", "utility"],
    companies: ["Google", "Atlassian", "CRED", "Razorpay", "Amazon"],
    description:
      "Implement memoize(fn). Caches results by argument. Same args = cached result, no re-execution.",
    stubCode:
      "function memoize(fn) {\n  // Return a memoized version \u2014 cache by serialized arguments\n}",
    solutionCode:
      "function memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}",
    testCode:
      "(function() {\n  try {\n    let calls = 0;\n    const exp = memoize(n => { calls++; return n * 2; });\n    exp(5); exp(5); exp(5);\n    console.log(calls === 1 ? 'PASS: caches result' : 'FAIL: caches \u2014 called ' + calls);\n    exp(10);\n    console.log(calls === 2 ? 'PASS: different args' : 'FAIL: different args \u2014 calls=' + calls);\n    const r = exp(5);\n    console.log(r === 10 && calls === 2 ? 'PASS: cache hit returns value' : 'FAIL: cache hit \u2014 got ' + r);\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput:
      "PASS: caches result\nPASS: different args\nPASS: cache hit returns value",
    explanation:
      "Map keyed by JSON.stringify(args). Each unique arg combo stored once.",
    keyInsight:
      "JSON.stringify(args) works for primitives. For complex objects use WeakMap or custom serializer.",
  },
  {
    id: 1019,
    cat: "Utility Functions",
    difficulty: "hard",
    title: "Implement curry",
    tags: ["curry", "closure", "partial-application", "utility"],
    companies: ["Google", "Atlassian", "CRED", "Razorpay"],
    description:
      "Implement curry(fn). curry(add)(1)(2)(3) === add(1,2,3). Can also be called with multiple args.",
    stubCode:
      "function curry(fn) {\n  // Return a curried version \u2014 partial application until all args collected\n}",
    solutionCode:
      "function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) return fn.apply(this, args);\n    return function(...more) { return curried.apply(this, [...args, ...more]); };\n  };\n}",
    testCode:
      "(function() {\n  try {\n    const add = (a,b,c) => a+b+c;\n    const c = curry(add);\n    console.log(c(1,2,3) === 6 ? 'PASS: full apply' : 'FAIL: full apply \u2014 got ' + c(1,2,3));\n    console.log(c(1)(2,3) === 6 ? 'PASS: partial' : 'FAIL: partial \u2014 got ' + c(1)(2,3));\n    console.log(c(1)(2)(3) === 6 ? 'PASS: chained' : 'FAIL: chained \u2014 got ' + c(1)(2)(3));\n    console.log(c(10)(5)(2) === 17 ? 'PASS: reusable' : 'FAIL: reusable \u2014 got ' + c(10)(5)(2));\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput:
      "PASS: full apply\nPASS: partial\nPASS: chained\nPASS: reusable",
    explanation:
      "Compare args.length to fn.length. If enough, call fn. Otherwise return a function that accumulates more args.",
    keyInsight:
      "fn.length = declared parameter count. Accumulate args until you have enough, then invoke.",
  },
  {
    id: 1020,
    cat: "Utility Functions",
    difficulty: "hard",
    title: "Implement compose and pipe",
    tags: ["compose", "pipe", "functional", "utility"],
    companies: ["Google", "Atlassian", "CRED"],
    description:
      "compose(f,g,h)(x) = f(g(h(x))) right-to-left. pipe(f,g,h)(x) = h(g(f(x))) left-to-right.",
    stubCode:
      "function compose(...fns) {\n  // Right-to-left: compose(f,g,h)(x) === f(g(h(x)))\n}\n\nfunction pipe(...fns) {\n  // Left-to-right: pipe(f,g,h)(x) === h(g(f(x)))\n}",
    solutionCode:
      "function compose(...fns) {\n  return x => fns.reduceRight((acc, fn) => fn(acc), x);\n}\nfunction pipe(...fns) {\n  return x => fns.reduce((acc, fn) => fn(acc), x);\n}",
    testCode:
      "(function() {\n  try {\n    const double = x => x*2, addOne = x => x+1, square = x => x*x;\n    const c = compose(double, addOne, square);\n    console.log(c(3) === 20 ? 'PASS: compose' : 'FAIL: compose \u2014 got ' + c(3));\n    const p = pipe(double, addOne, square);\n    console.log(p(3) === 49 ? 'PASS: pipe' : 'FAIL: pipe \u2014 got ' + p(3));\n    console.log(compose(double)(5) === 10 ? 'PASS: single fn' : 'FAIL: single fn');\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput: "PASS: compose\nPASS: pipe\nPASS: single fn",
    explanation: "compose = reduceRight. pipe = reduce. Both are one-liners.",
    keyInsight:
      "compose = reduceRight (right-to-left). pipe = reduce (left-to-right).",
  },
  {
    id: 1021,
    cat: "Object Methods",
    difficulty: "easy",
    title: "Implement Object.assign",
    tags: ["object", "Object.assign", "shallow-copy"],
    companies: ["Flipkart", "Amazon", "Microsoft", "Razorpay"],
    description:
      "Implement Object.assign(target, ...sources). Copies own enumerable string-keyed properties. Returns the mutated target.",
    stubCode:
      "Object.myAssign = function(target, ...sources) {\n  // Copy own enumerable props from each source to target\n};",
    solutionCode:
      "Object.myAssign = function(target, ...sources) {\n  if (target == null) throw new TypeError('Cannot convert undefined or null to object');\n  const to = Object(target);\n  for (const src of sources) {\n    if (src == null) continue;\n    for (const key of Object.keys(src)) to[key] = src[key];\n  }\n  return to;\n};",
    testCode:
      "(function() {\n  try {\n    const r1 = Object.myAssign({}, {a:1}, {b:2});\n    console.log(r1.a===1 && r1.b===2 ? 'PASS: basic' : 'FAIL: basic \u2014 ' + JSON.stringify(r1));\n    const r2 = Object.myAssign({a:1,b:2}, {b:99,c:3});\n    console.log(r2.b===99 && r2.c===3 ? 'PASS: override' : 'FAIL: override \u2014 ' + JSON.stringify(r2));\n    const target = {x:1};\n    const result = Object.myAssign(target, {y:2}, {z:3});\n    console.log(result===target && target.y===2 ? 'PASS: returns target' : 'FAIL: returns target');\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput: "PASS: basic\nPASS: override\nPASS: returns target",
    explanation:
      "Object.keys gives own enumerable string keys. Skip null/undefined sources. Return the same target reference.",
    keyInsight:
      "Object.assign mutates and returns target. Symbols NOT copied by Object.keys.",
  },
  {
    id: 1022,
    cat: "Object Methods",
    difficulty: "medium",
    title: "Implement Object.create",
    tags: ["object", "Object.create", "prototype"],
    companies: ["Google", "Atlassian", "CRED", "Flipkart"],
    description:
      "Implement Object.create(proto). Create new object with proto as its prototype. Support null prototype.",
    stubCode:
      "Object.myCreate = function(proto) {\n  // Create new object with proto as [[Prototype]]\n  // Support null prototype\n};",
    solutionCode:
      "Object.myCreate = function(proto) {\n  if (proto !== null && typeof proto !== 'object' && typeof proto !== 'function') {\n    throw new TypeError('Object prototype may only be an Object or null');\n  }\n  function F() {}\n  F.prototype = proto;\n  const obj = new F();\n  if (proto === null) Object.setPrototypeOf(obj, null);\n  return obj;\n};",
    testCode:
      "(function() {\n  try {\n    const proto = { greet() { return 'hello from ' + this.name; } };\n    const obj = Object.myCreate(proto);\n    obj.name = 'Alice';\n    console.log(obj.greet() === 'hello from Alice' ? 'PASS: prototype' : 'FAIL: prototype');\n    console.log(Object.getPrototypeOf(obj) === proto ? 'PASS: correct proto' : 'FAIL: correct proto');\n    const nullObj = Object.myCreate(null);\n    console.log(Object.getPrototypeOf(nullObj) === null ? 'PASS: null proto' : 'FAIL: null proto');\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput: "PASS: prototype\nPASS: correct proto\nPASS: null proto",
    explanation:
      "function F(){}; F.prototype = proto; return new F() \u2014 the classic prototype linkage trick without any constructor logic.",
    keyInsight:
      "Object.create uses the empty constructor trick: F.prototype = proto; new F(). No initialization side effects.",
  },
  {
    id: 1023,
    cat: "Object Methods",
    difficulty: "easy",
    title: "Implement Object.keys, values, and entries",
    tags: ["object", "Object.keys", "Object.values", "Object.entries"],
    companies: ["Flipkart", "Amazon", "Paytm", "Meesho"],
    description:
      "Implement Object.myKeys, Object.myValues, Object.myEntries. Own enumerable string-keyed properties only (no inherited, no symbols).",
    stubCode:
      "Object.myKeys = function(obj) {\n  // Own enumerable string keys only\n};\n\nObject.myValues = function(obj) {\n  // Corresponding values\n};\n\nObject.myEntries = function(obj) {\n  // [key, value] pairs\n};",
    solutionCode:
      "Object.myKeys = function(obj) {\n  if (obj == null) throw new TypeError('Cannot convert undefined or null to object');\n  const keys = [];\n  for (const key in Object(obj)) {\n    if (Object.prototype.hasOwnProperty.call(obj, key)) keys.push(key);\n  }\n  return keys;\n};\nObject.myValues = function(obj) { return Object.myKeys(obj).map(k => obj[k]); };\nObject.myEntries = function(obj) { return Object.myKeys(obj).map(k => [k, obj[k]]); };",
    testCode:
      "(function() {\n  try {\n    const obj = {a:1,b:2,c:3};\n    console.log(JSON.stringify(Object.myKeys(obj)) === '[\"a\",\"b\",\"c\"]' ? 'PASS: keys' : 'FAIL: keys');\n    console.log(JSON.stringify(Object.myValues(obj)) === '[1,2,3]' ? 'PASS: values' : 'FAIL: values');\n    const e = Object.myEntries({x:10,y:20});\n    console.log(JSON.stringify(e) === '[[\"x\",10],[\"y\",20]]' ? 'PASS: entries' : 'FAIL: entries');\n    const child = Object.create({inherited:'no'});\n    child.own = 'yes';\n    console.log(JSON.stringify(Object.myKeys(child)) === '[\"own\"]' ? 'PASS: own only' : 'FAIL: own only');\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput: "PASS: keys\nPASS: values\nPASS: entries\nPASS: own only",
    explanation:
      "for...in includes inherited, so filter with hasOwnProperty. values and entries build on top of keys.",
    keyInsight:
      "for...in includes inherited properties. Always filter with hasOwnProperty. Symbols never included.",
  },
  {
    id: 1024,
    cat: "Utility Functions",
    difficulty: "hard",
    title: "Implement deep clone",
    tags: ["deep-clone", "recursion", "object", "circular"],
    companies: ["Google", "Razorpay", "Atlassian", "CRED", "Amazon"],
    description:
      "Implement deepClone(value). Deep copy objects and arrays. Handle Dates and circular references.",
    stubCode:
      "function deepClone(value, seen = new WeakMap()) {\n  // Handle: primitives, null, Date, Array, plain objects\n  // Handle circular references using 'seen' WeakMap\n}",
    solutionCode:
      "function deepClone(value, seen = new WeakMap()) {\n  if (value === null || typeof value !== 'object') return value;\n  if (seen.has(value)) return seen.get(value);\n  if (value instanceof Date) return new Date(value.getTime());\n  if (Array.isArray(value)) {\n    const clone = [];\n    seen.set(value, clone);\n    for (let i = 0; i < value.length; i++) clone[i] = deepClone(value[i], seen);\n    return clone;\n  }\n  const clone = Object.create(Object.getPrototypeOf(value));\n  seen.set(value, clone);\n  for (const key of Object.keys(value)) clone[key] = deepClone(value[key], seen);\n  return clone;\n}",
    testCode:
      "(function() {\n  try {\n    const orig = { a: 1, b: { c: [1,2,3] } };\n    const clone = deepClone(orig);\n    clone.b.c.push(4);\n    console.log(orig.b.c.length === 3 ? 'PASS: deep independent' : 'FAIL: deep independent');\n    const withDate = { d: new Date('2024-01-01') };\n    const cloneD = deepClone(withDate);\n    console.log(cloneD.d instanceof Date && cloneD.d !== withDate.d ? 'PASS: Date cloned' : 'FAIL: Date cloned');\n    const obj = { name: 'test' };\n    obj.self = obj;\n    const circ = deepClone(obj);\n    console.log(circ.self === circ ? 'PASS: circular' : 'FAIL: circular');\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput: "PASS: deep independent\nPASS: Date cloned\nPASS: circular",
    explanation:
      "Recurse into objects/arrays. WeakMap tracks original\u2192clone for circular refs. Handle Date with getTime().",
    keyInsight:
      "WeakMap(original \u2192 clone) is the standard circular reference solution. Check seen.has(value) before recursing.",
  },
  {
    id: 1025,
    cat: "Utility Functions",
    difficulty: "hard",
    title: "Implement EventEmitter",
    tags: ["EventEmitter", "observer", "pub-sub", "utility"],
    companies: ["Google", "Razorpay", "Atlassian", "CRED", "Amazon"],
    description: "Implement EventEmitter with on, off, emit, and once methods.",
    stubCode:
      "class EventEmitter {\n  constructor() {\n    // Initialize listeners storage\n  }\n\n  on(event, listener) {\n    // Register listener\n  }\n\n  off(event, listener) {\n    // Remove listener\n  }\n\n  emit(event, ...args) {\n    // Call all listeners\n  }\n\n  once(event, listener) {\n    // Register listener that fires only once\n  }\n}",
    solutionCode:
      "class EventEmitter {\n  constructor() { this._events = {}; }\n  on(event, listener) {\n    if (!this._events[event]) this._events[event] = [];\n    this._events[event].push(listener);\n    return this;\n  }\n  off(event, listener) {\n    if (!this._events[event]) return this;\n    this._events[event] = this._events[event].filter(l => l !== listener);\n    return this;\n  }\n  emit(event, ...args) {\n    if (!this._events[event]) return false;\n    this._events[event].forEach(l => l.apply(this, args));\n    return true;\n  }\n  once(event, listener) {\n    const wrapper = (...args) => { listener.apply(this, args); this.off(event, wrapper); };\n    return this.on(event, wrapper);\n  }\n}",
    testCode:
      "(function() {\n  try {\n    const emitter = new EventEmitter();\n    const results = [];\n    emitter.on('data', x => results.push(x));\n    emitter.emit('data', 1); emitter.emit('data', 2);\n    console.log(JSON.stringify(results) === '[1,2]' ? 'PASS: on and emit' : 'FAIL: on and emit \u2014 got ' + JSON.stringify(results));\n    const handler = x => results.push('off:' + x);\n    emitter.on('test', handler);\n    emitter.emit('test', 'a');\n    emitter.off('test', handler);\n    emitter.emit('test', 'b');\n    console.log(results.includes('off:a') && !results.includes('off:b') ? 'PASS: off' : 'FAIL: off');\n    let onceCount = 0;\n    emitter.once('once', () => onceCount++);\n    emitter.emit('once'); emitter.emit('once'); emitter.emit('once');\n    console.log(onceCount === 1 ? 'PASS: once' : 'FAIL: once \u2014 count=' + onceCount);\n  } catch(e) { console.log('FAIL: threw \u2014 ' + e.message); }\n})();",
    expectedOutput: "PASS: on and emit\nPASS: off\nPASS: once",
    explanation:
      "Store listeners in object keyed by event. once wraps listener to self-remove after first call.",
    keyInsight:
      "once is just a wrapper that calls off on itself after firing \u2014 no special storage needed.",
  },
];
