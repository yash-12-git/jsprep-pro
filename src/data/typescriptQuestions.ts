import type { Question } from './questions';

export const TYPESCRIPT_CATEGORIES = [
  'Type System',
  'Generics',
  'Utility Types',
  'Classes & OOP',
  'Advanced Types',
];

export const typescriptQuestions: Question[] = [

  // ─── TYPE SYSTEM (8) ──────────────────────────────────────────────────────

  {
    id: 5001, cat: 'Type System', tags: ['core'],
    q: 'What is type inference in TypeScript and when does it kick in?',
    hint: 'TypeScript deduces types automatically from context — assignments, return values, default parameters',
    answer: `<p><strong>Type inference</strong> is TypeScript's ability to automatically determine a value's type without an explicit annotation.</p>
<p><strong>Where inference applies:</strong></p>
<ul>
<li><strong>Variable initialization</strong> — <code>const x = 42</code> infers <code>number</code></li>
<li><strong>Function return type</strong> — inferred from the return expression</li>
<li><strong>Default parameters</strong> — <code>function greet(name = 'World')</code> infers <code>name: string</code></li>
<li><strong>Destructuring</strong> — inferred from the source type</li>
<li><strong>Generic instantiation</strong> — argument types drive the type parameter</li>
</ul>
<pre><code>// Variable initialization
const count = 0;       // inferred: number
const name = 'Alice';  // inferred: string
const active = true;   // inferred: boolean

// Function return
function add(a: number, b: number) {
  return a + b; // return type inferred as number
}

// Contextual typing — callback param inferred from array type
const nums = [1, 2, 3];
nums.forEach(n => console.log(n.toFixed(2))); // n inferred as number

// Generic inference
function identity&lt;T&gt;(value: T): T { return value; }
const result = identity('hello'); // T inferred as string</code></pre>
<div class="tip">💡 Prefer inference over redundant annotations. Write <code>const x = 42</code> not <code>const x: number = 42</code>. Annotate function parameters and public API shapes where inference can't help consumers.</div>`,
  },

  {
    id: 5002, cat: 'Type System', tags: ['core'],
    q: 'What is the difference between any, unknown, and never in TypeScript?',
    hint: 'any opts out of type checking; unknown is safe any (must narrow); never is the bottom type — unreachable code',
    answer: `<p>These three types occupy opposite ends of the type hierarchy.</p>
<p><strong>any</strong> — the escape hatch. Disables all type checking for that value. Assignable to and from everything.</p>
<pre><code>let a: any = 42;
a.foo.bar.baz; // no error — type checking disabled
const b: number = a; // OK — any is assignable to anything</code></pre>
<p><strong>unknown</strong> — the type-safe alternative to any. You must narrow it before using it.</p>
<pre><code>let u: unknown = getValueFromAPI();

u.toUpperCase(); // ❌ Error — must narrow first

if (typeof u === 'string') {
  u.toUpperCase(); // ✅ Safe — narrowed to string
}

// unknown is NOT assignable to specific types without narrowing
const s: string = u; // ❌ Error</code></pre>
<p><strong>never</strong> — the bottom type. A value that can never exist. Used for:</p>
<ul>
<li>Functions that never return (throw or infinite loop)</li>
<li>Exhaustive checks in switch/if statements</li>
<li>Impossible intersections</li>
</ul>
<pre><code>function fail(msg: string): never {
  throw new Error(msg); // never returns
}

// Exhaustive check — never signals unhandled case
type Shape = 'circle' | 'square';
function area(s: Shape) {
  switch (s) {
    case 'circle': return Math.PI;
    case 'square': return 1;
    default:
      const _exhaustive: never = s; // ❌ Error if new case not handled
  }
}</code></pre>
<div class="tip">💡 Prefer <code>unknown</code> over <code>any</code> for values from external sources (API responses, JSON.parse). It forces you to validate before use — the TypeScript equivalent of defensive programming.</div>`,
  },

  {
    id: 5003, cat: 'Type System', tags: ['mid'],
    q: 'What are type assertions and when should you use them?',
    hint: 'as Type tells TypeScript "trust me" — use sparingly; prefer type guards for safety',
    answer: `<p><strong>Type assertions</strong> tell TypeScript to treat a value as a specific type, overriding inferred or declared types. They do NOT perform runtime conversion.</p>
<pre><code>// as syntax (preferred)
const input = document.getElementById('name') as HTMLInputElement;
input.value; // now valid — TypeScript trusts your assertion

// angle-bracket syntax (avoid in .tsx files)
const input2 = &lt;HTMLInputElement&gt;document.getElementById('name');

// Non-null assertion operator (!) — asserts value is not null/undefined
const el = document.querySelector('.btn')!; // you assert it exists
el.click();

// Double assertion — escape hatch when types seem incompatible
const x = someValue as unknown as TargetType;</code></pre>
<p><strong>When to use:</strong></p>
<ul>
<li>Narrowing DOM types (<code>as HTMLInputElement</code>) where TypeScript can't know the exact element</li>
<li>After validating data from external sources where you've confirmed the shape</li>
<li>Testing utilities where you intentionally pass partial objects</li>
</ul>
<p><strong>When NOT to use:</strong></p>
<ul>
<li>As a shortcut to silence type errors — the error exists for a reason</li>
<li>Instead of proper type guards that provide actual runtime safety</li>
</ul>
<pre><code>// ❌ Silencing a real bug
const user = getUser() as User; // getUser might return null!

// ✅ Proper guard
const maybeUser = getUser();
if (maybeUser !== null) {
  const user: User = maybeUser; // safe
}</code></pre>
<div class="tip">💡 Each <code>as</code> assertion is a promise you make to TypeScript. Every assertion you write is a potential source of runtime errors if your assumption is wrong.</div>`,
  },

  {
    id: 5004, cat: 'Type System', tags: ['core'],
    q: 'What is structural typing (duck typing) in TypeScript?',
    hint: 'Compatibility is based on shape, not name — if it has the right properties, it is the right type',
    answer: `<p>TypeScript uses <strong>structural typing</strong>: two types are compatible if they share the same shape (property names and types), regardless of their declared names. This is unlike nominal typing systems (Java, C#) where the type name matters.</p>
<pre><code>interface Point {
  x: number;
  y: number;
}

// An object literal with the right shape is assignable
const p: Point = { x: 1, y: 2 }; // ✅

// A class with the right shape is also assignable
class Vector {
  constructor(public x: number, public y: number) {}
}
const v: Point = new Vector(3, 4); // ✅ — Vector is structurally compatible

// Extra properties are fine when assigning to a less specific type
const extended = { x: 1, y: 2, label: 'origin' };
const p2: Point = extended; // ✅ — subset assignment (not a fresh literal)

// ❌ Fresh object literals trigger excess property checks
const p3: Point = { x: 1, y: 2, label: 'origin' }; // Error: 'label' not in Point</code></pre>
<p><strong>Practical implications:</strong></p>
<ul>
<li>Functions accepting a type will accept any superset — enables flexible APIs</li>
<li>You don't need <code>implements</code> to satisfy an interface — the shape is enough</li>
<li>Excess property checks only apply to fresh object literals</li>
</ul>
<pre><code>function printPoint(p: Point) { console.log(p.x, p.y); }

// All of these work — all have x and y:
printPoint({ x: 1, y: 2 });
printPoint(new Vector(1, 2));
printPoint({ x: 1, y: 2, z: 3 }); // extra props OK in this context</code></pre>
<div class="tip">💡 Structural typing is why TypeScript feels flexible. You can define interfaces after the fact to describe shapes that already exist — great for working with third-party code.</div>`,
  },

  {
    id: 5005, cat: 'Type System', tags: ['mid'],
    q: 'What are union types and intersection types? When do you use each?',
    hint: 'Union = A OR B (use narrowing to distinguish); intersection = A AND B (merged shape)',
    answer: `<p><strong>Union types</strong> (<code>A | B</code>) — a value can be one of several types. You need type narrowing to use type-specific operations.</p>
<pre><code>type StringOrNumber = string | number;

function format(val: StringOrNumber): string {
  if (typeof val === 'string') {
    return val.toUpperCase(); // narrowed to string
  }
  return val.toFixed(2); // narrowed to number
}

// Discriminated union — literal type narrows the variant
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };

function area(s: Shape) {
  switch (s.kind) {
    case 'circle': return Math.PI * s.radius ** 2;
    case 'square': return s.side ** 2;
  }
}</code></pre>
<p><strong>Intersection types</strong> (<code>A &amp; B</code>) — a value must satisfy ALL types simultaneously. Useful for composing object shapes.</p>
<pre><code>type Serializable = { serialize(): string };
type Loggable = { log(): void };

type SerializableLogger = Serializable & Loggable;
// Must have both serialize() AND log()

// Merging object types
type Admin = User & { adminLevel: number };

// Conflict: if A and B have same property with incompatible types
type Conflict = { id: string } & { id: number };
// id becomes: string & number = never — unusable</code></pre>
<div class="tip">💡 Use union for "one of these options"; use intersection for "must satisfy all of these". Discriminated unions are the most powerful pattern for modeling state machines and API responses.</div>`,
  },

  {
    id: 5006, cat: 'Type System', tags: ['mid'],
    q: 'What are type guards and how do you create custom ones?',
    hint: 'Narrowing the type in a branch — typeof, instanceof, in operator, or a user-defined predicate function',
    answer: `<p>Type guards narrow a broad type to a more specific one within a conditional block.</p>
<p><strong>Built-in type guards:</strong></p>
<pre><code>function process(val: string | number | null) {
  if (typeof val === 'string') { /* val is string */ }
  if (typeof val === 'number') { /* val is number */ }
  if (val !== null) { /* val is string | number */ }
}

// instanceof — for class instances
function handleEvent(e: MouseEvent | KeyboardEvent) {
  if (e instanceof KeyboardEvent) {
    console.log(e.key); // safe
  }
}

// in operator — property existence check
type Cat = { meow(): void };
type Dog = { bark(): void };
function speak(animal: Cat | Dog) {
  if ('meow' in animal) animal.meow();
  else animal.bark();
}</code></pre>
<p><strong>User-defined type guard</strong> — a function returning <code>val is T</code>:</p>
<pre><code>interface User { id: number; name: string; }

// The return type "val is User" is the type predicate
function isUser(val: unknown): val is User {
  return (
    typeof val === 'object' &&
    val !== null &&
    'id' in val &&
    'name' in val &&
    typeof (val as User).id === 'number' &&
    typeof (val as User).name === 'string'
  );
}

// Usage — TypeScript now knows it's a User after the check
const data: unknown = fetchJSON();
if (isUser(data)) {
  console.log(data.name); // safe — TypeScript trusts your predicate
}</code></pre>
<div class="tip">💡 Type predicates (<code>val is T</code>) are a contract you make with TypeScript. If your implementation is wrong, TypeScript won't catch it — always thoroughly validate all expected fields.</div>`,
  },

  {
    id: 5007, cat: 'Type System', tags: ['mid'],
    q: 'What is the difference between type and interface in TypeScript?',
    hint: 'interface is extendable and mergeable; type is more powerful (unions, tuples, mapped types) but not mergeable',
    answer: `<p>Both define object shapes, but they have different capabilities:</p>
<p><strong>Interface</strong> — designed for object/class shapes, supports declaration merging:</p>
<pre><code>interface User {
  id: number;
  name: string;
}

// Extending interfaces
interface Admin extends User {
  adminLevel: number;
}

// Declaration merging — useful for augmenting library types
interface Window {
  myCustomProp: string; // adds to existing Window interface
}

// Implementing in a class
class ConcreteUser implements User {
  constructor(public id: number, public name: string) {}
}</code></pre>
<p><strong>Type alias</strong> — more powerful, works with any type including primitives, unions, tuples, and mapped types:</p>
<pre><code>// Primitive alias
type ID = string | number;

// Union — interfaces can't do this
type Status = 'active' | 'inactive' | 'pending';

// Tuple
type Pair = [string, number];

// Mapped type — only type aliases can do this directly
type Readonly&lt;T&gt; = { readonly [K in keyof T]: T[K] };

// Conditional type
type NonNullable&lt;T&gt; = T extends null | undefined ? never : T;</code></pre>
<p><strong>Practical guidance:</strong></p>
<ul>
<li>Use <strong>interface</strong> for public API shapes that consumers may want to extend</li>
<li>Use <strong>type</strong> for unions, computed types, tuples, and function signatures</li>
<li>Be consistent within a codebase — consistency matters more than which one you pick</li>
</ul>
<div class="tip">💡 The React team recommends <code>interface</code> for component props and <code>type</code> for everything else. Both work for most cases — pick a style and stick to it.</div>`,
  },

  {
    id: 5008, cat: 'Type System', tags: ['adv'],
    q: 'What are literal types and how are they used for precise typing?',
    hint: 'A literal type narrows a string/number/boolean to a specific value — combines with union for exhaustive enumerations',
    answer: `<p><strong>Literal types</strong> narrow a broad primitive type to a specific value. <code>"circle"</code> is a subtype of <code>string</code>, <code>42</code> is a subtype of <code>number</code>.</p>
<pre><code>// String literals
type Direction = 'north' | 'south' | 'east' | 'west';
function move(dir: Direction) { /* only 4 valid inputs */ }

move('north'); // ✅
move('up');    // ❌ Error

// Numeric literals
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// Boolean literals — useful for discriminated unions
type Result&lt;T&gt; =
  | { success: true;  value: T }
  | { success: false; error: string };

function process(r: Result&lt;number&gt;) {
  if (r.success) console.log(r.value); // narrows via boolean literal
  else console.log(r.error);
}</code></pre>
<p><strong>const assertions</strong> — widen prevention:</p>
<pre><code>// Without const — inferred as string
const dir = 'north'; // type: string (widened)

// With const — inferred as literal type
const dir2 = 'north' as const; // type: "north"

// Object with const — all properties become readonly literals
const config = { host: 'localhost', port: 3000 } as const;
// type: { readonly host: "localhost"; readonly port: 3000 }

// Array with const — tuple instead of array
const tuple = [1, 'a'] as const; // type: readonly [1, "a"]</code></pre>
<div class="tip">💡 <code>as const</code> is the modern replacement for enums in many cases. It's a plain JavaScript value (no runtime overhead) while providing the exhaustive type checking of an enum.</div>`,
  },

  // ─── GENERICS (7) ─────────────────────────────────────────────────────────

  {
    id: 5009, cat: 'Generics', tags: ['core'],
    q: 'What are generics and why are they useful in TypeScript?',
    hint: 'Type parameters that make functions/classes/interfaces reusable across multiple types while preserving type safety',
    answer: `<p><strong>Generics</strong> are type parameters that let you write reusable code that works with multiple types without sacrificing type safety.</p>
<pre><code>// Without generics — must duplicate or use any
function getFirstAny(arr: any[]): any { return arr[0]; }

// With generics — type-safe and reusable
function getFirst&lt;T&gt;(arr: T[]): T { return arr[0]; }

const n = getFirst([1, 2, 3]);    // T inferred as number
const s = getFirst(['a', 'b']);   // T inferred as string
// n and s have correct types — no runtime casting needed</code></pre>
<p><strong>Generic interfaces and types:</strong></p>
<pre><code>interface ApiResponse&lt;T&gt; {
  data: T;
  status: number;
  message: string;
}

type UserResponse  = ApiResponse&lt;User&gt;;
type ListResponse  = ApiResponse&lt;User[]&gt;;

// Generic class
class Stack&lt;T&gt; {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
}

const numStack = new Stack&lt;number&gt;();
numStack.push(1);
numStack.push('a'); // ❌ Error — string not assignable to number</code></pre>
<div class="tip">💡 Think of generics as function parameters for types. Just as function parameters make a function reusable for different values, type parameters make types reusable for different types.</div>`,
  },

  {
    id: 5010, cat: 'Generics', tags: ['mid'],
    q: 'What are generic constraints and how do you use the extends keyword with them?',
    hint: 'extends limits which types a type parameter can be — ensures the type has the properties you need',
    answer: `<p><strong>Generic constraints</strong> restrict a type parameter to a subset of types using <code>extends</code>. This lets you access properties guaranteed to exist.</p>
<pre><code>// Without constraint — T could be anything
function getLength&lt;T&gt;(val: T) {
  return val.length; // ❌ Error — T might not have .length
}

// With constraint — T must have .length
function getLength&lt;T extends { length: number }&gt;(val: T): number {
  return val.length; // ✅ Safe
}

getLength('hello');      // string has .length
getLength([1, 2, 3]);    // array has .length
getLength(42);           // ❌ Error — number has no .length</code></pre>
<p><strong>keyof constraint</strong> — ensures a key exists on an object:</p>
<pre><code>function getProperty&lt;T, K extends keyof T&gt;(obj: T, key: K): T[K] {
  return obj[key]; // type-safe property access
}

const user = { name: 'Alice', age: 30 };
getProperty(user, 'name');  // returns string
getProperty(user, 'age');   // returns number
getProperty(user, 'email'); // ❌ Error — 'email' not in user</code></pre>
<p><strong>Multiple constraints:</strong></p>
<pre><code>// Intersection for multiple requirements
function merge&lt;T extends object, U extends object&gt;(a: T, b: U): T & U {
  return { ...a, ...b };
}

// Constraint with another type parameter
function copyFields&lt;T extends U, U&gt;(target: T, source: U): T {
  return Object.assign(target, source);
}</code></pre>
<div class="tip">💡 The pattern <code>&lt;T extends keyof U&gt;</code> is one of the most powerful in TypeScript — it lets you write utilities like Omit, Pick, and getProperty that are fully type-safe at the call site.</div>`,
  },

  {
    id: 5011, cat: 'Generics', tags: ['mid'],
    q: 'What are default type parameters in TypeScript generics?',
    hint: 'Like default function parameters — a fallback type when the type argument is not specified',
    answer: `<p><strong>Default type parameters</strong> provide a fallback type when the caller doesn't explicitly provide one.</p>
<pre><code>// Without default — must always specify T
interface Event&lt;T&gt; {
  type: string;
  payload: T;
}

// With default — T falls back to unknown when not specified
interface Event&lt;T = unknown&gt; {
  type: string;
  payload: T;
}

const genericEvent: Event = { type: 'click', payload: { x: 10 } };
// T inferred as unknown — must narrow payload before using

const typedEvent: Event&lt;MouseData&gt; = { type: 'click', payload: mouseData };
// T is MouseData — payload is fully typed</code></pre>
<p><strong>Practical use cases:</strong></p>
<pre><code>// Promise default is unknown in strict mode, any otherwise
// Custom Result type with default error type
type Result&lt;T, E = Error&gt; = { ok: true; value: T } | { ok: false; error: E };

function fetchUser(): Promise&lt;Result&lt;User&gt;&gt; {
  // Result&lt;User, Error&gt; — E defaults to Error
}

// Component props with optional extension
interface TableProps&lt;T = Record&lt;string, unknown&gt;&gt; {
  data: T[];
  columns: Array&lt;keyof T&gt;;
}

const table: TableProps = { data: [{}], columns: [] };
// T defaults to Record&lt;string, unknown&gt;</code></pre>
<div class="tip">💡 Defaults must come after non-default type parameters, just like JavaScript default arguments. <code>&lt;T, E = Error&gt;</code> is valid; <code>&lt;T = Error, E&gt;</code> is not.</div>`,
  },

  {
    id: 5012, cat: 'Generics', tags: ['mid'],
    q: 'What is conditional generic typing — how do you write T extends U ? X : Y?',
    hint: 'Distribute over union members; resolve to different types based on whether T satisfies U',
    answer: `<p><strong>Conditional types</strong> select a type based on a condition, similar to a ternary operator for types.</p>
<pre><code>// Basic syntax: T extends U ? TypeIfTrue : TypeIfFalse
type IsString&lt;T&gt; = T extends string ? 'yes' : 'no';

type A = IsString&lt;string&gt;;  // 'yes'
type B = IsString&lt;number&gt;;  // 'no'</code></pre>
<p><strong>Distribution over union types</strong> — when T is a naked type parameter, conditional types distribute:</p>
<pre><code>type ToArray&lt;T&gt; = T extends unknown ? T[] : never;

type StringOrNumberArray = ToArray&lt;string | number&gt;;
// Distributes: (string extends unknown ? string[] : never) | (number extends unknown ? number[] : never)
// = string[] | number[]

// Prevent distribution with []
type ToArrayNonDist&lt;T&gt; = [T] extends [unknown] ? T[] : never;
type NonDist = ToArrayNonDist&lt;string | number&gt;; // (string | number)[]</code></pre>
<p><strong>infer keyword</strong> — extract a type within a conditional:</p>
<pre><code>// Extract the return type of a function
type ReturnType&lt;T&gt; = T extends (...args: any[]) => infer R ? R : never;

type NumReturn = ReturnType&lt;() => number&gt;; // number
type VoidReturn = ReturnType&lt;() => void&gt;;  // void

// Extract element type from an array
type ElementType&lt;T&gt; = T extends (infer E)[] ? E : never;

type Elem = ElementType&lt;string[]&gt;; // string</code></pre>
<div class="tip">💡 Conditional types power most of TypeScript's built-in utility types. Understanding <code>infer</code> unlocks writing your own ReturnType, Parameters, PromiseType, and similar utilities.</div>`,
  },

  {
    id: 5013, cat: 'Generics', tags: ['adv'],
    q: 'How do generic functions differ from generic types? Show examples of each.',
    hint: 'Generic functions infer T at the call site; generic types require you to pass T explicitly (or let the constructor infer)',
    answer: `<p>Both use type parameters, but they're instantiated at different points and in different ways.</p>
<p><strong>Generic functions</strong> — T is inferred from the argument types at each call:</p>
<pre><code>// Arrow function generic
const wrap = &lt;T&gt;(value: T): { value: T } => ({ value });

const wrapped = wrap(42);        // T inferred as number
const wrapped2 = wrap('hello'); // T inferred as string

// Multiple type params
function zip&lt;A, B&gt;(a: A[], b: B[]): [A, B][] {
  return a.map((item, i) => [item, b[i]]);
}

const pairs = zip([1, 2], ['a', 'b']); // [number, string][]</code></pre>
<p><strong>Generic types/interfaces</strong> — T must be provided when using the type:</p>
<pre><code>type Box&lt;T&gt; = { value: T; label: string };

const numBox: Box&lt;number&gt; = { value: 42, label: 'count' };
// Must specify — TS can't infer from usage alone

// Generic class — T provided at instantiation or inferred from constructor
class Queue&lt;T&gt; {
  private items: T[] = [];
  enqueue(item: T): void { this.items.push(item); }
  dequeue(): T | undefined { return this.items.shift(); }
}

const q = new Queue&lt;string&gt;();   // explicit
const q2 = new Queue();           // T inferred as unknown without explicit arg
q.enqueue('hello');
q2.enqueue(42); // T inferred as number from first enqueue</code></pre>
<div class="tip">💡 Generic function inference is powerful because callers rarely need to write <code>&lt;T&gt;</code> explicitly — TypeScript figures it out. Only specify the type parameter when inference fails or you want to constrain the result type.</div>`,
  },

  {
    id: 5014, cat: 'Generics', tags: ['adv'],
    q: 'What is the Partial, Required, and Readonly pattern when building generic utility functions?',
    hint: 'Combine utility types in function signatures to produce modified shapes — common in config and builder patterns',
    answer: `<p>Generic utility functions compose TypeScript's built-in modifiers to create flexible, type-safe APIs.</p>
<pre><code>// Deep partial — makes all nested properties optional
type DeepPartial&lt;T&gt; = T extends object
  ? { [K in keyof T]?: DeepPartial&lt;T[K]&gt; }
  : T;

function mergeDefaults&lt;T extends object&gt;(
  defaults: T,
  overrides: DeepPartial&lt;T&gt;
): T {
  return { ...defaults, ...overrides } as T;
}

const config = mergeDefaults(
  { host: 'localhost', port: 3000, ssl: false },
  { port: 8080 } // only override port — others keep defaults
);</code></pre>
<pre><code>// Update function — require at least one field
type AtLeastOne&lt;T&gt; = { [K in keyof T]-?: Pick&lt;T, K&gt; & Partial&lt;T&gt; }[keyof T];

function update&lt;T extends object&gt;(id: number, patch: Partial&lt;T&gt;): void {
  // ...apply patch
}

// Freeze function — returns readonly version
function freeze&lt;T extends object&gt;(obj: T): Readonly&lt;T&gt; {
  return Object.freeze(obj);
}

const settings = freeze({ theme: 'dark', lang: 'en' });
settings.theme = 'light'; // ❌ Error — readonly</code></pre>
<div class="tip">💡 The pattern <code>Partial&lt;T&gt;</code> for update functions and <code>Required&lt;T&gt;</code> for build/create functions is idiomatic TypeScript. It prevents passing full objects when you only need to patch a few fields.</div>`,
  },

  {
    id: 5015, cat: 'Generics', tags: ['mid'],
    q: 'How do you constrain generic functions to work only with specific shapes using interfaces?',
    hint: 'Extend from an interface or inline shape — ensures the generic value has the properties you need',
    answer: `<p>Combining generics with interface constraints lets you write functions that accept any compatible type while retaining full type information.</p>
<pre><code>// Constraint via interface
interface HasId {
  id: number | string;
}

function findById&lt;T extends HasId&gt;(items: T[], id: T['id']): T | undefined {
  return items.find(item => item.id === id);
}

// Works with any object that has an id field
const user = findById(users, 1);     // T = User
const post = findById(posts, 'abc'); // T = Post
// Return type is User | undefined and Post | undefined respectively</code></pre>
<pre><code>// Multiple interface constraints (intersection)
interface Serializable { serialize(): string }
interface Comparable&lt;T&gt; { compareTo(other: T): number }

function sortAndSerialize&lt;T extends Serializable & Comparable&lt;T&gt;&gt;(items: T[]): string[] {
  return items
    .sort((a, b) => a.compareTo(b))
    .map(item => item.serialize());
}

// Constraint + keyof for safe property access
function pluck&lt;T, K extends keyof T&gt;(items: T[], key: K): T[K][] {
  return items.map(item => item[key]);
}

const names = pluck(users, 'name'); // string[]
const ids = pluck(users, 'id');     // number[]</code></pre>
<div class="tip">💡 <code>T extends HasId</code> is more flexible than accepting <code>HasId[]</code> directly — it preserves the full type of the items, so the return type is <code>T | undefined</code> not just <code>HasId | undefined</code>.</div>`,
  },

  // ─── UTILITY TYPES (7) ────────────────────────────────────────────────────

  {
    id: 5016, cat: 'Utility Types', tags: ['core'],
    q: 'What are Partial, Required, and Readonly utility types?',
    hint: 'Partial makes all fields optional; Required makes all mandatory; Readonly prevents mutation',
    answer: `<p>These three utility types transform the optionality and mutability of all properties in a type.</p>
<p><strong>Partial&lt;T&gt;</strong> — makes every property optional (<code>?</code>):</p>
<pre><code>interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial&lt;User&gt;;
// { id?: number; name?: string; email?: string }

// Common use: update/patch functions
function updateUser(id: number, changes: Partial&lt;User&gt;): User {
  return { ...findUser(id), ...changes };
}</code></pre>
<p><strong>Required&lt;T&gt;</strong> — makes every property required (removes <code>?</code>):</p>
<pre><code>interface Config {
  host?: string;
  port?: number;
  timeout?: number;
}

type FinalizedConfig = Required&lt;Config&gt;;
// { host: string; port: number; timeout: number }

// After merging defaults — all fields are now guaranteed
function buildConfig(opts: Config): Required&lt;Config&gt; {
  return { host: 'localhost', port: 3000, timeout: 5000, ...opts };
}</code></pre>
<p><strong>Readonly&lt;T&gt;</strong> — makes every property readonly:</p>
<pre><code>const config: Readonly&lt;Config&gt; = { host: 'localhost', port: 3000 };
config.host = 'other'; // ❌ Error — readonly

// Deep readonly (not built-in, must define)
type DeepReadonly&lt;T&gt; = { readonly [K in keyof T]: DeepReadonly&lt;T[K]&gt; };</code></pre>
<div class="tip">💡 <code>Readonly</code> is only a compile-time protection — <code>Object.freeze()</code> is needed for runtime. Also note: <code>ReadonlyArray&lt;T&gt;</code> is the equivalent for arrays.</div>`,
  },

  {
    id: 5017, cat: 'Utility Types', tags: ['core'],
    q: 'What are Pick and Omit utility types and when should you use them?',
    hint: 'Pick selects a subset of keys; Omit excludes specific keys — both create derived types from existing ones',
    answer: `<p><strong>Pick&lt;T, K&gt;</strong> — creates a type with only the specified keys from T:</p>
<pre><code>interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Only expose safe fields to the client
type PublicUser = Pick&lt;User, 'id' | 'name' | 'email'&gt;;
// { id: number; name: string; email: string }

// Safe to serialize and send over the wire
function getUserPublic(id: number): PublicUser {
  const user = findUser(id);
  return { id: user.id, name: user.name, email: user.email };
}</code></pre>
<p><strong>Omit&lt;T, K&gt;</strong> — creates a type with the specified keys removed:</p>
<pre><code>// Remove sensitive fields
type SafeUser = Omit&lt;User, 'password'&gt;;

// Remove auto-managed fields for create inputs
type CreateUserInput = Omit&lt;User, 'id' | 'createdAt'&gt;;
// { name: string; email: string; password: string }

function createUser(input: CreateUserInput): User {
  return { ...input, id: generateId(), createdAt: new Date() };
}</code></pre>
<p><strong>Pick vs Omit — when to choose:</strong></p>
<ul>
<li>Use <strong>Pick</strong> when you want a small subset from a large type — clearly states which fields you want</li>
<li>Use <strong>Omit</strong> when you want most fields minus a few — less fragile when new fields are added (they're included automatically)</li>
</ul>
<div class="tip">💡 Prefer <code>Omit</code> when the excluded set is small and stable. If you add a field to User, <code>Omit&lt;User, 'password'&gt;</code> automatically includes it, while <code>Pick&lt;User, 'id' | 'name'&gt;</code> would not.</div>`,
  },

  {
    id: 5018, cat: 'Utility Types', tags: ['mid'],
    q: 'What is the Record utility type and when is it useful?',
    hint: 'Record<K, V> creates an object type with keys K and values V — great for lookup maps and indexed objects',
    answer: `<p><strong>Record&lt;K, V&gt;</strong> constructs an object type with keys of type K and values of type V.</p>
<pre><code>// Simple lookup map
type CountryCode = 'US' | 'UK' | 'DE';
const currencies: Record&lt;CountryCode, string&gt; = {
  US: 'USD',
  UK: 'GBP',
  DE: 'EUR',
}; // TypeScript ensures all keys are present

// Dynamic key type
type IdMap&lt;T&gt; = Record&lt;string, T&gt;;
const userMap: IdMap&lt;User&gt; = {};
userMap['abc123'] = { id: 1, name: 'Alice' };</code></pre>
<p><strong>Record vs index signature:</strong></p>
<pre><code>// Index signature — key type can be broad
interface Dict {
  [key: string]: string;
}

// Record — key type can be a union literal (exhaustive)
type StatusMap = Record&lt;'active' | 'inactive' | 'pending', number&gt;;
// TypeScript enforces all three keys must be present

const counts: StatusMap = {
  active: 12,
  inactive: 3,
  pending: 1,
  // missing 'pending' would be an error
};</code></pre>
<p><strong>Common patterns:</strong></p>
<pre><code>// Route config map
type Route = '/home' | '/about' | '/users';
const routeTitles: Record&lt;Route, string&gt; = {
  '/home': 'Home',
  '/about': 'About Us',
  '/users': 'Users',
};

// Grouping array items
function groupBy&lt;T, K extends string&gt;(
  items: T[],
  getKey: (item: T) => K
): Partial&lt;Record&lt;K, T[]&gt;&gt; {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {} as Partial&lt;Record&lt;K, T[]&gt;&gt;);
}</code></pre>
<div class="tip">💡 Use <code>Record&lt;'a' | 'b', T&gt;</code> instead of a plain object type when you want TypeScript to enforce that all union members are handled — like an exhaustive switch but for object keys.</div>`,
  },

  {
    id: 5019, cat: 'Utility Types', tags: ['mid'],
    q: 'What are ReturnType, Parameters, and InstanceType utility types?',
    hint: 'Infer the output type of a function, the input tuple, or the instance type of a class constructor',
    answer: `<p>These utility types extract type information from function and class signatures.</p>
<p><strong>ReturnType&lt;T&gt;</strong> — extracts the return type of a function type:</p>
<pre><code>function fetchUser(id: number): Promise&lt;User&gt; { /* ... */ }

type FetchResult = ReturnType&lt;typeof fetchUser&gt;; // Promise&lt;User&gt;
type User2 = Awaited&lt;ReturnType&lt;typeof fetchUser&gt;&gt;; // User (unwrapped)

// Useful when the return type is complex and you don't want to duplicate it
const config = { theme: 'dark', lang: 'en', debug: false };
type Config = ReturnType&lt;typeof createConfig&gt;; // mirrors the function output</code></pre>
<p><strong>Parameters&lt;T&gt;</strong> — extracts the parameter types as a tuple:</p>
<pre><code>function createUser(name: string, age: number, admin?: boolean): User { /* ... */ }

type CreateUserParams = Parameters&lt;typeof createUser&gt;;
// [name: string, age: number, admin?: boolean]

// Useful for wrapping or forwarding function calls
function withLogging&lt;T extends (...args: any[]) => any&gt;(
  fn: T,
  ...args: Parameters&lt;T&gt;
): ReturnType&lt;T&gt; {
  console.log('Calling with', args);
  return fn(...args);
}</code></pre>
<p><strong>InstanceType&lt;T&gt;</strong> — extracts the instance type from a constructor:</p>
<pre><code>class Connection {
  host: string;
  connect(): void { /* ... */ }
}

type ConnectionInstance = InstanceType&lt;typeof Connection&gt;; // Connection

// Useful in factory patterns where you work with constructors
function create&lt;T extends new (...args: any[]) => any&gt;(
  Ctor: T, ...args: ConstructorParameters&lt;T&gt;
): InstanceType&lt;T&gt; {
  return new Ctor(...args);
}</code></pre>
<div class="tip">💡 These three types work with <code>typeof</code> to extract shapes from existing values — no need to manually define return types or parameter interfaces for functions you already have.</div>`,
  },

  {
    id: 5020, cat: 'Utility Types', tags: ['mid'],
    q: 'What are Exclude and Extract utility types?',
    hint: 'Exclude removes members from a union; Extract keeps only the matching members',
    answer: `<p>Both work on union types to filter members based on a condition.</p>
<p><strong>Exclude&lt;T, U&gt;</strong> — removes from T all types assignable to U:</p>
<pre><code>type T = string | number | boolean | null | undefined;

type NonNullable&lt;T&gt; = Exclude&lt;T, null | undefined&gt;;
type Primitives = Exclude&lt;T, null | undefined&gt;;
// string | number | boolean

type StringOrNumber = Exclude&lt;string | number | boolean, boolean&gt;;
// string | number</code></pre>
<p><strong>Extract&lt;T, U&gt;</strong> — keeps from T only types assignable to U (opposite of Exclude):</p>
<pre><code>type Strings = Extract&lt;string | number | boolean, string | boolean&gt;;
// string | boolean

// Practical use: filter union to only the callable types
type FnOnly = Extract&lt;string | number | (() => void), Function&gt;;
// () => void</code></pre>
<p><strong>Combined with discriminated unions:</strong></p>
<pre><code>type Action =
  | { type: 'ADD'; payload: string }
  | { type: 'REMOVE'; id: number }
  | { type: 'CLEAR' };

// Extract only actions with a payload
type ActionWithPayload = Extract&lt;Action, { payload: any }&gt;;
// { type: 'ADD'; payload: string }

// Exclude the CLEAR action
type MutatingActions = Exclude&lt;Action, { type: 'CLEAR' }&gt;;
// { type: 'ADD'; payload: string } | { type: 'REMOVE'; id: number }</code></pre>
<div class="tip">💡 <code>NonNullable&lt;T&gt;</code> is just <code>Exclude&lt;T, null | undefined&gt;</code> built into TypeScript. Understanding Exclude lets you build your own specialized filters.</div>`,
  },

  {
    id: 5021, cat: 'Utility Types', tags: ['adv'],
    q: 'What are Awaited and NonNullable utility types?',
    hint: 'Awaited recursively unwraps Promise<T>; NonNullable removes null and undefined from a type',
    answer: `<p><strong>Awaited&lt;T&gt;</strong> — recursively unwraps the resolved type of a Promise (or thenable). Added in TypeScript 4.5.</p>
<pre><code>type A = Awaited&lt;Promise&lt;string&gt;&gt;;
// string

type B = Awaited&lt;Promise&lt;Promise&lt;number&gt;&gt;&gt;;
// number (recursively unwrapped)

// Common pattern: get the type a fetch function resolves to
async function getUser(): Promise&lt;User&gt; { /* ... */ }

type ResolvedUser = Awaited&lt;ReturnType&lt;typeof getUser&gt;&gt;;
// User (not Promise&lt;User&gt;)

// Useful for typing the result of Promise.all
type MultiResult = Awaited&lt;Promise&lt;[User, Post[]]&gt;&gt;;
// [User, Post[]]</code></pre>
<p><strong>NonNullable&lt;T&gt;</strong> — removes <code>null</code> and <code>undefined</code> from a type:</p>
<pre><code>type MaybeUser = User | null | undefined;

type DefiniteUser = NonNullable&lt;MaybeUser&gt;; // User

// Useful after null checks in generics
function assertDefined&lt;T&gt;(val: T): NonNullable&lt;T&gt; {
  if (val === null || val === undefined) {
    throw new Error('Value is null or undefined');
  }
  return val as NonNullable&lt;T&gt;;
}

// Filter nulls from an array
function compact&lt;T&gt;(arr: (T | null | undefined)[]): NonNullable&lt;T&gt;[] {
  return arr.filter((x): x is NonNullable&lt;T&gt; => x != null);
}</code></pre>
<div class="tip">💡 Before TypeScript 4.5, getting the resolved type of a Promise required manual conditional types. <code>Awaited</code> makes async code types much cleaner, especially with <code>Promise.all</code> and async utility functions.</div>`,
  },

  {
    id: 5022, cat: 'Utility Types', tags: ['adv'],
    q: 'What is the Mapped Type pattern in utility types — how are Partial, Readonly, and Record implemented?',
    hint: 'for...in at the type level — iterate over keyof T and transform each property',
    answer: `<p>Mapped types iterate over the keys of a type and apply a transformation to each property. They power all the modifier utility types.</p>
<pre><code>// Partial implementation — adds ? to every property
type MyPartial&lt;T&gt; = {
  [K in keyof T]?: T[K];
  // for each key K in T, make it optional
};

// Required implementation — removes ? from every property
type MyRequired&lt;T&gt; = {
  [K in keyof T]-?: T[K];
  // -? removes optionality
};

// Readonly implementation — adds readonly to every property
type MyReadonly&lt;T&gt; = {
  readonly [K in keyof T]: T[K];
};

// Mutable (remove readonly)
type Mutable&lt;T&gt; = {
  -readonly [K in keyof T]: T[K];
};

// Record implementation
type MyRecord&lt;K extends string | number | symbol, V&gt; = {
  [P in K]: V;
};</code></pre>
<p><strong>Remapping keys with as:</strong></p>
<pre><code>// Add getter prefix to all keys
type Getters&lt;T&gt; = {
  [K in keyof T as \`get\${Capitalize&lt;string & K&gt;}\`]: () => T[K];
};

type UserGetters = Getters&lt;{ name: string; age: number }&gt;;
// { getName: () => string; getAge: () => number }

// Filter keys by type
type OnlyStrings&lt;T&gt; = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};</code></pre>
<div class="tip">💡 The modifiers <code>+?</code> (add optional), <code>-?</code> (remove optional), <code>+readonly</code>, <code>-readonly</code> give you surgical control. <code>-?</code> is what Required uses to make every field mandatory.</div>`,
  },

  // ─── CLASSES & OOP (5) ───────────────────────────────────────────────────

  {
    id: 5023, cat: 'Classes & OOP', tags: ['core'],
    q: 'What are access modifiers in TypeScript — public, private, protected, readonly?',
    hint: 'public = accessible everywhere; private = class only; protected = class + subclasses; readonly = no reassignment after init',
    answer: `<p>TypeScript adds access modifiers to class members to enforce encapsulation (compile-time only — no runtime enforcement).</p>
<pre><code>class BankAccount {
  readonly id: string;          // set once in constructor, never changed
  public owner: string;         // accessible everywhere (default)
  protected balance: number;    // accessible in this class and subclasses
  private #internalRef: string; // true private (JS private field — runtime enforced)

  private log(msg: string) {    // TS private — compile-time only
    console.log(msg);
  }

  constructor(owner: string) {
    this.id = crypto.randomUUID();
    this.owner = owner;
    this.balance = 0;
    this.#internalRef = 'ref';
  }

  deposit(amount: number) {
    this.balance += amount;  // ✅ accessible from own class
    this.log('deposited');   // ✅ private method ok inside class
  }
}

class SavingsAccount extends BankAccount {
  interestRate = 0.05;

  addInterest() {
    this.balance *= (1 + this.interestRate); // ✅ protected accessible in subclass
  }
}

const acct = new BankAccount('Alice');
acct.owner;       // ✅ public
acct.balance;     // ❌ protected — only inside class hierarchy
acct.log('');     // ❌ private</code></pre>
<p><strong>Constructor shorthand</strong> — declare and initialize in one line:</p>
<pre><code>class Point {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}
  // Equivalent to: this.x = x; this.y = y; declared as readonly public
}</code></pre>
<div class="tip">💡 TypeScript's <code>private</code> is erased at runtime. Use JavaScript's native <code>#privateField</code> syntax for true runtime privacy. <code>readonly</code> can be bypassed at runtime but is a strong signal to consumers.</div>`,
  },

  {
    id: 5024, cat: 'Classes & OOP', tags: ['mid'],
    q: 'What are abstract classes in TypeScript and when should you use them?',
    hint: 'Cannot be instantiated directly — defines a contract for subclasses; can have concrete methods unlike interfaces',
    answer: `<p><strong>Abstract classes</strong> sit between interfaces (pure contracts) and concrete classes (fully implemented). They can have abstract methods (must be implemented by subclasses) and concrete methods (shared implementation).</p>
<pre><code>abstract class Animal {
  abstract sound(): string;     // must be implemented by subclass
  abstract name: string;        // abstract property

  // Concrete method — shared by all subclasses
  describe(): string {
    return \`I am a \${this.name} and I say \${this.sound()}\`;
  }
}

// new Animal() — ❌ Error: cannot instantiate abstract class

class Dog extends Animal {
  name = 'Dog'; // ✅ implements abstract property

  sound(): string {  // ✅ implements abstract method
    return 'woof';
  }
}

class Cat extends Animal {
  name = 'Cat';
  sound() { return 'meow'; }
}

const dog = new Dog();
console.log(dog.describe()); // "I am a Dog and I say woof"</code></pre>
<p><strong>Abstract class vs interface:</strong></p>
<ul>
<li><strong>Interface</strong> — pure contract, no implementation, multiple implementable</li>
<li><strong>Abstract class</strong> — partial implementation, single inheritance, can have constructors and state</li>
</ul>
<pre><code>// Abstract class with shared constructor logic
abstract class BaseRepository&lt;T&gt; {
  constructor(protected tableName: string) {}

  abstract findById(id: number): Promise&lt;T | null&gt;;
  abstract save(entity: T): Promise&lt;T&gt;;

  // Shared utility
  protected buildQuery(where: Partial&lt;T&gt;): string {
    // generic SQL builder
    return \`SELECT * FROM \${this.tableName}\`;
  }
}</code></pre>
<div class="tip">💡 Use abstract classes when related classes share implementation logic. Use interfaces when you just want a shape contract. A class can implement multiple interfaces but only extend one abstract class.</div>`,
  },

  {
    id: 5025, cat: 'Classes & OOP', tags: ['mid'],
    q: 'What is the difference between implements and extends in TypeScript?',
    hint: 'extends = inherit implementation (IS-A); implements = satisfy a contract (CAN-DO); class can implement multiple interfaces',
    answer: `<p><strong>extends</strong> — inherits from a parent class or interface. Gets all properties, methods, and constructor logic.</p>
<p><strong>implements</strong> — declares that a class satisfies an interface contract, but does NOT inherit implementation.</p>
<pre><code>// Interface contract
interface Serializable {
  serialize(): string;
}

interface Loggable {
  log(): void;
}

// extends — inherits implementation
class Animal {
  constructor(public name: string) {}
  breathe() { return 'breathing'; }
}

class Dog extends Animal {
  // Inherits name, breathe() from Animal
  bark() { return 'woof'; }
}

// implements — satisfy contract without inheriting
class User implements Serializable, Loggable {
  constructor(public name: string, public email: string) {}

  // MUST implement all interface methods
  serialize() { return JSON.stringify({ name: this.name, email: this.email }); }
  log() { console.log(this.name); }
}

// Combining both
class AdminUser extends User implements Comparable&lt;AdminUser&gt; {
  constructor(name: string, email: string, public adminLevel: number) {
    super(name, email); // must call parent constructor
  }

  compareTo(other: AdminUser): number {
    return this.adminLevel - other.adminLevel;
  }
}</code></pre>
<p><strong>Interface implements itself (structural check):</strong></p>
<pre><code>// A class can implement an interface to get compile-time checking
// that it fulfills the contract — even without runtime cost
class Repository implements IRepository&lt;User&gt; {
  // TypeScript errors if any method is missing
}</code></pre>
<div class="tip">💡 TypeScript is structurally typed — you don't NEED to write <code>implements</code> if the class already has the right shape. But writing it explicitly documents intent and gives clearer error messages when the contract isn't met.</div>`,
  },

  {
    id: 5026, cat: 'Classes & OOP', tags: ['mid'],
    q: 'How do decorators work in TypeScript, and what are they used for?',
    hint: 'Decorators are factory functions applied to classes, methods, or properties — common for metadata, dependency injection, logging',
    answer: `<p><strong>Decorators</strong> are functions that wrap or modify classes, methods, properties, or parameters. Enabled with <code>experimentalDecorators: true</code> in tsconfig.</p>
<pre><code>// Class decorator — modify or augment a class
function Singleton&lt;T extends new(...args: any[]) => any&gt;(Ctor: T) {
  let instance: InstanceType&lt;T&gt;;
  return class extends Ctor {
    constructor(...args: any[]) {
      if (instance) return instance;
      super(...args);
      instance = this as any;
    }
  };
}

@Singleton
class Config { /* only one instance ever created */ }

// Method decorator — wrap a method with extra behavior
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(\`Calling \${key} with\`, args);
    const result = original.apply(this, args);
    console.log(\`\${key} returned\`, result);
    return result;
  };
  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

// Property decorator — metadata annotation
function required(target: any, propertyKey: string) {
  // metadata stored here — used by validation frameworks
}

class User {
  @required
  name: string = '';
}</code></pre>
<div class="tip">💡 Decorators are widely used in Angular, NestJS, TypeORM, and class-validator. TypeScript 5.0 introduced the new decorator standard (TC39 Stage 3) that differs from the legacy experimental decorators.</div>`,
  },

  {
    id: 5027, cat: 'Classes & OOP', tags: ['adv'],
    q: 'What are static members and class fields in TypeScript?',
    hint: 'static members belong to the class itself, not instances; class fields vs constructor assignments have subtle initialization order differences',
    answer: `<p><strong>Static members</strong> belong to the class itself, not to any instance. Accessed via the class name.</p>
<pre><code>class Counter {
  static count = 0;  // shared across all instances
  id: number;

  constructor() {
    Counter.count++; // increment class-level counter
    this.id = Counter.count;
  }

  static reset() {
    Counter.count = 0;
  }

  static getInstance() {
    return new Counter();
  }
}

const a = new Counter(); // Counter.count = 1
const b = new Counter(); // Counter.count = 2
console.log(Counter.count); // 2

Counter.reset();
console.log(Counter.count); // 0</code></pre>
<p><strong>Class fields vs constructor assignment:</strong></p>
<pre><code>class Example {
  // Class field — initialized BEFORE constructor body
  x = 10;
  y = this.x * 2; // ✅ x is already 10

  // Method defined as field — each instance gets its own copy
  handleClick = () => {
    console.log(this.x); // 'this' is always correct — no binding needed
  };

  constructor() {
    // Class fields are set BEFORE this runs
    console.log(this.x); // 10
  }
}

// vs prototype method — shared across all instances
class ExampleProto {
  handleClick() {
    // 'this' depends on how it's called — may need .bind()
    console.log(this);
  }
}</code></pre>
<div class="tip">💡 Arrow function class fields (like <code>handleClick = () =&gt; {}</code>) solve the React event handler binding issue — no need for <code>.bind(this)</code> in the constructor. The trade-off is each instance gets its own function copy rather than sharing a prototype method.</div>`,
  },

  // ─── ADVANCED TYPES (3) ───────────────────────────────────────────────────

  {
    id: 5028, cat: 'Advanced Types', tags: ['adv'],
    q: 'What are mapped types and how do you use them beyond the built-in utility types?',
    hint: '[K in keyof T] iterates over type keys — combine with as to remap keys, conditional types to filter, modifiers to change optionality',
    answer: `<p>Mapped types transform existing types by iterating over their keys and applying transformations to each property.</p>
<pre><code>// Basic structure
type Mapped&lt;T&gt; = {
  [K in keyof T]: TransformedType;
};

// Value transformation — wrap each value in a Box
type Boxed&lt;T&gt; = {
  [K in keyof T]: { value: T[K] };
};

type BoxedUser = Boxed&lt;User&gt;;
// { id: { value: number }; name: { value: string }; ... }</code></pre>
<p><strong>Key remapping with as:</strong></p>
<pre><code>// Add prefix to all keys
type Prefixed&lt;T, P extends string&gt; = {
  [K in keyof T as \`\${P}_\${string & K}\`]: T[K];
};

type PrefixedUser = Prefixed&lt;User, 'user'&gt;;
// { user_id: number; user_name: string; ... }

// Convert to setters
type Setters&lt;T&gt; = {
  [K in keyof T as \`set\${Capitalize&lt;string & K&gt;}\`]: (value: T[K]) => void;
};</code></pre>
<p><strong>Filtering keys with conditional + never:</strong></p>
<pre><code>// Keep only method keys
type MethodKeys&lt;T&gt; = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

// Keep only string-valued properties
type StringProps&lt;T&gt; = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

// Flatten optional — convert T | undefined to T
type NonOptional&lt;T&gt; = {
  [K in keyof T]-?: Exclude&lt;T[K], undefined&gt;;
};</code></pre>
<div class="tip">💡 The pattern <code>[K in keyof T as CondType extends never ? never : K]</code> is how TypeScript's built-in Omit and conditional key removal work. Mastering key remapping with <code>as</code> unlocks very powerful type transformations.</div>`,
  },

  {
    id: 5029, cat: 'Advanced Types', tags: ['adv'],
    q: 'What are conditional types and how do you use infer for type extraction?',
    hint: 'T extends U ? X : Y — use infer inside extends to capture and name a type for use in X or Y',
    answer: `<p><strong>Conditional types</strong> are TypeScript's equivalent of if-else for types. Combined with <code>infer</code>, they let you extract type information from complex types.</p>
<pre><code>// Unwrap a Promise
type Awaited&lt;T&gt; = T extends Promise&lt;infer U&gt; ? Awaited&lt;U&gt; : T;
// If T is a Promise, extract what it resolves to and recurse
// Otherwise return T as-is

// Extract the element type of an array
type ArrayElement&lt;T&gt; = T extends (infer E)[] ? E : never;
type Elem = ArrayElement&lt;string[]&gt;; // string

// Extract return type
type ReturnType&lt;T&gt; = T extends (...args: any[]) => infer R ? R : never;

// Extract the first parameter
type FirstParam&lt;T&gt; = T extends (first: infer F, ...rest: any[]) => any
  ? F
  : never;

type FP = FirstParam&lt;(a: string, b: number) => void&gt;; // string</code></pre>
<p><strong>Multiple infer in one conditional:</strong></p>
<pre><code>// Extract both key and value types from a Map
type MapTypes&lt;T&gt; = T extends Map&lt;infer K, infer V&gt;
  ? { key: K; value: V }
  : never;

type UserMap = MapTypes&lt;Map&lt;string, User&gt;&gt;;
// { key: string; value: User }

// Flatten one level of nesting
type Flatten&lt;T&gt; = T extends Array&lt;infer E&gt;
  ? E extends Array&lt;infer Inner&gt; ? Inner : E
  : T;

type Flat = Flatten&lt;number[][]&gt;; // number[]</code></pre>
<div class="tip">💡 <code>infer</code> only works inside <code>extends</code> clauses of conditional types. Think of it as "if this type matches this pattern, capture the matched part as a new type variable".</div>`,
  },

  {
    id: 5030, cat: 'Advanced Types', tags: ['adv'],
    q: 'What are template literal types in TypeScript?',
    hint: 'Type-level string interpolation — `${"Type"}` creates new string literal types from existing ones',
    answer: `<p><strong>Template literal types</strong> extend string literal types using template literal syntax to create new string types programmatically.</p>
<pre><code>// Basic template literal type
type Greeting = \`Hello, \${string}!\`;
// Matches any string like "Hello, World!" "Hello, Alice!" etc.

type EventName = 'click' | 'focus' | 'blur';
type HandlerName = \`on\${Capitalize&lt;EventName&gt;}\`;
// 'onClick' | 'onFocus' | 'onBlur'

// Distribution — template distributes over union members
type CSSProperty = 'margin' | 'padding';
type CSSDirectional = \`\${CSSProperty}-\${'top' | 'right' | 'bottom' | 'left'}\`;
// 'margin-top' | 'margin-right' | ... | 'padding-left' (8 combinations)</code></pre>
<p><strong>Practical patterns:</strong></p>
<pre><code>// Event emitter type-safe API
type EventMap = { 'user:login': User; 'user:logout': void; 'data:update': Data };

type EventEmitter = {
  on&lt;K extends keyof EventMap&gt;(event: K, handler: (data: EventMap[K]) => void): void;
  emit&lt;K extends keyof EventMap&gt;(...args: EventMap[K] extends void ? [K] : [K, EventMap[K]]): void;
};

// Building getter/setter pairs
type Accessors&lt;T&gt; = {
  [K in keyof T as \`get\${Capitalize&lt;string & K&gt;}\`]: () => T[K];
} & {
  [K in keyof T as \`set\${Capitalize&lt;string & K&gt;}\`]: (val: T[K]) => void;
};

// Route param extraction
type RouteParams&lt;T extends string&gt; =
  T extends \`\${infer _Start}:\${infer Param}/\${infer Rest}\`
    ? Param | RouteParams&lt;\`/\${Rest}\`&gt;
    : T extends \`\${infer _Start}:\${infer Param}\`
    ? Param
    : never;

type Params = RouteParams&lt;'/users/:id/posts/:postId'&gt;;
// 'id' | 'postId'</code></pre>
<div class="tip">💡 Template literal types + mapped types + infer can parse and transform string types at compile time. This powers popular libraries like tRPC and Prisma to provide end-to-end type safety from strings.</div>`,
  },

];
