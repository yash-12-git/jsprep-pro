// ─── TypeScript Topics Static Data ───────────────────────────────────────────
// Full "Concept Hub" content for each topic:
//   mentalModel     — 2–3 sentence analogy (plain text, italic box)
//   deepDive        — Full HTML explanation (h3, p, pre>code, ul, blockquote)
//   misconceptions  — Array: "Many devs think X — actually Y"
//   realWorldExamples — Array: where this appears in real production code
//   cheatSheet      — Quick-reference bullets
//   interviewTips   — Numbered tips for the interview room
// ─────────────────────────────────────────────────────────────────────────────

export interface TypescriptTopic {
  slug: string;
  title: string;
  category: string;
  keyword: string;
  description: string;
  extraKeywords?: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Senior";
  questionCount: string;
  track: "typescript";
  status: "published";
  order: number;
  mentalModel: string;
  deepDive: string;
  misconceptions: string[];
  realWorldExamples: string[];
  cheatSheet: string[];
  interviewTips: string[];
  related: string[];
  relatedBlogSlugs: string[];
}

export const TYPESCRIPT_TOPICS: TypescriptTopic[] = [

  // ─── 1. Types vs Interfaces ───────────────────────────────────────────────

  {
    slug: "typescript-types-vs-interfaces-interview-questions",
    title: "TypeScript Types vs Interfaces — Complete Interview Guide",
    category: "Core Types",
    keyword: "Types vs Interfaces",
    description:
      "Master the real differences between type aliases and interfaces in TypeScript — when to use each, how declaration merging works, which extends which, and how to answer every interviewer question on this perennial topic with confidence.",
    extraKeywords: [
      "typescript type vs interface",
      "interface vs type alias typescript",
      "typescript declaration merging",
      "typescript extends vs intersection",
      "when to use type vs interface",
      "typescript type alias",
      "typescript interface extend",
      "typescript structural typing",
    ],
    difficulty: "Intermediate",
    questionCount: "8–12",
    track: "typescript",
    status: "published",
    order: 1,

    mentalModel:
      "Think of an interface as a named contract posted on a wall — any team member (object or class) can sign it, and you can add new clauses to it later (declaration merging). A type alias is more like a sticky note with a formula written on it — it can describe anything (unions, primitives, tuples, computed shapes), but once you stick it somewhere, you cannot add more to it. Both describe shapes; the difference is in flexibility, extensibility, and where each one shines.",

    deepDive: `
<h3>The Core Distinction in One Sentence</h3>
<p><strong>Interfaces</strong> describe the shape of objects and classes and support declaration merging. <strong>Type aliases</strong> can describe any type — primitives, unions, tuples, mapped types, conditional types — and cannot be merged. For plain object shapes both work equally well; the differences matter at the edges.</p>

<h3>Syntax Comparison</h3>
<pre><code>// Interface — keyword-based, feels like a contract
interface User {
  id: number;
  name: string;
  email?: string; // optional property
}

// Type alias — assignment-based, more like a named formula
type User = {
  id: number;
  name: string;
  email?: string;
};

// Both produce identical structural types — TypeScript treats them the same
// when checking compatibility between objects and these definitions.</code></pre>

<h3>What Only type Can Do</h3>
<p>Type aliases can represent things interfaces simply cannot:</p>
<pre><code>// Union types — impossible with interface
type Status = "active" | "inactive" | "pending";
type ID = string | number;

// Primitive aliases
type Milliseconds = number;
type UserName = string;

// Tuple types
type Coordinate = [number, number];
type NamedEntry = [string, ...number[]];

// Mapped types
type Readonly&lt;T&gt; = { readonly [K in keyof T]: T[K] };

// Conditional types
type NonNullable&lt;T&gt; = T extends null | undefined ? never : T;

// Function type shorthand
type Handler = (event: Event) =&gt; void;
// (interfaces can describe call signatures too, but the syntax is clunkier)</code></pre>

<h3>What Only interface Can Do — Declaration Merging</h3>
<p>You can declare the same interface name multiple times and TypeScript merges all declarations into one shape. This is declaration merging and it is the feature that enables library augmentation:</p>
<pre><code>// First declaration — in your library's types
interface Window {
  myAnalytics: Analytics;
}

// Second declaration — in a consumer's augmentation file
interface Window {
  myFeatureFlag: boolean;
}

// TypeScript merges them — Window now has BOTH properties
// This is how libraries like @types/jest add methods to global Jest types

// Same trick works for extending third-party types:
declare module "express-session" {
  interface SessionData {
    userId: string;
    cart: CartItem[];
  }
}</code></pre>
<blockquote>Declaration merging is the primary reason to choose <code>interface</code> over <code>type</code> when writing library code or global augmentations. A type alias with the same name twice is a compile error.</blockquote>

<h3>Extending and Composing</h3>
<p>Interfaces use <code>extends</code>. Type aliases use intersection (<code>&amp;</code>). Both create a wider shape, but they behave differently when properties conflict:</p>
<pre><code>// Interface extends — compile error on conflict
interface Animal {
  name: string;
}
interface Dog extends Animal {
  name: number; // Error: property 'name' in 'Dog' incompatible with 'Animal'
}

// Type intersection — silently produces 'never' on conflict
type Animal = { name: string };
type Dog = Animal &amp; { name: number };
// Dog['name'] is string &amp; number = never — no compile error here!
// This is a subtle and dangerous difference

// Interfaces extending type aliases — fully supported
type HasId = { id: number };
interface Product extends HasId {
  title: string;
  price: number;
}

// Type aliases intersecting interfaces — also fully supported
interface Named { name: string; }
type Employee = Named &amp; { employeeId: string };</code></pre>

<h3>Class Implementation</h3>
<p>Classes can <code>implement</code> both interfaces and type aliases that describe object shapes — but not unions or primitives:</p>
<pre><code>interface Serializable {
  serialize(): string;
}

type Loggable = {
  log(): void;
};

class UserService implements Serializable, Loggable {
  serialize() { return JSON.stringify(this); }
  log() { console.log(this.serialize()); }
}

// This does NOT work — cannot implement a union
type StringOrNumber = string | number;
class Broken implements StringOrNumber {} // Error</code></pre>

<h3>Performance in Large Codebases</h3>
<p>The TypeScript compiler can cache and reuse interface types more efficiently than complex type aliases in large projects. For simple object shapes the difference is negligible, but extremely complex intersection and conditional types can slow down type-checking in large monorepos. This is a secondary concern — choose the right abstraction first.</p>
    `.trim(),

    misconceptions: [
      "Many developers think interfaces and type aliases are completely interchangeable for object shapes — they are nearly identical for simple objects, but diverge on declaration merging (interfaces only), union types (type aliases only), and conflict handling in extends vs intersection (interfaces error; intersections silently produce never).",
      "Many developers think 'type is more modern so prefer it always' — the TypeScript team itself recommends interfaces for object shapes in library code because declaration merging enables consumers to augment library types without forking them.",
      "Many developers think you cannot extend a type alias with an interface — you can. interface Product extends HasId works even when HasId is a type alias. The extends keyword works across both constructs.",
      "Many developers think type intersection (&) always errors on conflicting properties like interface extends does — it does not. Conflicting property types are silently narrowed to never, which produces type-safe but often baffling 'this value is never assignable' errors downstream.",
      "Many developers think interfaces can describe union types — they cannot. type Result = Success | Failure is valid; interface Result = Success | Failure is a syntax error.",
      "Many developers think declaration merging only applies to global types — it applies to any interface, including module-level ones. This is how session augmentation, express Request extensions, and Jest global matchers are typed.",
    ],

    realWorldExamples: [
      "Module augmentation in Express: teams extend the Request interface to add custom properties like req.user or req.session.cart. Because interfaces merge, you can add to the third-party definition without touching the library source.",
      "API response shapes: most REST client code uses type aliases for discriminated unions like type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string } — this union pattern is impossible with an interface.",
      "Design system component props: libraries like Radix UI and Chakra define component props as interfaces so consumers can use module augmentation or interface extension to add custom variants without forking the library.",
      "Domain model types: id, price, and currency types are commonly aliased as type UserId = string or type Price = number to document intent and prevent mixing up unrelated string or number values across a codebase.",
      "Global type extensions: @types/jest adds expect, describe, and it to the global scope by merging into NodeJS.Global — only possible because interfaces support declaration merging.",
    ],

    cheatSheet: [
      "interface: use for object shapes, class contracts, and library code that consumers need to augment",
      "type: use for unions, intersections, tuples, primitives, mapped types, and conditional types",
      "Declaration merging: only interfaces — declaring the same interface name twice merges both declarations",
      "extends (interface) vs & (type): extends errors on conflicting properties; & silently produces never",
      "Classes can implement both interfaces and object-shape type aliases, but not union types",
      "Both are erased at runtime — zero difference in compiled JavaScript output",
      "interface extends type alias: fully supported — the extends keyword crosses both constructs",
      "TypeScript team guidance: prefer interface for objects unless you need a feature only type provides",
      "For function types: type Handler = (e: Event) => void is cleaner than a call-signature interface",
    ],

    interviewTips: [
      "Open with the practical rule interviewers love: 'For plain object shapes, either works — I reach for interface when writing library code because declaration merging lets consumers augment types, and type when I need unions, tuples, or computed types that interfaces cannot express.'",
      "Know the declaration merging example cold — it's the single most important difference. Walk through the Express Request augmentation: 'You declare interface Request in your own file, TypeScript merges it with the library's Request, and suddenly req.user is typed everywhere without modifying node_modules.'",
      "The conflict behaviour difference is a senior-level signal: 'interface extends errors immediately on conflicting property types. Type intersection silently narrows conflicting properties to never — which compiles fine but produces mysterious downstream errors. This is a real footgun in large codebases.'",
      "When asked which to prefer, give a concrete rule and avoid 'it depends' without follow-through: 'I default to interface for objects and type for everything else. This aligns with the TypeScript handbook and plays nicely with external library augmentation.'",
      "Point out that both are erased at runtime — 'there is zero difference in the compiled JavaScript. This is a purely compile-time tool for developer experience and tooling.'",
    ],

    related: [
      "typescript-generics-interview-questions",
      "typescript-utility-types-interview-questions",
      "typescript-union-intersection-types-interview-questions",
      "typescript-mapped-types-interview-questions",
    ],

    relatedBlogSlugs: [
      "typescript-types-vs-interfaces",
      "top-50-typescript-interview-questions",
    ],
  },

  // ─── 2. Generics ──────────────────────────────────────────────────────────

  {
    slug: "typescript-generics-interview-questions",
    title: "TypeScript Generics — Complete Interview Guide",
    category: "Core Types",
    keyword: "Generics",
    description:
      "Deep-dive into TypeScript generics — type parameters, constraints, default types, generic functions, interfaces, and classes. Understand how generics enable type-safe reusability and how to answer every interviewer question from basic syntax to advanced inference.",
    extraKeywords: [
      "typescript generics explained",
      "typescript generic function",
      "typescript generic interface",
      "typescript generic constraints",
      "typescript keyof generics",
      "typescript infer keyword",
      "typescript generic default type",
      "reusable typescript types",
    ],
    difficulty: "Intermediate",
    questionCount: "8–12",
    track: "typescript",
    status: "published",
    order: 2,

    mentalModel:
      "Generics are type-level parameters — the same concept as function parameters, but for types instead of values. Just as a function like Math.max(a, b) works on any numbers you pass in, a generic like Array<T> works on any element type you supply. The angle-bracket T is a placeholder that gets filled in by the caller, letting you write one implementation that stays type-safe for every concrete type it's used with. Without generics, you'd need to write a separate ArrayOfStrings, ArrayOfNumbers, ArrayOfUsers — generics collapse that explosion into a single, flexible, fully-typed declaration.",

    deepDive: `
<h3>Why Generics Exist</h3>
<p>Consider a simple identity function. Without generics you must choose between losing type information (using <code>any</code>) or duplicating code (one function per type):</p>
<pre><code>// Bad: any destroys type safety
function identity(arg: any): any {
  return arg;
}
const result = identity("hello"); // result is 'any', not 'string'

// Bad: duplication
function identityString(arg: string): string { return arg; }
function identityNumber(arg: number): number { return arg; }

// Good: one generic function, full type safety
function identity&lt;T&gt;(arg: T): T {
  return arg;
}
const s = identity("hello"); // s is 'string'
const n = identity(42);      // n is 'number'
const u = identity({ id: 1 }); // u is '{ id: number }'</code></pre>

<h3>Generic Constraints with extends</h3>
<p>Unconstrained generics give you no information about what T supports. Constraints narrow what types are acceptable and unlock properties on T:</p>
<pre><code>// Without constraint — cannot access .length, T could be anything
function logLength&lt;T&gt;(arg: T): T {
  console.log(arg.length); // Error: Property 'length' does not exist on type 'T'
  return arg;
}

// With constraint — T must have a length property
function logLength&lt;T extends { length: number }&gt;(arg: T): T {
  console.log(arg.length); // OK
  return arg;
}

logLength("hello");       // OK — strings have length
logLength([1, 2, 3]);     // OK — arrays have length
logLength({ length: 10 }); // OK — object with length property
logLength(42);            // Error — numbers have no length</code></pre>

<h3>The keyof Constraint Pattern</h3>
<p>One of the most useful generic patterns: ensuring a key argument actually exists on the object type:</p>
<pre><code>// K must be a key of T — prevents typos and missing-property bugs at compile time
function getProperty&lt;T, K extends keyof T&gt;(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Alice", email: "alice@example.com" };

const name = getProperty(user, "name");  // type is string
const id   = getProperty(user, "id");    // type is number
getProperty(user, "phone"); // Error: Argument of type '"phone"' is not assignable
                            // to parameter of type '"id" | "name" | "email"'</code></pre>

<h3>Generic Interfaces and Types</h3>
<pre><code>// Generic interface — describes a typed API response
interface ApiResponse&lt;T&gt; {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

// Usage — T is filled in at the call site
type UserResponse  = ApiResponse&lt;User&gt;;
type ProductsResponse = ApiResponse&lt;Product[]&gt;;

// Generic type alias — a reusable Result type (Rust-style)
type Result&lt;T, E = Error&gt; =
  | { ok: true;  value: T }
  | { ok: false; error: E };

// Narrowing works naturally with discriminated unions
function handleResult(r: Result&lt;User&gt;) {
  if (r.ok) {
    console.log(r.value.name); // r.value is User
  } else {
    console.error(r.error.message); // r.error is Error
  }
}</code></pre>

<h3>Generic Classes</h3>
<pre><code>class Stack&lt;T&gt; {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}

const numStack = new Stack&lt;number&gt;();
numStack.push(1);
numStack.push(2);
numStack.push("three"); // Error — string not assignable to number

const strStack = new Stack&lt;string&gt;();
strStack.push("hello"); // OK</code></pre>

<h3>Default Type Parameters</h3>
<p>TypeScript 2.3+ supports default types for generics, making them optional at the call site:</p>
<pre><code>// E defaults to Error if not supplied
type Result&lt;T, E = Error&gt; = { ok: true; value: T } | { ok: false; error: E };

// Both are valid
type StringResult = Result&lt;string&gt;;        // E = Error
type CustomResult = Result&lt;string, string&gt;; // E = string

// Generic with default in function
function createPair&lt;A, B = A&gt;(first: A, second?: B): [A, B | undefined] {
  return [first, second];
}</code></pre>

<h3>Multiple Type Parameters and Inference</h3>
<pre><code>// TypeScript infers T and U from the arguments — no need to annotate at call site
function zip&lt;T, U&gt;(a: T[], b: U[]): [T, U][] {
  return a.map((item, i) =&gt; [item, b[i]]);
}

const pairs = zip([1, 2, 3], ["a", "b", "c"]);
// pairs is inferred as [number, string][] — no annotation needed

// Curried generic for partial application
const makeTransform = &lt;T&gt;() =&gt; &lt;U&gt;(fn: (input: T) =&gt; U) =&gt; fn;
const stringTransform = makeTransform&lt;string&gt;();
const toNumber = stringTransform(s =&gt; parseInt(s, 10)); // (s: string) =&gt; number</code></pre>
    `.trim(),

    misconceptions: [
      "Many developers think generics are just 'TypeScript's version of any' — the opposite is true. any discards type information entirely. Generics preserve and thread type information through a function or structure so the caller retains full type safety.",
      "Many developers think you must always annotate the type parameter when calling a generic function — TypeScript's type inference usually figures out T from the argument. identity('hello') infers T = string automatically; you only need explicit annotation when inference fails.",
      "Many developers think generic constraints (T extends Something) mean T IS Something — T is constrained to be assignable to Something, not exactly Something. T extends { length: number } means T must have at least a length property; it can have many other properties too.",
      "Many developers think generic classes lock a type at class definition time — the type is locked per instance. new Stack<number>() creates a stack of numbers; new Stack<string>() creates a separate stack of strings. Both come from the same class definition.",
      "Many developers think you need a separate overload for every return type — generics collapse many overloads into one type-safe signature. Instead of three overloads for string, number, and boolean, one generic captures all three.",
      "Many developers avoid generics because they look complex — the most useful patterns (identity, keyof constraint, ApiResponse<T>) are short, predictable, and covered in TypeScript's standard library (Array<T>, Promise<T>, Record<K, V>).",
    ],

    realWorldExamples: [
      "API client wrappers: production codebases define fetchJson<T>(url: string): Promise<T> so every endpoint call is fully typed without casting — the response shape is encoded in the call site, not inside the utility.",
      "React useState hook: useState<User | null>(null) is generics in action — the state is typed as User | null even though useState itself is a generic function in React's type definitions.",
      "Repository pattern: data access layers define Repository<T> with methods like findById(id: string): Promise<T | null> — one class services every entity type while preserving type safety.",
      "Form libraries: React Hook Form and Formik use generics extensively — useForm<LoginFormValues>() types every field, error, and submission handler automatically from a single type argument.",
      "Utility functions: a deeply typed pick(obj, keys) function uses generics and keyof constraints to return only the selected properties with their correct types — impossible to express safely without generics.",
      "Event emitters: typed EventEmitter<{ click: MouseEvent; keydown: KeyboardEvent }> uses generics to ensure on('click', handler) always infers handler's argument as MouseEvent, not the generic Event.",
    ],

    cheatSheet: [
      "Basic syntax: function fn<T>(arg: T): T — T is a type parameter filled in by the caller",
      "Constraint: <T extends SomeType> — T must be assignable to SomeType",
      "keyof constraint: <T, K extends keyof T> — K must be an actual key of T",
      "Generic interface: interface Box<T> { value: T } — fill in T at usage: Box<string>",
      "Default type param: type Result<T, E = Error> — E is optional, defaults to Error",
      "TypeScript usually infers T from arguments — explicit annotation only needed when inference fails",
      "Generic classes: new Stack<number>() — type is locked per instance, not per class",
      "Multiple type params: <T, U> — each parameter inferred independently",
      "Generics are erased at runtime — they exist only in the TypeScript compiler",
    ],

    interviewTips: [
      "Lead with the problem generics solve: 'Without generics, I'd choose between any (unsafe) or duplicating my function for every type. Generics let me write the function once and preserve type safety for every caller.'",
      "Walk through the identity function example — it's the canonical teaching example and demonstrates type inference: 'I don't have to write identity<string>(\"hello\") — TypeScript infers T = string from the argument.'",
      "Know the keyof pattern by heart — it's one of the most common generic patterns in real codebases. 'K extends keyof T ensures the key argument actually exists on the object at compile time, preventing entire categories of runtime errors.'",
      "Distinguish generics from any clearly: 'any tells TypeScript to stop caring about the type. A generic T says: I don't know what this type is yet, but track it for me and make sure it's consistent throughout this function call.'",
      "Mention real-world examples from standard lib: 'Promise<T>, Array<T>, Map<K, V> — every JavaScript developer uses generics daily through the standard library. Writing your own is just applying the same pattern.'",
    ],

    related: [
      "typescript-types-vs-interfaces-interview-questions",
      "typescript-utility-types-interview-questions",
      "typescript-mapped-types-interview-questions",
      "typescript-conditional-types-interview-questions",
    ],

    relatedBlogSlugs: [
      "typescript-generics-complete-guide",
      "top-50-typescript-interview-questions",
    ],
  },

  // ─── 3. Utility Types ─────────────────────────────────────────────────────

  {
    slug: "typescript-utility-types-interview-questions",
    title: "TypeScript Utility Types — Complete Interview Guide",
    category: "Built-in Types",
    keyword: "Utility Types",
    description:
      "Master TypeScript's built-in utility types — Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, NonNullable, ReturnType, and more. Learn what each does, when to use it, and how to implement them yourself using mapped and conditional types.",
    extraKeywords: [
      "typescript utility types",
      "typescript Partial Required Readonly",
      "typescript Pick Omit",
      "typescript Record type",
      "typescript ReturnType",
      "typescript Exclude Extract",
      "typescript built-in types",
      "typescript mapped types built-in",
    ],
    difficulty: "Intermediate",
    questionCount: "6–10",
    track: "typescript",
    status: "published",
    order: 3,

    mentalModel:
      "TypeScript's utility types are a standard library for type transformations — the same idea as lodash for runtime values, but for types at compile time. Just as lodash.pick(obj, keys) extracts a subset of an object's properties at runtime, Pick<User, 'id' | 'name'> extracts a subset of User's type definition at compile time. Each utility type is a generic that takes one or more types and produces a transformed type — and every one of them is implemented using the same mapped and conditional type primitives you can write yourself.",

    deepDive: `
<h3>The Partial Family — Modifying Optionality</h3>
<pre><code>// Partial&lt;T&gt; — makes every property optional
interface User { id: number; name: string; email: string; }
type PartialUser = Partial&lt;User&gt;;
// { id?: number; name?: string; email?: string; }

// Essential for update/patch functions:
function updateUser(id: number, changes: Partial&lt;User&gt;): User { /* ... */ }
updateUser(1, { name: "Bob" }); // Only name — perfectly valid

// Required&lt;T&gt; — makes every property required (removes ?)
interface Config { host?: string; port?: number; debug?: boolean; }
type StrictConfig = Required&lt;Config&gt;;
// { host: string; port: number; debug: boolean; }

// Readonly&lt;T&gt; — makes every property readonly
const config: Readonly&lt;Config&gt; = { host: "localhost", port: 3000 };
config.host = "example.com"; // Error: Cannot assign to 'host' — readonly</code></pre>

<h3>Pick and Omit — Selecting Properties</h3>
<pre><code>interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  internalCode: string; // sensitive — don't expose to client
}

// Pick — include only listed keys
type ProductSummary = Pick&lt;Product, "id" | "title" | "price"&gt;;
// { id: number; title: string; price: number; }

// Omit — exclude listed keys (dual of Pick)
type PublicProduct = Omit&lt;Product, "internalCode"&gt;;
// { id: number; title: string; description: string; price: number; }

// Prefer Omit when you want to exclude a few sensitive fields from a large type
// Prefer Pick when you want to select a small subset from a large type</code></pre>

<h3>Record — Typed Dictionaries</h3>
<pre><code>// Record&lt;K, V&gt; — a type with keys K and values V
type UserMap = Record&lt;string, User&gt;;
// { [key: string]: User }

// More precise — limit the keys to a union
type Permission = "read" | "write" | "delete";
type RolePermissions = Record&lt;Permission, boolean&gt;;
// { read: boolean; write: boolean; delete: boolean; }
// TypeScript will error if you miss a key — exhaustive check

const adminPerms: RolePermissions = { read: true, write: true, delete: true };
const guestPerms: RolePermissions = { read: true, write: false }; // Error: missing 'delete'</code></pre>

<h3>Exclude and Extract — Filtering Union Members</h3>
<pre><code>type AllStatus = "active" | "inactive" | "deleted" | "banned";

// Exclude removes matching members from a union
type VisibleStatus = Exclude&lt;AllStatus, "deleted" | "banned"&gt;;
// "active" | "inactive"

// Extract keeps only matching members
type ProblematicStatus = Extract&lt;AllStatus, "deleted" | "banned"&gt;;
// "deleted" | "banned"

// NonNullable removes null and undefined
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable&lt;MaybeString&gt;;
// string

// Practical use: filtering a union to only object types
type OnlyFunctions = Extract&lt;string | number | (() =&gt; void), Function&gt;;
// () =&gt; void</code></pre>

<h3>ReturnType, Parameters, and InstanceType</h3>
<pre><code>function createUser(name: string, age: number): User { /* ... */ }

// ReturnType — extracts the return type of a function
type CreatedUser = ReturnType&lt;typeof createUser&gt;;
// User

// Parameters — extracts a tuple of the parameter types
type CreateUserArgs = Parameters&lt;typeof createUser&gt;;
// [name: string, age: number]

// InstanceType — extracts the instance type of a constructor
class UserService { getUser(id: number): User { /* ... */ } }
type UserServiceInstance = InstanceType&lt;typeof UserService&gt;;
// UserService

// These are invaluable when you don't control the source types —
// you can derive types from functions/classes you import from libraries</code></pre>

<h3>Implementing Utility Types Yourself</h3>
<p>Every built-in utility type is implemented using mapped or conditional types. Understanding the implementations is a strong interview signal:</p>
<pre><code>// How Partial is implemented in TypeScript's lib.d.ts
type MyPartial&lt;T&gt; = {
  [P in keyof T]?: T[P];
};

// How Required is implemented
type MyRequired&lt;T&gt; = {
  [P in keyof T]-?: T[P]; // -? removes the optional modifier
};

// How Readonly is implemented
type MyReadonly&lt;T&gt; = {
  readonly [P in keyof T]: T[P];
};

// How Pick is implemented
type MyPick&lt;T, K extends keyof T&gt; = {
  [P in K]: T[P];
};

// How Record is implemented
type MyRecord&lt;K extends keyof any, T&gt; = {
  [P in K]: T;
};

// How Exclude is implemented (conditional type distributing over union)
type MyExclude&lt;T, U&gt; = T extends U ? never : T;</code></pre>
    `.trim(),

    misconceptions: [
      "Many developers think Partial<T> makes all nested properties optional recursively — it only makes the top-level properties optional. Nested objects remain fully required. You need a custom DeepPartial type for recursive optionality.",
      "Many developers confuse Omit and Exclude — Omit works on object types and removes properties by key name. Exclude works on union types and removes members by type. They are solving different problems.",
      "Many developers think Record<string, T> and { [key: string]: T } are different types — they produce identical index signatures. Record is preferred for readability and for using union keys, which the index signature syntax cannot express.",
      "Many developers think ReturnType<T> requires the actual function — it requires typeof theFunction. ReturnType<typeof createUser> not ReturnType<createUser>.",
      "Many developers think utility types are magic compiler features — every one is implemented using mapped types and conditional types that you can write yourself. The TypeScript source for all built-in utilities is in lib.es5.d.ts and is well worth reading.",
      "Many developers reach for Partial on function parameters instead of using optional properties — Partial<Options> as a parameter type is correct. But for function return types, Partial can hide missing data that callers expect to be present.",
    ],

    realWorldExamples: [
      "PATCH API endpoints: function patchUser(id: string, data: Partial<User>) is the idiomatic pattern for update operations where only changed fields are sent — Partial makes all fields optional without creating a separate PartialUser interface.",
      "Config objects with defaults: Required<AppConfig> as the internal type after merging with defaults ensures every optional config option has been resolved before it reaches internal code — a clean way to enforce completeness after a merge step.",
      "Permission maps: Record<Permission, boolean> for role-based access control ensures every permission key is explicitly set when creating a role object, giving exhaustive compile-time checking that a plain object literal would not provide.",
      "Deriving types from imported libraries: ReturnType<typeof libraryFunction> and Parameters<typeof libraryFunction> are essential when a library doesn't export its types directly — you can derive what you need from the function signatures themselves.",
      "React component prop subsets: Pick<ButtonProps, 'onClick' | 'disabled' | 'children'> creates a minimal prop interface for a wrapper component without manually duplicating individual props — stays in sync automatically when ButtonProps changes.",
      "Form state types: Partial<FormValues> for draft state that is progressively filled in, transitioning to FormValues (fully required) only on submit — models the two states with type-level precision.",
    ],

    cheatSheet: [
      "Partial<T> — all properties optional (top-level only, not recursive)",
      "Required<T> — all properties required (removes ?)",
      "Readonly<T> — all properties readonly",
      "Pick<T, K> — keep only keys K from T",
      "Omit<T, K> — remove keys K from T (dual of Pick)",
      "Record<K, V> — object type with keys K and values V; K can be a union for exhaustive keys",
      "Exclude<T, U> — remove union members assignable to U from union T",
      "Extract<T, U> — keep only union members assignable to U from union T",
      "NonNullable<T> — remove null and undefined from T",
      "ReturnType<typeof fn> — extract the return type of a function",
      "Parameters<typeof fn> — extract parameter types as a tuple",
      "All utility types are implemented with mapped/conditional types — you can write your own",
    ],

    interviewTips: [
      "Group utility types by what they operate on: 'Partial, Required, Readonly, Pick, Omit operate on object types. Record creates typed dictionaries. Exclude, Extract, NonNullable operate on union types. ReturnType, Parameters extract information from function types.'",
      "Know the implementations — being able to write MyPartial<T> = { [P in keyof T]?: T[P] } shows you understand the underlying mechanics, not just the names. It's a strong signal at senior level.",
      "The Omit vs Exclude distinction trips many candidates: 'Omit removes properties from an object type by key name. Exclude removes members from a union type. Different problems, different tools.'",
      "Give a practical use case for each one you mention — abstract definitions without concrete examples are weak. 'Partial for PATCH endpoints. Record<Permission, boolean> for exhaustive role maps. ReturnType when a library doesn't export its types.'",
    ],

    related: [
      "typescript-types-vs-interfaces-interview-questions",
      "typescript-generics-interview-questions",
      "typescript-mapped-types-interview-questions",
      "typescript-conditional-types-interview-questions",
    ],

    relatedBlogSlugs: [
      "typescript-utility-types-cheatsheet",
      "top-50-typescript-interview-questions",
    ],
  },

  // ─── 4. Type Guards & Narrowing ───────────────────────────────────────────

  {
    slug: "typescript-type-guards-narrowing-interview-questions",
    title: "TypeScript Type Guards & Narrowing — Complete Interview Guide",
    category: "Core Types",
    keyword: "Type Guards",
    description:
      "Understand TypeScript's type narrowing system — typeof, instanceof, in operator, discriminated unions, custom type predicates, and the never type for exhaustive checks. Learn to write safe code that TypeScript can reason about statically.",
    extraKeywords: [
      "typescript type guards",
      "typescript narrowing",
      "typescript typeof instanceof",
      "typescript discriminated union",
      "typescript type predicate",
      "typescript is keyword",
      "typescript never exhaustive check",
      "typescript in operator type guard",
    ],
    difficulty: "Intermediate",
    questionCount: "6–10",
    track: "typescript",
    status: "published",
    order: 4,

    mentalModel:
      "TypeScript's type narrowing is like a detective refining a list of suspects. You start with a wide type (string | number | null) — any of those could be true. Each check you write (if typeof x === 'string') eliminates some suspects, and inside that branch TypeScript narrows its understanding of the type to only what's still possible. By the time you reach a specific branch, TypeScript knows exactly what type is present and unlocks the appropriate properties and methods. The narrowing is purely static — it's TypeScript reading your conditions and updating its type model, with zero runtime cost.",

    deepDive: `
<h3>Built-in Narrowing Constructs</h3>
<p>TypeScript understands several JavaScript constructs and uses them to narrow types automatically:</p>
<pre><code>function formatValue(value: string | number | null | undefined): string {
  // typeof narrowing
  if (typeof value === "string") {
    return value.toUpperCase(); // value: string here
  }

  // Nullish check narrowing
  if (value == null) {
    return "N/A"; // value: null | undefined here
  }

  // At this point, TypeScript knows value must be number
  return value.toFixed(2); // value: number here
}

// instanceof narrowing
function handleError(err: unknown): string {
  if (err instanceof Error) {
    return err.message; // err: Error
  }
  if (err instanceof TypeError) {
    return err.stack ?? "No stack"; // err: TypeError (subtype of Error)
  }
  return String(err);
}</code></pre>

<h3>The in Operator</h3>
<p>The <code>in</code> operator narrows by checking for the presence of a property — particularly useful for discriminating between object shapes:</p>
<pre><code>interface Circle  { kind: "circle";  radius: number; }
interface Square  { kind: "square";  side: number; }
interface Triangle { kind: "triangle"; base: number; height: number; }

type Shape = Circle | Square | Triangle;

// Using 'in' to check for unique properties
function describeShape(shape: Shape): string {
  if ("radius" in shape) {
    return \`Circle with radius \${shape.radius}\`; // shape: Circle
  }
  if ("side" in shape) {
    return \`Square with side \${shape.side}\`; // shape: Square
  }
  return \`Triangle \${shape.base} × \${shape.height}\`; // shape: Triangle
}</code></pre>

<h3>Discriminated Unions — The Gold Standard Pattern</h3>
<p>A discriminated union gives every member a shared literal property (the discriminant). TypeScript then narrows based on that property's value — the most ergonomic and exhaustive narrowing pattern:</p>
<pre><code>type ApiResult&lt;T&gt; =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error";   message: string; code: number };

function renderUser(result: ApiResult&lt;User&gt;) {
  switch (result.status) {
    case "loading":
      return &lt;Spinner /&gt;;
    case "success":
      return &lt;UserCard user={result.data} /&gt;; // result.data: User
    case "error":
      return &lt;Error msg={result.message} /&gt;;  // result.message: string
  }
}</code></pre>

<h3>Custom Type Predicates</h3>
<p>When built-in constructs are not enough, you can teach TypeScript about narrowing by writing a function that returns a <em>type predicate</em> — a return type of the form <code>arg is Type</code>:</p>
<pre><code>// Without a type predicate — TypeScript cannot use the result to narrow
function isString(value: unknown): boolean {
  return typeof value === "string";
}
// After calling isString(x), TypeScript still thinks x is unknown

// With a type predicate — the caller's type is narrowed on true
function isString(value: unknown): value is string {
  return typeof value === "string";
}
const x: unknown = "hello";
if (isString(x)) {
  console.log(x.toUpperCase()); // x is narrowed to string — OK
}

// Real-world example — filtering an array to remove null/undefined
function isDefined&lt;T&gt;(value: T | null | undefined): value is T {
  return value !== null &amp;&amp; value !== undefined;
}
const maybeUsers: (User | null)[] = getUsers();
const users: User[] = maybeUsers.filter(isDefined); // Clean array of User</code></pre>

<h3>The never Type for Exhaustive Checks</h3>
<p>After narrowing all known members of a union, the remaining type should be <code>never</code>. You can exploit this to write exhaustive checks that fail at compile time when a new union member is added without updating the handler:</p>
<pre><code>type Direction = "north" | "south" | "east" | "west";

function move(dir: Direction): string {
  switch (dir) {
    case "north": return "Moving north";
    case "south": return "Moving south";
    case "east":  return "Moving east";
    case "west":  return "Moving west";
    default:
      // If we reach here, dir is 'never' — all cases handled
      const exhaustiveCheck: never = dir;
      throw new Error(\`Unhandled direction: \${exhaustiveCheck}\`);
  }
}

// Now if you add "up" to Direction without updating the switch:
// TypeScript errors: Type '"up"' is not assignable to type 'never'
// This is a compile-time safety net — no tests required</code></pre>

<h3>Assertion Functions</h3>
<p>Assertion functions (TypeScript 3.7+) throw on falsy values and narrow the type afterward — useful for writing asserts that double as type narrowing:</p>
<pre><code>function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== "string") {
    throw new TypeError(\`Expected string, got \${typeof val}\`);
  }
}

const raw: unknown = getConfigValue();
assertIsString(raw);
// After this line, TypeScript treats raw as string
console.log(raw.toUpperCase()); // OK</code></pre>
    `.trim(),

    misconceptions: [
      "Many developers think type guards add runtime overhead — they are ordinary JavaScript (typeof, instanceof, property checks). TypeScript only reads them during compilation to update its type model. The runtime cost is identical to any conditional check you'd write in plain JavaScript.",
      "Many developers think you need type predicates for every custom check — built-in constructs (typeof, instanceof, in, truthiness, equality) narrow automatically. Type predicates are only needed when TypeScript cannot infer the narrowing from your function's return value.",
      "Many developers use as Type casts instead of narrowing — a cast silences the error but doesn't actually verify the type at runtime. A type guard actually checks the type and narrows it. In production code, prefer narrowing over casting.",
      "Many developers think discriminated unions require complex setup — any shared literal property works as the discriminant. The pattern is as simple as adding a kind or type or status string literal to each member.",
      "Many developers think the never exhaustive check is just defensive coding — it's a compile-time guarantee. Add a new union member without updating the switch and TypeScript immediately errors at the default branch. No test is needed to catch the regression.",
      "Many developers think filtering with Array.filter removes null types automatically — filter's return type is still (T | null)[] in TypeScript. You need a type predicate isDefined<T>(x: T | null | undefined): x is T to get TypeScript to infer the filtered array as T[].",
    ],

    realWorldExamples: [
      "API error handling: switch on result.status with a discriminated union (loading | success | error) is the standard pattern in React data fetching — each case narrows to the exact shape with exactly the right properties available.",
      "Filtering arrays of nullable values: isDefined type predicate used with .filter() is ubiquitous in codebases that fetch data from APIs that can return null for missing items — it removes nulls while keeping TypeScript happy.",
      "Redux reducers: every switch case on action.type is a discriminated union — TypeScript narrows action to the specific action type in each case, giving you typed payload without any casting.",
      "Plugin systems: checking for the presence of specific methods using the in operator allows a plugin host to safely call optional plugin capabilities without runtime errors.",
      "Form validation: assertion functions (asserts value is string) are used in validation utilities that throw on invalid input — callers don't need additional if-checks after calling the validator.",
      "Event handling: instanceof narrowing on Event objects (e instanceof MouseEvent, e instanceof KeyboardEvent) unlocks the specific properties (e.clientX, e.key) that TypeScript knows are only available on the narrowed type.",
    ],

    cheatSheet: [
      "typeof: narrows primitives — 'string' | 'number' | 'boolean' | 'object' | 'undefined' | 'function'",
      "instanceof: narrows class instances — (err instanceof Error) narrows to Error",
      "in operator: narrows by property presence — ('radius' in shape) narrows to shapes with radius",
      "Discriminated union: shared literal property (kind, status, type) used in switch/if to narrow the whole union",
      "Type predicate: function isX(v: unknown): v is X — teaches TypeScript how to narrow from function return",
      "Truthiness narrowing: if (value) removes null, undefined, 0, '', NaN, false from the type",
      "Equality narrowing: if (x === 'north') narrows x to 'north' (literal type)",
      "never exhaustive check: in a switch default, assign to never to get a compile error on unhandled union members",
      "Assertion function: asserts val is Type — throws if false, narrows after the call",
      "Array.filter with predicate: .filter(isDefined) returns T[] when isDefined is T | null | undefined: x is T",
    ],

    interviewTips: [
      "Distinguish narrowing from casting immediately: 'Type guards narrow by actually checking the type at runtime and letting TypeScript update its model. Type assertions (as Type) are a compile-time override — they silence errors without adding any check. In production code, narrowing is always safer.'",
      "The discriminated union pattern is the answer to many design questions. When asked how to handle different API response shapes or Redux actions, lead with: 'I model this as a discriminated union with a shared literal discriminant, then switch on it — TypeScript narrows each case automatically and I never need to cast.'",
      "The never exhaustive check is a senior-level technique that always impresses: 'I add a default case that assigns to never. If I later add a union member without updating the switch, TypeScript errors at compile time — it's a zero-cost regression guard.'",
      "Know the isDefined type predicate — it's used in almost every production codebase: 'Array.filter doesn't automatically narrow nullables. I write isDefined<T>(x: T | null | undefined): x is T — now .filter(isDefined) returns T[] and TypeScript is happy.'",
    ],

    related: [
      "typescript-union-intersection-types-interview-questions",
      "typescript-types-vs-interfaces-interview-questions",
      "typescript-generics-interview-questions",
      "typescript-conditional-types-interview-questions",
    ],

    relatedBlogSlugs: [
      "typescript-type-guards-narrowing",
      "top-50-typescript-interview-questions",
    ],
  },

  // ─── 5. Union & Intersection Types ───────────────────────────────────────

  {
    slug: "typescript-union-intersection-types-interview-questions",
    title: "TypeScript Union & Intersection Types — Complete Interview Guide",
    category: "Core Types",
    keyword: "Union & Intersection Types",
    description:
      "Master TypeScript union and intersection types — how | and & work, discriminated unions for safe branching, structural composition with intersections, and the real semantic difference between OR-typed and AND-typed shapes.",
    extraKeywords: [
      "typescript union types",
      "typescript intersection types",
      "typescript pipe operator",
      "typescript discriminated union",
      "typescript type composition",
      "typescript or type",
      "typescript and type",
      "typescript literal union",
    ],
    difficulty: "Intermediate",
    questionCount: "6–10",
    track: "typescript",
    status: "published",
    order: 5,

    mentalModel:
      "A union type (A | B) is a type that holds exactly one of several options at any given moment — like a box that contains either a spanner or a screwdriver, but you don't know which until you look inside. An intersection type (A & B) holds all of the options simultaneously — like a Swiss Army knife that has both a blade AND a screwdriver AND scissors all at once. When you narrow a union, you figure out which one is in the box. When you use an intersection, you expect every tool to be present immediately.",

    deepDive: `
<h3>Union Types — A | B</h3>
<p>A union type means a value can be <em>one of</em> the listed types. TypeScript only allows you to access properties that are common to all members — you must narrow before accessing member-specific properties:</p>
<pre><code>type StringOrNumber = string | number;

function double(value: StringOrNumber): StringOrNumber {
  // Only properties that exist on BOTH string AND number are accessible
  // value.toString() — OK, both have toString()
  // value.toUpperCase() — Error! number has no toUpperCase()
  // value.toFixed() — Error! string has no toFixed()

  if (typeof value === "string") {
    return value.repeat(2); // Narrowed to string — string methods available
  }
  return value * 2; // Narrowed to number — arithmetic available
}

// Literal unions — a very common pattern for enumerating options
type Direction = "north" | "south" | "east" | "west";
type Status = "idle" | "loading" | "success" | "error";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";</code></pre>

<h3>Discriminated Unions — The Most Powerful Pattern</h3>
<p>Add a shared literal property to every union member to create a discriminated union. TypeScript can then narrow the entire shape based on that one property's value:</p>
<pre><code>// Each member has a unique 'type' literal — this is the discriminant
type Action =
  | { type: "INCREMENT"; amount: number }
  | { type: "DECREMENT"; amount: number }
  | { type: "RESET" }
  | { type: "SET_USER"; user: User };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "INCREMENT":
      // action: { type: "INCREMENT"; amount: number }
      return { ...state, count: state.count + action.amount };
    case "RESET":
      // action: { type: "RESET" } — no amount property accessible
      return initialState;
    case "SET_USER":
      // action: { type: "SET_USER"; user: User }
      return { ...state, user: action.user };
    default:
      return state;
  }
}

// Discriminated unions also work with if/else — the discriminant can be any literal
type Shape =
  | { kind: "circle";  radius: number }
  | { kind: "square";  side: number }
  | { kind: "rect";    width: number; height: number };

function area(s: Shape): number {
  if (s.kind === "circle") return Math.PI * s.radius ** 2;
  if (s.kind === "square") return s.side ** 2;
  return s.width * s.height; // TypeScript knows kind === "rect" here
}</code></pre>

<h3>Intersection Types — A & B</h3>
<p>An intersection type means a value must simultaneously satisfy <em>all</em> of the listed types. The result type has all properties from all members:</p>
<pre><code>interface HasId   { id: number; }
interface HasName { name: string; }
interface HasTimestamps { createdAt: Date; updatedAt: Date; }

// An intersection: must have ALL properties from ALL three interfaces
type BaseEntity = HasId &amp; HasName &amp; HasTimestamps;

const user: BaseEntity = {
  id: 1,
  name: "Alice",
  createdAt: new Date(),
  updatedAt: new Date(),
}; // All three groups must be present

// Practical pattern: extending a third-party type without interface merging
import { Request } from "express";
type AuthRequest = Request &amp; { user: User; sessionId: string };

function protectedHandler(req: AuthRequest, res: Response) {
  console.log(req.user.name);    // user is typed — from intersection
  console.log(req.headers.host); // headers is typed — from Request
}</code></pre>

<h3>Property Conflicts in Intersections</h3>
<p>When intersected types have the same property name with incompatible types, the result is <code>never</code> — a silent footgun:</p>
<pre><code>type A = { value: string };
type B = { value: number };
type AB = A &amp; B;
// AB['value'] is string &amp; number = never

const x: AB = { value: ??? }; // Impossible — nothing is both string and number
// TypeScript will not error here at definition time — the error appears when you try
// to assign a value: string is not assignable to never</code></pre>

<h3>Union vs Intersection — The Structural Perspective</h3>
<p>Counterintuitively, union types have <em>fewer</em> members accessible (only the intersection of their property sets) while intersection types have <em>more</em> members accessible (the union of all property sets):</p>
<pre><code>interface Cat { meow(): void; name: string; }
interface Dog { bark(): void; name: string; }

// Union Cat | Dog — only 'name' is accessible without narrowing
// (it's the only property that exists on BOTH Cat AND Dog)
function greet(pet: Cat | Dog) {
  pet.name;   // OK — both have name
  pet.meow(); // Error — Dog has no meow()
  pet.bark(); // Error — Cat has no bark()
}

// Intersection Cat &amp; Dog — ALL properties from both are accessible
function greetSuperPet(pet: Cat &amp; Dog) {
  pet.name;   // OK
  pet.meow(); // OK — must be a Cat
  pet.bark(); // OK — must also be a Dog
}</code></pre>
    `.trim(),

    misconceptions: [
      "Many developers think union types allow access to all member properties — union types only allow access to properties that exist on every member. You must narrow to a specific member to access unique properties.",
      "Many developers think intersection types produce fewer properties than their constituents — the opposite is true. An intersection A & B has all properties from A plus all properties from B. It's wider, not narrower.",
      "Many developers think conflicting properties in intersections cause a compile error at definition time — TypeScript silently produces never for the conflicting property. The error only surfaces when you try to assign a value to that property.",
      "Many developers use discriminated unions only for error handling or state machines — they are equally valuable for any heterogeneous collection: API action types, DOM event variants, form field configurations, and router route descriptors.",
      "Many developers think string literal unions are just documentation — they are enforced at compile time. Passing 'norht' (typo) to a Direction parameter is a compile error, not a runtime surprise.",
      "Many developers think intersections and extends are exactly equivalent — interface extends errors immediately on conflicting properties. Type intersections silently produce never. This difference matters when composing types from external sources.",
    ],

    realWorldExamples: [
      "Redux action types: every Redux codebase models actions as discriminated unions. Each action has a unique type literal, and reducers switch on it — TypeScript narrows to the exact action shape in each case, eliminating all action.payload as Type casts.",
      "React component variants: a Button component might accept type: 'primary' | 'secondary' | 'danger' as a literal union prop — TypeScript enforces valid variants at every call site with no runtime cost.",
      "Express middleware composition: AuthRequest = Request & { user: User } is the standard pattern for typed middleware that adds properties to the request — the intersection combines the library type with your application's custom additions.",
      "API result modeling: ApiResponse<T> = { ok: true; data: T } | { ok: false; error: ApiError } is a discriminated union that forces every consumer to handle both success and failure before accessing the data.",
      "GraphQL fragment composition: tools like GraphQL Code Generator use intersection types to model fragments — a query result type is the intersection of multiple fragment types, ensuring all queried fields are available.",
      "Event handler unions: addEventListener callback types use union literals for the event name to provide fully typed events — 'click' gives MouseEvent, 'keydown' gives KeyboardEvent — powered by overloads and union mapping in TypeScript's DOM lib.",
    ],

    cheatSheet: [
      "Union A | B — value is ONE of the listed types; only shared properties accessible without narrowing",
      "Intersection A & B — value satisfies ALL listed types; all properties from all members are accessible",
      "Literal union: type Status = 'a' | 'b' | 'c' — exhaustive compile-time enumeration of string/number literals",
      "Discriminated union: shared literal property (kind, type, status) enables switch-based narrowing",
      "Union property access: only properties present on ALL members are safe without narrowing",
      "Intersection property conflict: same key with incompatible types → that property becomes never",
      "extends vs &: extends errors on conflicts; & silently produces never",
      "Use union for OR semantics (one of these), intersection for AND semantics (all of these)",
      "Discriminated unions are the TypeScript-native alternative to class hierarchies for polymorphism",
    ],

    interviewTips: [
      "The counterintuitive property access rule is a key differentiator: 'A union of two types has fewer accessible properties — only those common to all members. An intersection has more — everything from all members combined. It feels backwards but follows from type safety.'",
      "Lead discriminated union explanations with the real-world anchor: 'I model API responses, Redux actions, and state machines as discriminated unions. A shared literal property lets TypeScript narrow the entire shape — no casting, no runtime type checks beyond the one switch.'",
      "When asked about union vs intersection for composition, give the semantic test: 'If the value should be ONE of several things, it's a union. If the value must be ALL of several things simultaneously, it's an intersection.'",
      "The never footgun in intersections is a senior signal: 'Conflicting property types in an intersection silently produce never for that property — TypeScript doesn't error at definition time. This is subtle and dangerous when intersecting types from external libraries you don't control.'",
    ],

    related: [
      "typescript-type-guards-narrowing-interview-questions",
      "typescript-types-vs-interfaces-interview-questions",
      "typescript-utility-types-interview-questions",
      "typescript-conditional-types-interview-questions",
    ],

    relatedBlogSlugs: [
      "top-50-typescript-interview-questions",
      "typescript-types-vs-interfaces",
    ],
  },

  // ─── 6. Classes & Access Modifiers ───────────────────────────────────────

  {
    slug: "typescript-classes-access-modifiers-interview-questions",
    title: "TypeScript Classes & Access Modifiers — Complete Interview Guide",
    category: "OOP",
    keyword: "Classes & Access Modifiers",
    description:
      "Deep-dive into TypeScript classes — public, private, protected, readonly, abstract, and the new #private fields. Understand parameter properties, class vs interface, static members, and how TypeScript's structural typing interacts with access modifiers.",
    extraKeywords: [
      "typescript classes",
      "typescript access modifiers",
      "typescript private protected public",
      "typescript abstract class",
      "typescript parameter properties",
      "typescript readonly class",
      "typescript static members",
      "typescript class vs interface",
    ],
    difficulty: "Intermediate",
    questionCount: "6–10",
    track: "typescript",
    status: "published",
    order: 6,

    mentalModel:
      "TypeScript access modifiers are like the different rooms in a building. Public members are the lobby — anyone can walk in from outside. Protected members are the staff corridor — only employees (the class itself and its subclasses) can access them. Private members are the manager's office — only the person in that exact office (the class itself, no subclasses) can enter. TypeScript's private keyword enforces this at compile time; JavaScript's # syntax (hard private) enforces it at runtime as well, making it a true encapsulation boundary even in plain JavaScript.",

    deepDive: `
<h3>Access Modifiers Overview</h3>
<pre><code>class BankAccount {
  public  owner: string;       // Accessible from anywhere (default)
  protected balance: number;   // Accessible in this class and subclasses
  private  pin: string;        // Accessible only in this class
  readonly accountId: string;  // Can be set once (in constructor), then immutable

  constructor(owner: string, pin: string) {
    this.owner = owner;
    this.pin = pin;
    this.balance = 0;
    this.accountId = crypto.randomUUID();
  }

  public getBalance(): number {
    return this.balance; // Can access private/protected inside the class
  }

  private validatePin(input: string): boolean {
    return input === this.pin; // Only this class can call validatePin
  }
}

const account = new BankAccount("Alice", "1234");
account.owner;          // OK — public
account.balance;        // Error — protected
account.pin;            // Error — private
account.accountId;      // OK — readonly, but readable
account.accountId = "x"; // Error — readonly</code></pre>

<h3>Parameter Properties — Shorthand Constructor</h3>
<p>TypeScript's parameter properties declare and initialise class properties directly from constructor parameters — eliminating boilerplate:</p>
<pre><code>// Verbose — the traditional way
class User {
  public name: string;
  private email: string;
  protected role: string;

  constructor(name: string, email: string, role: string) {
    this.name = name;
    this.email = email;
    this.role = role;
  }
}

// Concise — parameter properties (access modifier in constructor signature)
class User {
  constructor(
    public  name: string,
    private email: string,
    protected role: string,
    readonly id: number = Math.random()
  ) {}
  // name, email, role, id are automatically declared AND initialised
}</code></pre>

<h3>TypeScript private vs JavaScript # (Hard Private)</h3>
<p>TypeScript's <code>private</code> is a compile-time-only check — at runtime the property is still publicly accessible on the object. JavaScript's <code>#</code> syntax creates a true runtime private field that cannot be accessed even via reflection:</p>
<pre><code>class TokenService {
  private tsPrivate = "secret";    // TypeScript only — erased at runtime
  #jsPrivate = "also-secret";      // JavaScript private field — runtime enforced

  getTokenTs() { return this.tsPrivate; }
  getTokenJs() { return this.#jsPrivate; }
}

const svc = new TokenService();
(svc as any).tsPrivate; // Works at runtime — TypeScript private is compile-time only!
(svc as any)["#jsPrivate"]; // undefined — hard private, inaccessible even with any
svc.#jsPrivate; // Error at compile time AND runtime</code></pre>
<blockquote>For truly sensitive data (tokens, keys, passwords in memory), prefer <code>#</code> hard private fields. Use TypeScript <code>private</code> for API encapsulation enforced by the type system.</blockquote>

<h3>Abstract Classes</h3>
<p>Abstract classes define a template — they can contain implemented methods AND abstract methods that subclasses must implement. They cannot be instantiated directly:</p>
<pre><code>abstract class Repository&lt;T&gt; {
  // Concrete method — shared implementation available to all subclasses
  async findOrFail(id: string): Promise&lt;T&gt; {
    const entity = await this.findById(id);
    if (!entity) throw new Error(\`Not found: \${id}\`);
    return entity;
  }

  // Abstract methods — subclasses MUST implement these
  abstract findById(id: string): Promise&lt;T | null&gt;;
  abstract save(entity: T): Promise&lt;void&gt;;
  abstract delete(id: string): Promise&lt;void&gt;;
}

class UserRepository extends Repository&lt;User&gt; {
  async findById(id: string): Promise&lt;User | null&gt; {
    return db.users.findOne({ id });
  }
  async save(user: User): Promise&lt;void&gt; {
    await db.users.upsert(user);
  }
  async delete(id: string): Promise&lt;void&gt; {
    await db.users.delete({ id });
  }
}

new Repository(); // Error — cannot instantiate abstract class
new UserRepository(); // OK</code></pre>

<h3>Static Members</h3>
<pre><code>class Config {
  private static instance: Config | null = null;
  private settings: Record&lt;string, string&gt; = {};

  // Singleton pattern — static factory method
  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  // Static utility method — no instance needed
  static fromEnv(): Config {
    const cfg = new Config();
    cfg.settings = { ...process.env } as Record&lt;string, string&gt;;
    return cfg;
  }
}

const cfg = Config.getInstance(); // Access via class, not instance</code></pre>

<h3>TypeScript Structural Typing and Access Modifiers</h3>
<p>TypeScript uses structural typing — two types are compatible if their shapes match. But access modifiers affect structural compatibility in a subtle way:</p>
<pre><code>class A { private secret = 1; public value = 2; }
class B { private secret = 1; public value = 2; }

// Despite looking identical, A and B are NOT structurally compatible
// because their private fields are declared in different classes
const a: A = new B(); // Error — A's private 'secret' is not from B

class C extends A {} // OK — C inherits A's private 'secret'
const c: A = new C(); // OK — C is structurally compatible with A</code></pre>
    `.trim(),

    misconceptions: [
      "Many developers think TypeScript's private keyword prevents runtime access — it only prevents access through the TypeScript type system. At runtime, (obj as any).privateField works fine. Use # for true runtime encapsulation.",
      "Many developers think abstract classes and interfaces are interchangeable — abstract classes can contain implementations; interfaces cannot. Use an interface when you only want to define a contract. Use an abstract class when you want to share implementation between subclasses.",
      "Many developers think private fields from different classes with the same structure are compatible in TypeScript's structural type system — they are not. Private fields break structural compatibility between unrelated classes, even if the shapes look identical.",
      "Many developers think parameter properties are only syntactic sugar with no behavioral difference — they are identical at runtime, but parameter properties must have an access modifier (public, private, protected, or readonly) or TypeScript treats them as plain constructor parameters without property declarations.",
      "Many developers think readonly means immutable deeply — readonly only prevents reassignment of the property itself. If the property holds an array or object, its contents are still mutable. Use Readonly<T> or as const for deeper immutability.",
      "Many developers think static members are shared between subclasses automatically — each class has its own static properties. Subclasses inherit access to parent static methods but have their own static property slots.",
    ],

    realWorldExamples: [
      "Singleton services: Config.getInstance() pattern using static instance property is ubiquitous in backend TypeScript code for database connections, configuration managers, and logging services.",
      "Repository pattern: abstract Repository<T> with abstract CRUD methods is a standard architecture pattern in NestJS, TypeORM, and Prisma-based backends — concrete repositories implement the abstract methods per entity.",
      "Event emitter encapsulation: private listeners map in an EventEmitter class prevents external code from directly manipulating the listener registry, while protected methods let subclasses hook into the emit lifecycle.",
      "React class components (legacy): public render(), private handleClick(), protected shouldRenderSidebar() map directly to the mental model of what API surface should be part of the contract vs internal implementation.",
      "NestJS providers: TypeScript classes with @Injectable(), private readonly dependencies injected via constructor parameter properties, and public methods forming the service API — parameter properties save 30–50% of boilerplate in medium-size services.",
      "Sensitive data holders: # hard private fields for token storage in auth utilities, ensuring that even injected runtime code or serialization libraries cannot accidentally expose the field — TypeScript private would not provide this guarantee.",
    ],

    cheatSheet: [
      "public: accessible everywhere (default if no modifier is written)",
      "private: compile-time only — accessible only within the declaring class",
      "#field: JavaScript hard private — runtime enforced, inaccessible even via any cast",
      "protected: accessible in the declaring class and all subclasses",
      "readonly: can be set in constructor only, then immutable (top-level, not deep)",
      "Parameter properties: add access modifier to constructor param to auto-declare and initialise",
      "abstract class: can have implementations + abstract methods; cannot be instantiated directly",
      "abstract method: must be implemented by every non-abstract subclass",
      "static: belongs to the class itself, not instances; not inherited into subclass slots",
      "Private fields break structural compatibility between unrelated classes in TypeScript's type system",
    ],

    interviewTips: [
      "The TypeScript private vs # distinction is a strong signal: 'TypeScript private is compile-time only — (obj as any).field still works at runtime. JavaScript # creates a true runtime boundary. For genuinely sensitive in-memory data, I prefer # over TypeScript private.'",
      "Use the abstract class vs interface contrast to show design understanding: 'I reach for an interface when I only want a contract — no shared code. I reach for an abstract class when I want to share implementation logic between concrete subclasses, like a base Repository with findOrFail already implemented.'",
      "Parameter properties are a good TypeScript-specific trick to demonstrate: 'TypeScript's parameter properties let you declare and initialise a class member in one place — the constructor signature. This is TypeScript-specific syntax that disappears in the compiled output but saves significant boilerplate in service classes.'",
      "The structural typing + private fields interaction is a senior-level point: 'TypeScript uses structural typing, but private fields break it between unrelated classes. Two classes with the same shape but different private field origins are not assignable to each other — this is intentional to prevent accidental coupling.'",
    ],

    related: [
      "typescript-types-vs-interfaces-interview-questions",
      "typescript-generics-interview-questions",
      "typescript-decorators-interview-questions",
    ],

    relatedBlogSlugs: [
      "top-50-typescript-interview-questions",
      "typescript-with-react-best-practices",
    ],
  },

  // ─── 7. Enums ─────────────────────────────────────────────────────────────

  {
    slug: "typescript-enums-interview-questions",
    title: "TypeScript Enums — Complete Interview Guide",
    category: "Core Types",
    keyword: "Enums",
    description:
      "Understand TypeScript enums thoroughly — numeric, string, and const enums, their runtime representation, when to use them versus union literal types, and the gotchas that trip up even experienced TypeScript developers.",
    extraKeywords: [
      "typescript enums",
      "typescript const enum",
      "typescript string enum",
      "typescript numeric enum",
      "typescript enum vs union",
      "typescript enum runtime",
      "typescript reverse mapping",
      "typescript enum best practices",
    ],
    difficulty: "Beginner",
    questionCount: "4–8",
    track: "typescript",
    status: "published",
    order: 7,

    mentalModel:
      "Think of a TypeScript enum as a named collection of related constants — like a signpost with clearly labelled directions instead of bare strings scattered around your code. Instead of writing 'north', 'south', 'east', 'west' in a dozen places (and hoping you never mistype one), you create Direction.North, Direction.South and the compiler catches any invalid direction. The tradeoff is that enums — unlike union literal types — actually generate JavaScript code at runtime, which adds overhead and interop complexity. Const enums are the exception: they are erased and inlined, like compile-time macros.",

    deepDive: `
<h3>Numeric Enums</h3>
<p>Numeric enums auto-increment from 0 by default. Each member maps to a number, and TypeScript generates a bidirectional mapping object:</p>
<pre><code>enum Direction {
  North,  // 0
  South,  // 1
  East,   // 2
  West,   // 3
}

// Compiled JavaScript (note bidirectional mapping):
// var Direction;
// (function (Direction) {
//   Direction[Direction["North"] = 0] = "North";
//   Direction[Direction["South"] = 1] = "South";
//   Direction[Direction["East"]  = 2] = "East";
//   Direction[Direction["West"]  = 3] = "West";
// })(Direction || (Direction = {}));

Direction.North;     // 0
Direction[0];        // "North" — reverse mapping
Direction["North"];  // 0

// Custom starting values
enum HttpStatus {
  OK          = 200,
  NotFound    = 404,
  ServerError = 500,
}

// Computed members — evaluated at runtime
enum FileAccess {
  None,
  Read    = 1 &lt;&lt; 1,  // 2
  Write   = 1 &lt;&lt; 2,  // 4
  ReadWrite = Read | Write, // 6
}</code></pre>

<h3>String Enums</h3>
<p>String enums have no reverse mapping and produce more readable serialized values — preferred for any value that may appear in logs, API payloads, or URLs:</p>
<pre><code>enum Status {
  Active   = "ACTIVE",
  Inactive = "INACTIVE",
  Pending  = "PENDING",
  Deleted  = "DELETED",
}

// Compiled JavaScript:
// var Status;
// (function (Status) {
//   Status["Active"]   = "ACTIVE";
//   Status["Inactive"] = "INACTIVE";
//   Status["Pending"]  = "PENDING";
//   Status["Deleted"]  = "DELETED";
// })(Status || (Status = {}));

// Usage — the value in API responses is readable
const user = { status: Status.Active }; // { status: "ACTIVE" }
Status.Active === "ACTIVE"; // true
Status["ACTIVE"]; // undefined — no reverse mapping for string enums</code></pre>

<h3>Const Enums — Inlined at Compile Time</h3>
<p>Const enums are erased entirely — every reference is replaced with its literal value during compilation:</p>
<pre><code>const enum Direction {
  North = "NORTH",
  South = "SOUTH",
  East  = "EAST",
  West  = "WEST",
}

// Usage in code:
const dir = Direction.North;

// Compiled JavaScript — no enum object, value is inlined:
// const dir = "NORTH"; // Direct substitution

// Benefits: zero runtime overhead, smaller bundle
// Drawbacks:
//   - Cannot iterate over const enum members at runtime
//   - Breaks when used across module boundaries (isolatedModules: true disallows them)
//   - Incompatible with Babel and esbuild (they don't do full semantic analysis)</code></pre>

<h3>Enums vs Union Literal Types</h3>
<p>The most debated TypeScript topic for beginners. Union literals achieve the same compile-time safety with fewer surprises:</p>
<pre><code>// Enum approach
enum Status { Active = "ACTIVE", Inactive = "INACTIVE" }
function setStatus(status: Status) { /* ... */ }
setStatus(Status.Active);  // OK
setStatus("ACTIVE");       // Error — string literal not assignable to Status!

// Union literal approach
type Status = "ACTIVE" | "INACTIVE";
function setStatus(status: Status) { /* ... */ }
setStatus("ACTIVE");   // OK — plain strings work
setStatus("INVALID");  // Error — not in the union

// The enum version rejects plain strings — even "ACTIVE" is invalid!
// This is intentional for strict enum usage, but surprises many developers
// Union literals interop naturally with JSON, APIs, and external strings

// When to still use enums:
// 1. Numeric bit-flag collections (FileAccess.Read | FileAccess.Write)
// 2. Large sets of related constants that benefit from a namespace
// 3. Legacy codebases where consistency matters more than strict mode
// 4. When reverse mapping (Direction[0] === "North") is genuinely needed</code></pre>

<h3>Ambient Enums — Declaration Only</h3>
<pre><code>// In a .d.ts file or declare block — no code emitted
declare enum ExternalStatus {
  Active = 0,
  Inactive = 1,
}

// Tells TypeScript about an enum defined in another file/library
// without re-creating the runtime object</code></pre>
    `.trim(),

    misconceptions: [
      "Many developers think enums are purely compile-time — numeric and string enums emit a real JavaScript IIFE object that exists at runtime. Const enums are the only kind that are erased. This runtime object adds to bundle size and can cause tree-shaking issues.",
      "Many developers think you can pass a plain string to an enum-typed parameter — you cannot. setStatus('ACTIVE') fails even if 'ACTIVE' matches Status.Active exactly. The enum type and the string literal type are different types. This surprises developers coming from other languages.",
      "Many developers think string enum members support reverse mapping like numeric enums — they do not. Direction['NORTH'] is undefined for a string enum. Only numeric enums have bidirectional mapping.",
      "Many developers think const enums are always safe to use — they are incompatible with isolatedModules (required by Babel, esbuild, and Vite). Using const enum in a project with isolatedModules: true causes a compile error.",
      "Many developers think enum values are safe to iterate over at runtime for numeric enums — the bidirectional mapping means Object.values(Direction) returns both the keys and the numbers: ['North', 'South', 'East', 'West', 0, 1, 2, 3]. Filtering is required.",
      "Many developers reach for enums by default when union literals are simpler and have fewer edge cases — the TypeScript team's official guidance is to prefer union literals for most use cases; enums shine for numeric flags and large named constant sets.",
    ],

    realWorldExamples: [
      "HTTP status codes: enum HttpStatus { OK = 200, NotFound = 404, ServerError = 500 } is more readable than bare numbers and self-documents what the values mean in server response handling code.",
      "Redux action types: older Redux codebases use string enums for action types; modern codebases have largely migrated to union literals or const string variables since they interop better with JSON and debugging tools.",
      "Bitfield permissions: enum Permission { Read = 1, Write = 2, Execute = 4 } combined with bitwise operators is the classic use case where numeric enums genuinely shine — checking hasPermission = (flags & Permission.Read) !== 0.",
      "Database status fields: string enums for user status, order status, and payment status ensure the values in code match the database column values exactly, and TypeScript prevents invalid status strings at every assignment.",
      "NestJS HttpException codes and gRPC status codes: both are typed as numeric enums in their TypeScript definitions, making call sites self-documenting without requiring the developer to memorize magic numbers.",
    ],

    cheatSheet: [
      "Numeric enum: auto-increments from 0; generates bidirectional runtime mapping object",
      "String enum: must assign all values; no reverse mapping; preferred for readable serialized values",
      "const enum: inlined at compile time, no runtime object; incompatible with isolatedModules",
      "Enum types do NOT accept plain string/number literals — must use the enum member (Status.Active, not 'ACTIVE')",
      "Object.values(numericEnum) returns both names and numbers — filter with isNaN() or Number.isFinite()",
      "Union literals vs enums: unions are simpler, interop with plain strings, smaller output — prefer for most cases",
      "Enums best for: numeric bit flags, large named constant namespaces, reverse mapping needs",
      "declare enum: ambient declaration for an enum defined elsewhere — no emitted code",
    ],

    interviewTips: [
      "Lead with the runtime distinction: 'Numeric and string enums emit a real JavaScript object — they exist at runtime and add to bundle size. Const enums are inlined and erased. This affects tree-shaking and interop with bundlers that don't do full semantic analysis.'",
      "The union literals comparison is the most expected follow-up: 'For simple string constants, I usually prefer union literals — they interop with plain strings, are simpler to read, and have zero bundle overhead. I reach for enums when I need numeric bit flags, reverse mapping, or a namespace for a large set of related constants.'",
      "Mention the isolatedModules gotcha if discussing const enums: 'const enum seems ideal, but it breaks with isolatedModules: true, which is required by most modern bundlers (Vite, esbuild, Babel). In practice I avoid const enum unless the project uses tsc exclusively.'",
      "The 'enums don't accept plain strings' behaviour trips up many candidates — mention it proactively: 'One TypeScript-specific gotcha: Status.Active and the string \"ACTIVE\" are different types. You cannot pass a string literal to an enum-typed parameter even if the values match — this surprises developers coming from Java or C#.'",
    ],

    related: [
      "typescript-types-vs-interfaces-interview-questions",
      "typescript-union-intersection-types-interview-questions",
      "typescript-type-guards-narrowing-interview-questions",
    ],

    relatedBlogSlugs: [
      "typescript-enums-explained",
      "top-50-typescript-interview-questions",
    ],
  },

  // ─── 8. Mapped Types ──────────────────────────────────────────────────────

  {
    slug: "typescript-mapped-types-interview-questions",
    title: "TypeScript Mapped Types — Complete Interview Guide",
    category: "Advanced Types",
    keyword: "Mapped Types",
    description:
      "Master TypeScript's mapped types — how they iterate over keys to transform type shapes, modifier addition and removal, key remapping with as, and how every built-in utility type (Partial, Required, Readonly, Pick) is implemented with them.",
    extraKeywords: [
      "typescript mapped types",
      "typescript keyof mapped types",
      "typescript in keyof",
      "typescript -readonly mapped types",
      "typescript -? modifier",
      "typescript as clause mapped types",
      "typescript custom utility types",
      "typescript type transformation",
    ],
    difficulty: "Advanced",
    questionCount: "6–10",
    track: "typescript",
    status: "published",
    order: 8,

    mentalModel:
      "Mapped types are TypeScript's for-loop for type definitions. Just as Array.map() transforms each element of an array into a new element, a mapped type iterates over each key in a type and transforms it into a new property — possibly changing the key name, the value type, or adding/removing modifiers like optional (?) and readonly. The result is a completely new type derived from the original, keeping the two in sync automatically: change the source type and every mapped type built from it updates without any manual edits.",

    deepDive: `
<h3>Basic Mapped Type Syntax</h3>
<pre><code>// The fundamental pattern: [P in keyof T]: SomeType
// P is each key of T in turn, like a for..in loop over type keys

type Stringify&lt;T&gt; = {
  [P in keyof T]: string; // every property becomes a string
};

interface User { id: number; name: string; active: boolean; }
type StringifiedUser = Stringify&lt;User&gt;;
// { id: string; name: string; active: string; }

// Preserve the original value type using T[P] (indexed access)
type Identity&lt;T&gt; = {
  [P in keyof T]: T[P]; // copies the type exactly
};
// Identity&lt;User&gt; === User (structurally)</code></pre>

<h3>Adding and Removing Modifiers</h3>
<p>Mapped types can add or remove the <code>readonly</code> and <code>?</code> (optional) modifiers using <code>+</code> (add) and <code>-</code> (remove) prefixes:</p>
<pre><code>// Adding modifiers — + is implicit (same as no prefix)
type MyReadonly&lt;T&gt; = {
  +readonly [P in keyof T]: T[P]; // add readonly to every property
};
type MyPartial&lt;T&gt; = {
  [P in keyof T]+?: T[P]; // add ? to every property
};

// Removing modifiers — the - prefix
type MyRequired&lt;T&gt; = {
  [P in keyof T]-?: T[P]; // -? removes the optional modifier
};
type MyMutable&lt;T&gt; = {
  -readonly [P in keyof T]: T[P]; // -readonly removes readonly
};

// Combining: make every property required AND mutable
type Concrete&lt;T&gt; = {
  -readonly [P in keyof T]-?: T[P];
};</code></pre>

<h3>Key Remapping with as</h3>
<p>TypeScript 4.1+ allows renaming keys in mapped types using an <code>as</code> clause — enabling prefix addition, case transformation, and key filtering:</p>
<pre><code>// Add a 'get' prefix to every key
type Getters&lt;T&gt; = {
  [P in keyof T as \`get\${Capitalize&lt;string &amp; P&gt;}\`]: () =&gt; T[P];
};

interface User { name: string; email: string; id: number; }
type UserGetters = Getters&lt;User&gt;;
// { getName: () =&gt; string; getEmail: () =&gt; string; getId: () =&gt; number; }

// Filter keys using never — never keys are omitted from the output
type OnlyStrings&lt;T&gt; = {
  [P in keyof T as T[P] extends string ? P : never]: T[P];
};
type UserStringFields = OnlyStrings&lt;User&gt;;
// { name: string; email: string; } — id (number) is filtered out

// Map to event handler keys
type EventHandlers&lt;T&gt; = {
  [P in keyof T as \`on\${Capitalize&lt;string &amp; P&gt;}\`]: (value: T[P]) =&gt; void;
};</code></pre>

<h3>Implementing Built-in Utility Types</h3>
<p>Every built-in utility type is a mapped type. Understanding their implementations is the mark of a senior TypeScript developer:</p>
<pre><code>// Partial — adds ?
type Partial&lt;T&gt; = { [P in keyof T]?: T[P]; };

// Required — removes ?
type Required&lt;T&gt; = { [P in keyof T]-?: T[P]; };

// Readonly — adds readonly
type Readonly&lt;T&gt; = { readonly [P in keyof T]: T[P]; };

// Pick — only iterates over the specified keys K
type Pick&lt;T, K extends keyof T&gt; = { [P in K]: T[P]; };

// Record — K is any union of keys, V is the value type
type Record&lt;K extends keyof any, V&gt; = { [P in K]: V; };

// These are all in TypeScript's own lib.es5.d.ts — reading the source is instructive</code></pre>

<h3>Mapped Types with Conditional Types</h3>
<p>Combining mapped types with conditional types enables powerful type transformations:</p>
<pre><code>// Deep Partial — recursively makes all nested properties optional
type DeepPartial&lt;T&gt; = {
  [P in keyof T]?: T[P] extends object ? DeepPartial&lt;T[P]&gt; : T[P];
};

// Make only specific properties optional
type PartialBy&lt;T, K extends keyof T&gt; = Omit&lt;T, K&gt; &amp; Partial&lt;Pick&lt;T, K&gt;&gt;;

interface User { id: number; name: string; email: string; }
type UserCreate = PartialBy&lt;User, "id"&gt;;
// { id?: number; name: string; email: string; } — id optional, rest required

// Extract function-valued properties
type FunctionProperties&lt;T&gt; = {
  [P in keyof T as T[P] extends Function ? P : never]: T[P];
};

// Flatten a nested type by one level
type Flatten&lt;T&gt; = {
  [P in keyof T]: T[P] extends Array&lt;infer U&gt; ? U : T[P];
};</code></pre>

<h3>Distributive Mapped Types over Unions</h3>
<pre><code>// When T is a union, the mapped type applies to each member separately
type NullableFields&lt;T&gt; = { [P in keyof T]: T[P] | null };

// Works correctly over unions via distributive keyof behaviour
type Config = { host: string; port: number };
type NullableConfig = NullableFields&lt;Config&gt;;
// { host: string | null; port: number | null; }</code></pre>
    `.trim(),

    misconceptions: [
      "Many developers think mapped types are only for making properties optional or readonly — those are just two applications. Mapped types can rename keys, filter keys, transform value types, add methods, create event handler maps, and generate entirely new type shapes from existing ones.",
      "Many developers think you cannot filter out properties in a mapped type — mapping a key to never in an as clause removes it from the output type. This enables conditional key filtering in a single mapped type expression.",
      "Many developers think Partial<T> makes nested objects optional recursively — it only applies to the top level. DeepPartial requires a recursive mapped type with a conditional type to handle nested objects.",
      "Many developers think the -readonly and -? modifier syntax is specific to utility types and not available in user-defined mapped types — these modifiers work in any mapped type you write. They are part of the mapped type syntax, not special-cased for built-ins.",
      "Many developers think key remapping (as clause) is only for adding prefixes — the as clause can produce any template literal string, filter keys to never, remap to a computed union, or even reverse-lookup a key from a value type.",
      "Many developers treat mapped types as read-only reference material — they are a composable building block. Combining Pick, Omit, Partial, and custom mapped types with & intersections covers most real-world type transformation needs without conditional types.",
    ],

    realWorldExamples: [
      "Form validation schemas: mapped types generate a validation schema type from a data model — { [P in keyof FormData]: Validator<FormData[P]> } — keeping the schema and model in sync automatically when fields are added or removed.",
      "API client generation: tools like openapi-typescript use mapped types to transform OpenAPI schemas into TypeScript types with correct optionality, readonly, and nullable flags derived from the schema definition.",
      "ORM column mappers: TypeORM and Prisma generate mapped types for entity relations, partial update inputs, and select objects — all built with variations of Pick, Partial, and custom mapped types over the entity type.",
      "React component prop transformation: Pick<ButtonProps, RequiredKeys> & Partial<Pick<ButtonProps, OptionalKeys>> is a common pattern for wrapper components that re-expose a strict subset of props with adjusted optionality.",
      "Setter/getter generation: framework code that wraps store objects often uses Getters<State> and Setters<State> mapped types to generate typed accessor interfaces from a plain state shape.",
      "Deep readonly for Redux state: Readonly<DeepReadonly<State>> using a recursive mapped type ensures immutability throughout the entire state tree, making accidental mutations compile errors.",
    ],

    cheatSheet: [
      "Basic: { [P in keyof T]: T[P] } — iterate over T's keys, preserve each value type",
      "Transform value: { [P in keyof T]: SomeType<T[P]> } — apply a transformation to each value",
      "+? adds optional, -? removes optional; +readonly adds readonly, -readonly removes it",
      "Key remap: { [P in keyof T as NewKeyExpression]: T[P] } — rename or filter keys",
      "Filter keys: map key to never in as clause to exclude it from the output type",
      "Template literal keys: as \`get${Capitalize<string & P>}\` generates getX method names",
      "Pick = mapped type iterating over a subset K of keys: { [P in K]: T[P] }",
      "Record = mapped type iterating over a union K: { [P in K]: V }",
      "Partial = mapped type with +?: { [P in keyof T]?: T[P] }",
      "Combine with conditionals for deep transformations: T[P] extends object ? Recurse<T[P]> : T[P]",
    ],

    interviewTips: [
      "Open by implementing Partial from scratch: '[P in keyof T]?: T[P] — this is the entire implementation of Partial. Every built-in utility type is a mapped type, and understanding these implementations is more useful than memorizing utility type names.'",
      "The modifier syntax is often unknown to mid-level candidates — mention it: 'Mapped types can add or remove the ? and readonly modifiers using +/- prefixes. Required<T> is implemented as -?: T[P] — the minus removes the optional modifier. This is in lib.es5.d.ts if you want to read it.'",
      "Key remapping is a strong senior-level signal: 'TypeScript 4.1 added an as clause to mapped types for key renaming. This lets you generate getX accessor names, filter out keys that map to never, and transform property names using template literal types.'",
      "Connect mapped types to real problems: 'The most practical use I encounter is PartialBy<T, K> — a type that makes only specific properties optional while requiring the rest. It's two lines using mapped types but saves writing a custom interface for every update shape.'",
    ],

    related: [
      "typescript-utility-types-interview-questions",
      "typescript-conditional-types-interview-questions",
      "typescript-generics-interview-questions",
      "typescript-types-vs-interfaces-interview-questions",
    ],

    relatedBlogSlugs: [
      "typescript-mapped-conditional-types",
      "typescript-utility-types-cheatsheet",
    ],
  },

  // ─── 9. Conditional Types ─────────────────────────────────────────────────

  {
    slug: "typescript-conditional-types-interview-questions",
    title: "TypeScript Conditional Types — Complete Interview Guide",
    category: "Advanced Types",
    keyword: "Conditional Types",
    description:
      "Deep-dive into TypeScript conditional types — the T extends U ? X : Y syntax, distributive behaviour over unions, the infer keyword for type extraction, and how to build powerful type utilities like ReturnType, Awaited, and NonNullable from first principles.",
    extraKeywords: [
      "typescript conditional types",
      "typescript extends ternary type",
      "typescript infer keyword",
      "typescript distributive conditional types",
      "typescript ReturnType implementation",
      "typescript Awaited type",
      "typescript type inference",
      "typescript advanced types",
    ],
    difficulty: "Advanced",
    questionCount: "6–10",
    track: "typescript",
    status: "published",
    order: 9,

    mentalModel:
      "Conditional types are TypeScript's type-level ternary operator — the type equivalent of the value-level expression condition ? thenValue : elseValue. At the type level, T extends U ? X : Y means: 'if type T is assignable to type U, resolve to type X, otherwise resolve to type Y.' The infer keyword extends this further, letting you declare a type variable inside the extends clause to capture and name a sub-type that TypeScript infers during the assignability check — like pattern matching for types. Together they form a type-level programming system powerful enough to implement ReturnType, Awaited, Parameters, and dozens of real utility types.",

    deepDive: `
<h3>Basic Conditional Type Syntax</h3>
<pre><code>// T extends U ? X : Y
// "If T is assignable to U, the type is X. Otherwise the type is Y."

type IsString&lt;T&gt; = T extends string ? true : false;

type A = IsString&lt;string&gt;;  // true
type B = IsString&lt;number&gt;;  // false
type C = IsString&lt;"hello"&gt;; // true — "hello" extends string

// Practical: NonNullable (removes null and undefined from T)
type NonNullable&lt;T&gt; = T extends null | undefined ? never : T;

type D = NonNullable&lt;string | null&gt;;        // string
type E = NonNullable&lt;number | undefined&gt;;   // number
type F = NonNullable&lt;null | undefined&gt;;     // never</code></pre>

<h3>Distributive Conditional Types</h3>
<p>When the type parameter is a <em>naked</em> type variable (not wrapped in anything), conditional types distribute over union members automatically — the condition is applied to each union member separately and the results are combined:</p>
<pre><code>// T is naked (not wrapped) — distributes over unions
type ToArray&lt;T&gt; = T extends any ? T[] : never;

type StringOrNumberArrays = ToArray&lt;string | number&gt;;
// Distributes: ToArray&lt;string&gt; | ToArray&lt;number&gt;
// = string[] | number[]
// (NOT (string | number)[])

// Exclude is a distributive conditional type
type Exclude&lt;T, U&gt; = T extends U ? never : T;
type Status = "active" | "inactive" | "deleted";
type ActiveOrInactive = Exclude&lt;Status, "deleted"&gt;;
// Distributes:
//   "active" extends "deleted" ? never : "active"   → "active"
//   "inactive" extends "deleted" ? never : "inactive" → "inactive"
//   "deleted" extends "deleted" ? never : "deleted"  → never
// Result: "active" | "inactive"

// To PREVENT distribution — wrap T in a tuple
type NoDistribute&lt;T&gt; = [T] extends [any] ? T[] : never;
type Wrapped = NoDistribute&lt;string | number&gt;;
// [string | number] extends [any] = true → (string | number)[]
// (NOT string[] | number[])</code></pre>

<h3>The infer Keyword</h3>
<p><code>infer</code> declares a type variable to be inferred by TypeScript during the extends check. It's the mechanism that makes ReturnType, Parameters, and Awaited possible:</p>
<pre><code>// ReturnType — infer R is bound to the return type of the function
type ReturnType&lt;T&gt; = T extends (...args: any[]) =&gt; infer R ? R : never;

function getUser(): User { return { id: 1, name: "Alice" }; }
type UserType = ReturnType&lt;typeof getUser&gt;; // User

// Parameters — infer P is bound to the parameter tuple
type Parameters&lt;T&gt; = T extends (...args: infer P) =&gt; any ? P : never;
type GetUserParams = Parameters&lt;typeof getUser&gt;; // []

// Unwrap a Promise — infer the resolved type
type Awaited&lt;T&gt; = T extends Promise&lt;infer U&gt; ? Awaited&lt;U&gt; : T;
// Recursively unwraps: Promise&lt;Promise&lt;string&gt;&gt; → string

type Resolved = Awaited&lt;Promise&lt;User[]&gt;&gt;; // User[]

// Extract array element type
type ArrayElement&lt;T&gt; = T extends (infer E)[] ? E : never;
type ItemType = ArrayElement&lt;string[]&gt;; // string

// Extract the first element of a tuple
type Head&lt;T extends any[]&gt; = T extends [infer H, ...any[]] ? H : never;
type FirstArg = Head&lt;[string, number, boolean]&gt;; // string</code></pre>

<h3>Chained Conditional Types</h3>
<pre><code>// Multiple conditions — like if/else if/else chains
type TypeName&lt;T&gt; =
  T extends string  ? "string"  :
  T extends number  ? "number"  :
  T extends boolean ? "boolean" :
  T extends symbol  ? "symbol"  :
  T extends object  ? "object"  :
  "other";

type A = TypeName&lt;string&gt;;      // "string"
type B = TypeName&lt;42&gt;;          // "number"
type C = TypeName&lt;() =&gt; void&gt;;  // "object"

// Nested conditional for deep type extraction
type UnwrapNested&lt;T&gt; =
  T extends Promise&lt;infer U&gt; ? UnwrapNested&lt;U&gt; :
  T extends Array&lt;infer U&gt;   ? UnwrapNested&lt;U&gt; :
  T;</code></pre>

<h3>Conditional Types in Mapped Types</h3>
<pre><code>// Filter properties by value type using conditional type in mapped key position
type PickByValue&lt;T, V&gt; = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

interface Config {
  host: string;
  port: number;
  debug: boolean;
  maxRetries: number;
}

type StringConfig = PickByValue&lt;Config, string&gt;;
// { host: string; }

type NumberConfig = PickByValue&lt;Config, number&gt;;
// { port: number; maxRetries: number; }

// Make only certain value-typed fields optional
type OptionalStrings&lt;T&gt; = {
  [K in keyof T]: T[K] extends string ? T[K] | undefined : T[K];
};</code></pre>
    `.trim(),

    misconceptions: [
      "Many developers think T extends U in a conditional type means T must inherit from U like in class inheritance — it means T must be assignable to U. 'hello' extends string is true because string literals are assignable to string, with no inheritance relationship.",
      "Many developers think conditional types always distribute over unions — distribution only happens when the type parameter is a naked type variable at the top level. Wrapping in a tuple ([T] extends [U]) prevents distribution, which is sometimes what you want.",
      "Many developers think infer can be used outside of an extends clause — infer is only valid inside the true branch's extends clause. It's not a general type inference tool; it's specifically a pattern-matching capture variable.",
      "Many developers think conditional types are evaluated eagerly — when T is still a generic type parameter (not yet resolved), TypeScript defers conditional type evaluation. This can cause 'Type is not assignable' errors that seem counterintuitive until you understand deferred evaluation.",
      "Many developers think never in a union disappears — never is the identity element for unions. string | never === string. This is why distributive conditional types that return never for some members effectively filter those members out of the union.",
      "Many developers think conditional types are only for advanced library authors — ReturnType<typeof fn>, Awaited<T>, and Parameters<typeof fn> are daily-use conditional types. Understanding infer makes reading type errors and library types significantly easier.",
    ],

    realWorldExamples: [
      "React component prop extraction: ComponentProps<typeof Button> uses conditional types to extract the props interface from a component — invaluable when a library doesn't export its prop types directly.",
      "Async function return type unwrapping: Awaited<ReturnType<typeof fetchUser>> gives you the resolved User type without having to manually inspect the promise chain — a clean pattern for typing API responses.",
      "Type-safe event systems: EventMap extends Record<string, unknown> combined with conditional type inference lets an event emitter's on() method infer the callback parameter type from the event name string.",
      "GraphQL code generation: tools generate conditional types to model nullable fields, optional arguments, and union return types accurately from GraphQL schemas — conditional types handle the nullable wrapping cleanly.",
      "tRPC and type-safe RPCs: tRPC's router inference uses deep conditional type extraction to flow types from server procedure definitions to client call sites with zero manual type declarations.",
      "ORM query builder types: Prisma and TypeORM use conditional types to model relations, select sub-objects, and optional includes — the returned type changes based on which fields you select in the query options.",
    ],

    cheatSheet: [
      "Syntax: T extends U ? X : Y — if T is assignable to U, resolve to X, else Y",
      "Distributive: naked type parameter T distributes over union members automatically",
      "Prevent distribution: wrap in tuple — [T] extends [U] ? X : Y — evaluates T as a whole",
      "infer: captures a sub-type inside extends clause — T extends Promise<infer U> ? U : never",
      "never in conditional type results filters union members (never | A = A)",
      "Chained: T extends A ? X : T extends B ? Y : Z — type-level if/else if/else",
      "Combine with mapped type as clause to filter keys: [K as T[K] extends V ? K : never]",
      "ReturnType<T>: T extends (...args: any[]) => infer R ? R : never",
      "Awaited<T>: T extends Promise<infer U> ? Awaited<U> : T — recursive unwrap",
      "Deferred evaluation: conditional types over unresolved generics are deferred — may produce unexpected errors",
    ],

    interviewTips: [
      "Start by demystifying the syntax: 'T extends U ? X : Y is the type-level ternary. extends here means assignable to, not inherits from. \"hello\" extends string is true because string literals are assignable to string.'",
      "The infer keyword explanation is what separates intermediate from senior: 'infer lets me declare a new type variable that TypeScript fills in during the assignability check — like a capture group in a regex. ReturnType works by checking if T matches a function shape and capturing the return type as R.'",
      "Distribution is the nuanced behaviour to mention: 'When T is a naked generic, conditional types distribute over union members. Exclude<'a' | 'b' | 'c', 'c'> applies the condition to each member separately. Wrapping in a tuple prevents this — [T] extends [U] evaluates T as a complete union.'",
      "Ground it in everyday use: 'I use conditional types most often through ReturnType, Awaited, and Parameters. Understanding the underlying infer mechanism means I can read library type definitions and error messages more clearly, which saves significant debugging time.'",
    ],

    related: [
      "typescript-mapped-types-interview-questions",
      "typescript-generics-interview-questions",
      "typescript-utility-types-interview-questions",
      "typescript-union-intersection-types-interview-questions",
    ],

    relatedBlogSlugs: [
      "typescript-mapped-conditional-types",
      "top-50-typescript-interview-questions",
    ],
  },

  // ─── 10. Decorators ───────────────────────────────────────────────────────

  {
    slug: "typescript-decorators-interview-questions",
    title: "TypeScript Decorators — Complete Interview Guide",
    category: "Advanced Types",
    keyword: "Decorators",
    description:
      "Deep-dive into TypeScript decorators — class, method, property, accessor, and parameter decorators. Understand the execution order, decorator factories, metadata reflection, and how frameworks like NestJS, Angular, and MobX are built on top of this feature.",
    extraKeywords: [
      "typescript decorators",
      "typescript class decorator",
      "typescript method decorator",
      "typescript property decorator",
      "typescript parameter decorator",
      "typescript reflect-metadata",
      "typescript decorator factory",
      "nestjs decorators typescript",
    ],
    difficulty: "Advanced",
    questionCount: "4–8",
    track: "typescript",
    status: "published",
    order: 10,

    mentalModel:
      "Decorators are annotations that wrap or enhance a class, method, property, or parameter at decoration time — similar to Python decorators or Java annotations, but with the ability to modify the target. Think of them as gift-wrapping functions: you pass in the original class or method, you add your enhancement layer around it (logging, validation, caching, dependency injection), and the consumer interacts with the enhanced version without knowing the original is wrapped inside. The critical thing to understand is that decorators run at class definition time (when the module loads), not at instance creation time — this determines what they can and cannot do.",

    deepDive: `
<h3>Decorator Basics and Configuration</h3>
<p>Decorators are currently a Stage 3 TC39 proposal. TypeScript supports both the legacy experimental decorators (widely used, requires <code>experimentalDecorators: true</code>) and the newer Stage 3 decorators. Most production frameworks (NestJS, Angular, MobX) use the legacy form. This guide covers the legacy form since it dominates interview contexts:</p>
<pre><code>// tsconfig.json — required for legacy decorators
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true  // required for reflect-metadata
  }
}

// A decorator is a function — it receives the decorated target as its argument
function Log(target: Function) {
  console.log(\`Class defined: \${target.name}\`);
}

@Log
class UserService {
  // Log runs at class definition time, once, when this module loads
  // NOT when new UserService() is called
}</code></pre>

<h3>Class Decorators</h3>
<pre><code>// Class decorator — receives the constructor function
// Can return a new constructor to replace the original class
type Constructor&lt;T = {}> = new (...args: any[]) =&gt; T;

function Singleton&lt;T extends Constructor&gt;(Base: T) {
  let instance: InstanceType&lt;T&gt; | null = null;
  return class extends Base {
    constructor(...args: any[]) {
      if (instance) return instance as any;
      super(...args);
      instance = this as any;
    }
  };
}

@Singleton
class DatabaseConnection {
  connect() { /* ... */ }
}

const a = new DatabaseConnection();
const b = new DatabaseConnection();
console.log(a === b); // true — same instance</code></pre>

<h3>Method Decorators</h3>
<pre><code>// Method decorator receives: target (prototype), key (method name), descriptor
function Memoize(
  target: any,
  key: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value;
  const cache = new Map&lt;string, any&gt;();

  descriptor.value = function(...args: any[]) {
    const cacheKey = JSON.stringify(args);
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    const result = original.apply(this, args);
    cache.set(cacheKey, result);
    return result;
  };

  return descriptor;
}

class MathService {
  @Memoize
  fibonacci(n: number): number {
    if (n &lt;= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

// Logging decorator — a real-world pattern
function Log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(\`Calling \${key} with\`, args);
    const result = original.apply(this, args);
    console.log(\`\${key} returned\`, result);
    return result;
  };
  return descriptor;
}</code></pre>

<h3>Decorator Factories</h3>
<p>A decorator factory is a function that returns a decorator — allowing the decorator to be parameterized:</p>
<pre><code>// Factory — outer function takes config, returns the actual decorator
function Throttle(ms: number) {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    let lastCall = 0;
    descriptor.value = function(...args: any[]) {
      const now = Date.now();
      if (now - lastCall &gt;= ms) {
        lastCall = now;
        return original.apply(this, args);
      }
    };
    return descriptor;
  };
}

class SearchService {
  @Throttle(300)  // Decorator factory — passes 300 to the outer function
  search(query: string) { /* ... */ }
}

// NestJS uses decorator factories extensively:
// @Controller('users')
// @Get(':id')
// @Body(), @Param('id'), @Injectable()
// All of these are decorator factories returning the actual decorator</code></pre>

<h3>Property and Parameter Decorators</h3>
<pre><code>// Property decorator — receives target and property key
// Cannot directly modify the property (no descriptor provided)
// Typically used with reflect-metadata to record metadata
function Required(target: any, key: string) {
  const metadata: string[] = Reflect.getMetadata("required", target) || [];
  metadata.push(key);
  Reflect.defineMetadata("required", metadata, target);
}

// Parameter decorator — receives target, method name, and parameter index
function ValidateId(target: any, key: string, index: number) {
  // Marks the parameter at 'index' in method 'key' for validation
  const params: number[] = Reflect.getMetadata("validateId", target, key) || [];
  params.push(index);
  Reflect.defineMetadata("validateId", params, target, key);
}

class UserController {
  @Required
  name: string = "";

  getUser(@ValidateId id: string) {
    return users.find(u =&gt; u.id === id);
  }
}</code></pre>

<h3>Decorator Execution Order</h3>
<pre><code>// 1. Parameter decorators evaluated bottom-up, then
// 2. Method/accessor/property decorators evaluated bottom-up, then
// 3. Parameter decorators for constructor, then
// 4. Class decorator evaluated last

@ClassDec          // Runs 4th
class Example {
  @PropDec         // Runs 3rd
  value: string;

  @MethodDec1      // Runs 2nd (outer)
  @MethodDec2      // Runs 1st (inner — applied closer to method first)
  method(@ParamDec param: string) {}
}

// The general rule: innermost decorator runs first, class decorator runs last</code></pre>
    `.trim(),

    misconceptions: [
      "Many developers think decorators run when instances are created — class and method decorators run at class definition time, when the module loads. They are applied once to the prototype or constructor, not once per instance. Only the wrapper function they install runs per call.",
      "Many developers think TypeScript decorators are stable and finalized — the legacy experimental decorators (experimentalDecorators: true) have been in TypeScript since v1.5 but are NOT the TC39 standard. The actual Stage 3 decorator proposal has a different API. Most frameworks still use the legacy form.",
      "Many developers think property decorators can intercept gets and sets directly — unlike method decorators, property decorators do not receive a PropertyDescriptor. To observe property access, you need to use Object.defineProperty inside the decorator or combine with reflect-metadata.",
      "Many developers think decorators are just syntactic sugar for higher-order functions applied manually — they are structurally equivalent, but they are applied at a specific phase in class evaluation, which determines the execution order and what targets are available.",
      "Many developers think emitDecoratorMetadata is optional — it is required to use reflect-metadata for dependency injection (the technique Angular and NestJS rely on to resolve constructor parameter types). Without it, Reflect.getMetadata('design:type') returns undefined.",
      "Many developers think decorators are only useful in NestJS and Angular — MobX uses decorators for observable and computed, TypeORM for Entity and Column, class-validator for validation rules, and Swagger for API documentation — all common across the TypeScript ecosystem.",
    ],

    realWorldExamples: [
      "NestJS dependency injection: @Injectable(), @Controller('users'), @Get(':id'), and @Body() are all decorators. The framework reads decorator metadata at startup to wire up the dependency injection container, route handlers, and request parsing automatically.",
      "Angular components: @Component({ selector, template, styles }) is a class decorator factory that registers the component with Angular's compiler and attaches its metadata — template, styles, change detection strategy — to the class.",
      "MobX state management: @observable and @computed are property decorators that replace the property with a getter/setter pair backed by MobX's reactive system — every assignment triggers reactive updates without any manual subscription code.",
      "class-validator: @IsEmail(), @MinLength(8), @IsOptional() are property decorators that store validation rules as metadata. The validate(instance) function reads that metadata at runtime to perform all validations in one call.",
      "TypeORM entities: @Entity(), @Column(), @PrimaryGeneratedColumn(), @ManyToOne() are decorators that describe the database schema in terms of TypeScript classes — TypeORM reads the metadata to generate migrations and build queries.",
      "Swagger/OpenAPI documentation: @ApiProperty(), @ApiTags(), @ApiResponse() from @nestjs/swagger automatically generate OpenAPI specs from decorated controllers and DTOs — zero manual YAML or JSON needed.",
    ],

    cheatSheet: [
      "Enable: experimentalDecorators: true in tsconfig.json; emitDecoratorMetadata: true for reflect-metadata",
      "Class decorator: receives the constructor; can return a new constructor to replace the class",
      "Method decorator: receives (target, key, descriptor); modify descriptor.value to wrap the method",
      "Property decorator: receives (target, key); no descriptor — use reflect-metadata to store metadata",
      "Parameter decorator: receives (target, key, parameterIndex); typically stores metadata for later validation",
      "Decorator factory: outer function with config returns the actual decorator — enables @Throttle(300)",
      "Execution order: parameter → method/property decorators (bottom-up) → class decorator (last)",
      "Decorators run at class definition time, not at instance creation time",
      "Legacy experimental decorators vs Stage 3 decorators: different APIs, most frameworks use legacy form",
      "reflect-metadata: needed for design:type, design:paramtypes metadata used by DI containers",
    ],

    interviewTips: [
      "Lead with the runtime timing distinction: 'Decorators run at class definition time — when the module loads. They are applied to the prototype or constructor once. The functions they install run at call time, but the decoration itself is a one-time class-load operation.'",
      "Connect to framework usage: 'I use decorators daily through NestJS — @Injectable(), @Controller(), @Get() — but understanding how they work lets me write custom decorators for cross-cutting concerns like logging, caching, and authorization guards.'",
      "The decorator factory pattern is important to explain: 'A plain decorator takes the target directly. A decorator factory is a function that receives config and returns a decorator — that's why @Throttle(300) has parentheses. The outer function runs immediately to close over 300, then the returned decorator is applied to the method.'",
      "Be clear about the state of decorators: 'The legacy experimentalDecorators form is what most frameworks use today. There is a newer Stage 3 TC39 proposal with a different API. TypeScript supports both, but they are not compatible — this is an important distinction in job settings that care about standards compliance.'",
    ],

    related: [
      "typescript-classes-access-modifiers-interview-questions",
      "typescript-generics-interview-questions",
      "typescript-mapped-types-interview-questions",
    ],

    relatedBlogSlugs: [
      "typescript-advanced-patterns",
      "top-50-typescript-interview-questions",
    ],
  },

];
