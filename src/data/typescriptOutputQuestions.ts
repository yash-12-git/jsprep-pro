/**
 * src/data/typescriptOutputQuestions.ts
 *
 * TypeScript output prediction questions for jsprep.pro
 *
 * CONTRACT:
 *  ✅ Pure JS/TS that can run — type resolution simulated with console.log
 *  ✅ All output via console.log
 *  ✅ Deterministic — same result every run
 *  ✅ answer = exact console.log output (one value per line)
 *  ✅ IDs start at 5001 — TypeScript section
 */

import type { OutputQuestion } from './outputQuestions';

export const TYPESCRIPT_OUTPUT_CATEGORIES = [
  'Type Inference',
  'Generics & Bounds',
  'Conditional Types',
  'Union & Intersection',
] as const;

export const typescriptOutputQuestions: OutputQuestion[] = [

  // ─── TYPE INFERENCE (4) ───────────────────────────────────────────────────

  {
    id: 5001,
    cat: 'Type Inference' as any,
    difficulty: 'easy',
    title: 'typeof narrowing determines which branch runs',
    tags: ['typeof', 'narrowing', 'inference', 'type-guard'],
    companies: ['Microsoft', 'Atlassian', 'Google', 'Meta'],
    code: `// Simulate TypeScript's typeof narrowing at runtime
function describe(val) {
  if (typeof val === 'string') {
    console.log('string:' + val.toUpperCase());
  } else if (typeof val === 'number') {
    console.log('number:' + val.toFixed(1));
  } else if (typeof val === 'boolean') {
    console.log('boolean:' + val);
  } else {
    console.log('other');
  }
}

describe('hello');
describe(3.14159);
describe(true);
describe(null);`,
    answer: 'string:HELLO\nnumber:3.1\nboolean:true\nother',
    explanation:
      'Each call narrows to the matching branch. null has typeof "object" so it falls through to the else branch.',
    keyInsight:
      'TypeScript uses typeof narrowing to refine union types in conditional blocks. After typeof val === "string", TypeScript knows val is string and allows string methods.',
  },

  {
    id: 5002,
    cat: 'Type Inference' as any,
    difficulty: 'medium',
    title: 'Const assertion — literal type vs widened type',
    tags: ['const-assertion', 'literal-type', 'widening', 'inference'],
    companies: ['Microsoft', 'Google', 'Razorpay'],
    code: `// Simulate what TypeScript infers — const narrows to literal, let widens
const direction = 'north';  // inferred: "north" (literal)
let mutableDir = 'north';   // inferred: string (widened)

// Demonstrate by checking type at runtime
console.log(typeof direction);        // string at runtime
console.log(direction === 'north');   // true — exact literal value

// const object without assertion — values widened
const config = { host: 'localhost', port: 3000 };
config.host = 'other';  // allowed — string, not literal "localhost"
console.log(config.host);

// Frozen object — runtime immutability
const frozen = Object.freeze({ host: 'localhost', port: 3000 });
try {
  frozen.host = 'other';  // silently fails in non-strict, throws in strict
} catch(e) {
  // swallow
}
console.log(frozen.host);`,
    answer: 'string\ntrue\nother\nlocalhost',
    explanation:
      'typeof is always "string" at runtime regardless of literal types. config.host can be reassigned because TypeScript infers it as string (not "localhost" literal). Object.freeze prevents mutation at runtime.',
    keyInsight:
      'TypeScript `as const` creates readonly literal types. Without it, object property types are widened to their base type (string, number) and remain mutable. Object.freeze() is the runtime equivalent of `as const`.',
  },

  {
    id: 5003,
    cat: 'Type Inference' as any,
    difficulty: 'medium',
    title: 'Discriminated union narrowing via switch',
    tags: ['discriminated-union', 'narrowing', 'switch', 'inference'],
    companies: ['Microsoft', 'Meta', 'Atlassian', 'CRED'],
    code: `// Simulates TypeScript discriminated union narrowing
function processShape(shape) {
  switch (shape.kind) {
    case 'circle':
      // Narrowed to circle — radius available
      console.log('area:' + (Math.PI * shape.radius ** 2).toFixed(2));
      break;
    case 'square':
      // Narrowed to square — side available
      console.log('area:' + (shape.side ** 2).toFixed(2));
      break;
    case 'rectangle':
      console.log('area:' + (shape.width * shape.height).toFixed(2));
      break;
  }
}

processShape({ kind: 'circle', radius: 5 });
processShape({ kind: 'square', side: 4 });
processShape({ kind: 'rectangle', width: 3, height: 6 });`,
    answer: 'area:78.54\narea:16.00\narea:18.00',
    explanation:
      'Each switch case narrows the type. After `case "circle"`, shape is { kind: "circle"; radius: number } and shape.radius is safe to access.',
    keyInsight:
      'Discriminated unions use a literal-type "tag" field to narrow the type in each branch. TypeScript automatically knows which properties are available after each case — this is exhaustiveness checking in action.',
  },

  {
    id: 5004,
    cat: 'Type Inference' as any,
    difficulty: 'hard',
    title: 'ReturnType inference — function return shapes',
    tags: ['ReturnType', 'inference', 'return-type', 'generics'],
    companies: ['Microsoft', 'Google', 'Razorpay', 'Atlassian'],
    code: `// Simulate what ReturnType<T> extracts at runtime
function makeUser(name, age) {
  return { name, age, createdAt: new Date('2024-01-01').toISOString() };
}

function makeProduct(title, price) {
  return { title, price, inStock: true };
}

// ReturnType would give: { name: string; age: number; createdAt: string }
// Simulate by actually calling and logging keys
const user = makeUser('Alice', 30);
const product = makeProduct('Widget', 9.99);

// Log the inferred shape
console.log(Object.keys(user).sort().join(','));
console.log(Object.keys(product).sort().join(','));

// TypeScript uses the return value's shape — not what you annotate
function identity(x) { return x; }
const val = identity(42);
console.log(typeof val);`,
    answer: 'age,createdAt,name\ninStock,price,title\nnumber',
    explanation:
      'Object.keys returns the actual property names. TypeScript infers ReturnType from the concrete return expression — makeUser returns an object with name, age, createdAt. identity(42) returns number because 42 is number.',
    keyInsight:
      'TypeScript infers function return types from the return expression, not from what you wish it returned. This means ReturnType<typeof makeUser> gives you the exact shape including all fields — even dynamically added ones.',
  },

  // ─── GENERICS & BOUNDS (4) ────────────────────────────────────────────────

  {
    id: 5005,
    cat: 'Generics & Bounds' as any,
    difficulty: 'medium',
    title: 'Generic identity — T resolves to the argument type',
    tags: ['generics', 'identity', 'inference', 'type-parameter'],
    companies: ['Microsoft', 'Google', 'Meta'],
    code: `// Simulate generic type resolution
function identity(value) {
  return value;
}

// TypeScript resolves T to the argument type at each call site
const n = identity(42);       // T = number
const s = identity('hello');  // T = string
const a = identity([1, 2, 3]); // T = number[]
const o = identity({ x: 1 }); // T = { x: number }

console.log(typeof n);
console.log(typeof s);
console.log(Array.isArray(a));
console.log(typeof o);
console.log(n + 1);  // safe — TypeScript knows it's number`,
    answer: 'number\nstring\ntrue\nobject\n43',
    explanation:
      'Each call resolves T to the exact type of the argument. TypeScript does not widen — identity(42) gives T=number, not T=number|string.',
    keyInsight:
      'Generic functions preserve the exact type of their argument through the return type. This is why identity<T>(v: T): T is so powerful — callers get back exactly the type they put in, not a wider type.',
  },

  {
    id: 5006,
    cat: 'Generics & Bounds' as any,
    difficulty: 'medium',
    title: 'extends constraint — keyof and property access',
    tags: ['extends', 'keyof', 'constraint', 'property-access'],
    companies: ['Microsoft', 'Atlassian', 'Google', 'Razorpay'],
    code: `// Simulate T extends keyof U — type-safe property access
function getProperty(obj, key) {
  // TypeScript: T extends object, K extends keyof T, returns T[K]
  if (!(key in obj)) throw new Error('key not found');
  return obj[key];
}

const user = { name: 'Alice', age: 30, email: 'alice@example.com' };

console.log(getProperty(user, 'name'));
console.log(getProperty(user, 'age'));
console.log(typeof getProperty(user, 'age'));
console.log(typeof getProperty(user, 'name'));

// TypeScript ensures return type matches the property type
// getProperty(user, 'name') => string
// getProperty(user, 'age') => number`,
    answer: 'Alice\n30\nnumber\nstring',
    explanation:
      'getProperty with a K extends keyof T constraint returns T[K] — the exact type of the property accessed. TypeScript infers "Alice" returns string and 30 returns number.',
    keyInsight:
      'The pattern <T, K extends keyof T>(obj: T, key: K): T[K] is one of TypeScript\'s most powerful generic signatures. It ensures property names are valid AND the return type matches the property type — no casting needed.',
  },

  {
    id: 5007,
    cat: 'Generics & Bounds' as any,
    difficulty: 'hard',
    title: 'Generic Array utilities — map and filter type resolution',
    tags: ['generics', 'array', 'map', 'filter', 'type-resolution'],
    companies: ['Microsoft', 'Meta', 'Google', 'Flipkart'],
    code: `// TypeScript generic type resolution for array utilities
// map<T, U>(arr: T[], fn: (x: T) => U): U[]
// filter<T>(arr: T[], pred: (x: T) => boolean): T[]

const numbers = [1, 2, 3, 4, 5];
const strings = ['apple', 'banana', 'cherry'];

// map: T=number, U=string  → string[]
const formatted = numbers.map(n => n.toFixed(1));
console.log(formatted.join(','));

// filter: T=number → number[]
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens.join(','));

// map + filter chain: T=string → string[]
const long = strings
  .filter(s => s.length > 5)
  .map(s => s.toUpperCase());
console.log(long.join(','));

// TypeScript resolves chained generics — each step keeps correct type
console.log(typeof evens[0]);`,
    answer: '1.0,2.0,3.0,4.0,5.0\n2,4\nBANANA,CHERRY\nnumber',
    explanation:
      'map preserves element type through the callback return type. filter preserves the original array element type. Chained operations each resolve their generics independently.',
    keyInsight:
      'Array.prototype.map<U> and filter both use generics. map<T,U>(fn: (v: T) => U): U[] transforms the element type. filter(pred): T[] keeps the original type. TypeScript resolves each generic at the call site.',
  },

  {
    id: 5008,
    cat: 'Generics & Bounds' as any,
    difficulty: 'hard',
    title: 'Constrained generic with default — what type is inferred',
    tags: ['constraint', 'default', 'inference', 'generic-default'],
    companies: ['Microsoft', 'Google', 'Atlassian'],
    code: `// Simulate generic with constraint and default
// function wrap<T extends object = Record<string, unknown>>(val: T): { wrapped: T }

function wrap(val) {
  return { wrapped: val };
}

// Explicit type arg — T = { name: string }
const a = wrap({ name: 'Alice' });
// T[wrapped] = { name: string }

// Inferred from arg — T = { id: number, active: boolean }
const b = wrap({ id: 1, active: true });

// Default would apply when called with no args (not possible here)
// but T extends object means: numbers/strings rejected at type level

console.log(JSON.stringify(a));
console.log(JSON.stringify(b));
console.log(typeof a.wrapped);
console.log(Object.keys(b.wrapped).sort().join(','));`,
    answer: '{"wrapped":{"name":"Alice"}}\n{"wrapped":{"id":1,"active":true}}\nobject\nactive,id',
    explanation:
      'wrap infers T from the argument. a.wrapped is { name: "Alice" }, b.wrapped is { id: number; active: boolean }. TypeScript would reject non-object arguments due to the T extends object constraint.',
    keyInsight:
      'Generic defaults (T = SomeType) kick in when the type parameter cannot be inferred AND is not explicitly provided. The constraint (T extends object) applies regardless of whether a default is used.',
  },

  // ─── CONDITIONAL TYPES (4) ────────────────────────────────────────────────

  {
    id: 5009,
    cat: 'Conditional Types' as any,
    difficulty: 'medium',
    title: 'IsArray conditional — resolves based on type check',
    tags: ['conditional-type', 'extends', 'resolution', 'utility'],
    companies: ['Microsoft', 'Google', 'Meta'],
    code: `// Simulate TypeScript conditional type resolution at runtime
// type IsArray<T> = T extends any[] ? "yes" : "no"

function isArray(val) {
  return Array.isArray(val) ? 'yes' : 'no';
}

// TypeScript resolves these at compile time:
// IsArray<number[]>  => "yes"
// IsArray<string>    => "no"
// IsArray<string[]>  => "yes"
// IsArray<null>      => "no"

console.log(isArray([1, 2, 3]));   // number[]
console.log(isArray('hello'));     // string
console.log(isArray(['a', 'b']));  // string[]
console.log(isArray(null));        // null
console.log(isArray({}));          // object`,
    answer: 'yes\nno\nyes\nno\nno',
    explanation:
      'Array.isArray mirrors what TypeScript\'s conditional type T extends any[] ? "yes" : "no" would resolve to. Arrays satisfy the condition; all other types do not.',
    keyInsight:
      'TypeScript conditional types resolve at compile time based on type relationships, not runtime values. The T extends any[] check uses structural compatibility — a type is "array-like" if it extends any[].',
  },

  {
    id: 5010,
    cat: 'Conditional Types' as any,
    difficulty: 'medium',
    title: 'NonNullable conditional — null and undefined are removed',
    tags: ['NonNullable', 'conditional-type', 'null', 'undefined'],
    companies: ['Microsoft', 'Atlassian', 'Razorpay'],
    code: `// Simulate NonNullable<T> = T extends null | undefined ? never : T
// At runtime, demonstrate which values would survive NonNullable

function nonNullable(val) {
  if (val === null || val === undefined) {
    return 'never';  // TypeScript: resolves to never
  }
  return typeof val; // TypeScript: resolves to T (non-nullable version)
}

// TypeScript compile-time resolution:
// NonNullable<string | null>       => string
// NonNullable<number | undefined>  => number
// NonNullable<null | undefined>    => never
// NonNullable<string>              => string

console.log(nonNullable('hello'));
console.log(nonNullable(42));
console.log(nonNullable(null));
console.log(nonNullable(undefined));
console.log(nonNullable(false));`,
    answer: 'string\nnumber\nnever\nnever\nboolean',
    explanation:
      'NonNullable removes null and undefined from a type, resolving to never for pure null/undefined types. All other types pass through unchanged.',
    keyInsight:
      'NonNullable<T> is implemented as T extends null | undefined ? never : T. When used on a union like string | null, the conditional distributes: string | (null extends null|undefined ? never : null) = string | never = string.',
  },

  {
    id: 5011,
    cat: 'Conditional Types' as any,
    difficulty: 'hard',
    title: 'infer extracts the wrapped type from a generic container',
    tags: ['infer', 'conditional-type', 'unwrap', 'extraction'],
    companies: ['Microsoft', 'Google', 'Meta', 'Atlassian'],
    code: `// Simulate: type Unwrap<T> = T extends Array<infer E> ? E : T
// and:         type Awaited<T> = T extends Promise<infer R> ? Awaited<R> : T

function unwrapArray(arr) {
  if (Array.isArray(arr)) return arr[0];
  return arr;
}

function unwrapPromiseSync(p) {
  // Synchronously simulate what the type resolves to
  if (p && typeof p.then === 'function') {
    return 'Promise<' + typeof p._value + '>';
  }
  return typeof p;
}

// Unwrap<number[]>   => number (element type)
// Unwrap<string[]>   => string
// Unwrap<string>     => string (not an array, identity)

console.log(typeof unwrapArray([1, 2, 3]));    // number (element)
console.log(typeof unwrapArray(['a', 'b']));   // string (element)
console.log(typeof unwrapArray('hello'));      // string (not array — identity)
console.log(typeof unwrapArray([true, false])); // boolean`,
    answer: 'number\nstring\nstring\nboolean',
    explanation:
      'unwrapArray returns the first element for arrays (the inferred element type E) and the value itself for non-arrays. This mirrors Unwrap<T> = T extends Array<infer E> ? E : T.',
    keyInsight:
      'The infer keyword captures the type matched in the extends pattern. T extends Array<infer E> says "if T is an array, name the element type E". Then you use E in the true branch. This is how Awaited, ReturnType, and Parameters are built.',
  },

  {
    id: 5012,
    cat: 'Conditional Types' as any,
    difficulty: 'hard',
    title: 'Distributive conditional — union members resolved independently',
    tags: ['distributive', 'conditional-type', 'union', 'distribution'],
    companies: ['Microsoft', 'Google', 'Atlassian'],
    code: `// Simulate TypeScript distributive conditional types
// type ToArray<T> = T extends unknown ? T[] : never
// Applied to union: distributes over each member

function toArrayType(values) {
  // Type-level: ToArray<string | number> = string[] | number[]
  // Runtime: demonstrate the distribution
  if (Array.isArray(values)) {
    return values.map(v => [v]); // each element wrapped in array
  }
  return [values];
}

// string | number → distributes → string[] | number[]
// NOT: (string | number)[]

const stringArrays = toArrayType(['a', 'b', 'c']);
const singleNum = toArrayType(42);

console.log(JSON.stringify(stringArrays));
console.log(JSON.stringify(singleNum));

// Prevent distribution with tuple brackets: [T] extends [unknown]
// type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never
// ToArrayNonDist<string | number> = (string | number)[]
console.log(typeof stringArrays[0][0]);
console.log(typeof singleNum[0]);`,
    answer: '[["a"],["b"],["c"]]\n[42]\nstring\nnumber',
    explanation:
      'Distribution means the conditional is applied to each union member separately. ToArray<string | number> = ToArray<string> | ToArray<number> = string[] | number[], NOT (string | number)[].',
    keyInsight:
      'Distributive conditional types apply when T is a naked type parameter (not wrapped in []). Wrapping breaks distribution: [T] extends [U] treats T as a whole, not distributing over union members. This distinction matters for utility types like Exclude.',
  },

  // ─── UNION & INTERSECTION (3) ─────────────────────────────────────────────

  {
    id: 5013,
    cat: 'Union & Intersection' as any,
    difficulty: 'medium',
    title: 'Union type — in operator narrows to the correct variant',
    tags: ['union', 'in-operator', 'narrowing', 'discriminated'],
    companies: ['Microsoft', 'Atlassian', 'Meta', 'Razorpay'],
    code: `// Simulate union type narrowing via 'in' operator
// type Animal = Cat | Dog
// Cat has meow(), Dog has bark()

function makeSound(animal) {
  if ('meow' in animal) {
    console.log('Cat says: ' + animal.meow());
  } else if ('bark' in animal) {
    console.log('Dog says: ' + animal.bark());
  } else {
    console.log('Unknown animal');
  }
}

const cat = { meow: () => 'meow', lives: 9 };
const dog = { bark: () => 'woof', breed: 'Labrador' };
const fish = { swim: () => 'splash' };

makeSound(cat);
makeSound(dog);
makeSound(fish);`,
    answer: 'Cat says: meow\nDog says: woof\nUnknown animal',
    explanation:
      '"in" operator checks property existence at runtime. TypeScript uses the same pattern to narrow union types in conditional blocks.',
    keyInsight:
      'The "in" type guard narrows a union by checking if a property exists. After "meow" in animal, TypeScript knows the value is the Cat variant because only Cat has meow. This works for both discriminated and non-discriminated unions.',
  },

  {
    id: 5014,
    cat: 'Union & Intersection' as any,
    difficulty: 'medium',
    title: 'Intersection type — must satisfy all merged properties',
    tags: ['intersection', 'merge', 'object-types', 'properties'],
    companies: ['Microsoft', 'Google', 'Atlassian'],
    code: `// Simulate TypeScript intersection type A & B
// An intersection must have ALL properties from both types

function merge(a, b) {
  return { ...a, ...b };
}

// Serializable = { serialize(): string }
// Loggable     = { log(): void }
// Combined     = Serializable & Loggable = must have both

const serializable = { serialize: () => '{"name":"Alice"}' };
const loggable = { log: () => console.log('logged') };

const combined = merge(serializable, loggable);

// combined has ALL properties from both
console.log(typeof combined.serialize);
console.log(typeof combined.log);
console.log(combined.serialize());

// Check what happens when same key appears (last writer wins at runtime)
const conflicting = merge({ id: 'string-id' }, { id: 42 });
console.log(typeof conflicting.id);  // intersection: string & number = never (TS)
                                      // but at runtime: last value wins`,
    answer: 'function\nfunction\n{"name":"Alice"}\nnumber',
    explanation:
      'merged object has all properties from both sources. When the same key conflicts, runtime spread takes the last value (42, a number). TypeScript would type this as never (string & number = never).',
    keyInsight:
      'Intersection types require ALL properties from all intersected types. When the same property appears with incompatible types, TypeScript resolves it to never — making it unusable. At runtime, object spread takes the last value.',
  },

  {
    id: 5015,
    cat: 'Union & Intersection' as any,
    difficulty: 'hard',
    title: 'Union narrowing exhaustion — never in the default case',
    tags: ['union', 'exhaustive-check', 'never', 'switch'],
    companies: ['Microsoft', 'Meta', 'Google', 'Atlassian'],
    code: `// Simulate exhaustive union checking with never
// type Status = 'active' | 'inactive' | 'pending'

function getStatusLabel(status) {
  switch (status) {
    case 'active':   return 'Active User';
    case 'inactive': return 'Inactive User';
    case 'pending':  return 'Pending Approval';
    default:
      // In TypeScript: const _check: never = status
      // If all cases covered, default is unreachable — _check is never
      // If a new case added without handling, _check errors at compile time
      return 'Unknown: ' + status;
  }
}

const statuses = ['active', 'inactive', 'pending', 'banned'];
statuses.forEach(s => console.log(getStatusLabel(s)));

// At compile time, if Status = 'active' | 'inactive' | 'pending':
// The default case has status: never — TypeScript can prove it's unreachable
console.log(statuses.length);`,
    answer: 'Active User\nInactive User\nPending Approval\nUnknown: banned\n4',
    explanation:
      'All three defined cases are handled. "banned" falls through to default — at runtime it returns Unknown: banned. TypeScript\'s never type would catch this at compile time if "banned" were added to the type without a case.',
    keyInsight:
      'Assigning the default case to a variable of type never is TypeScript\'s exhaustiveness check pattern. If the union gains a new member that isn\'t handled, TypeScript errors because that member is not assignable to never.',
  },

];
