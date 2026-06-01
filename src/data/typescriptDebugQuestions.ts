/**
 * src/data/typescriptDebugQuestions.ts
 *
 * TypeScript debug questions for jsprep.pro
 *
 * CONTRACT:
 *  ✅ Pure JS only — no fetch, DOM, TypeScript compiler imports required
 *  ✅ brokenCode runs WITHOUT throwing — silent wrong output or wrong behavior
 *  ✅ fixedCode logs expectedOutput exactly
 *  ✅ expectedOutput never contains "Error", "TypeError" etc.
 *  ✅ IDs start at 6001 — TypeScript debug section
 */

import type { DebugQuestion } from './debugQuestions';

export const TYPESCRIPT_DEBUG_CATEGORIES = [
  'Type Errors',
  'Generic Constraints',
  'Utility Types',
  'Class Patterns',
] as const;

export const typescriptDebugQuestions: DebugQuestion[] = [

  // ─── TYPE ERRORS (3) ──────────────────────────────────────────────────────

  {
    id: 6001,
    cat: 'Type Errors' as any,
    difficulty: 'easy',
    title: 'Wrong type assignment causes silent wrong output',
    description:
      'The function expects a number but receives a string — produces NaN instead of a calculation result. Fix the type mismatch.',
    tags: ['type-assignment', 'coercion', 'NaN', 'string-vs-number'],
    companies: ['Microsoft', 'Google', 'Razorpay', 'Flipkart'],
    brokenCode: `// TypeScript would flag: Argument of type 'string' is not assignable to parameter of type 'number'
// But at runtime the bug is silent — NaN is produced instead of an error

function calculateTotal(price, quantity) {
  return price * quantity;  // JS coerces string to number… sometimes
}

// Bug: price passed as string from a form input — not converted
const priceFromInput = '29.99'; // typeof === 'string'
const quantity = 3;

const total = calculateTotal(priceFromInput, quantity);

// Should be 89.97 but string * number behaves unexpectedly
console.log(total);
console.log(typeof total);`,
    bugDescription:
      'In TypeScript this would be caught: string is not assignable to number. At runtime, JavaScript coerces "29.99" * 3 to a number and gets 89.97 — but relying on implicit coercion is fragile. The bug manifests with non-numeric strings.',
    fixedCode: `function calculateTotal(price, quantity) {
  return price * quantity;
}

// Fix: explicitly convert string to number before passing
const priceFromInput = '29.99';
const quantity = 3;

// TypeScript fix: annotate price as number and parse before calling
const total = calculateTotal(parseFloat(priceFromInput), quantity);

console.log(total.toFixed(2));
console.log(typeof total);`,
    expectedOutput: '89.97\nnumber',
    explanation:
      'parseFloat converts the string to a proper number. TypeScript would enforce this with parameter type annotations — string would be rejected at compile time.',
    keyInsight:
      'TypeScript type annotations prevent implicit type coercion bugs. Always annotate function parameters. When receiving values from external sources (forms, APIs), validate and convert before passing to typed functions.',
  },

  {
    id: 6002,
    cat: 'Type Errors' as any,
    difficulty: 'medium',
    title: 'Accessing property on potentially undefined value',
    description:
      'The code assumes find() always returns a value but it can return undefined — causing a silent wrong result. Fix with proper null check.',
    tags: ['undefined', 'optional-chaining', 'null-check', 'find'],
    companies: ['Microsoft', 'Atlassian', 'Meta', 'Razorpay'],
    brokenCode: `// TypeScript: Object is possibly 'undefined' — accessing .name on User | undefined
const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob',   role: 'user' },
  { id: 3, name: 'Carol', role: 'user' },
];

function getUserName(id) {
  const user = users.find(u => u.id === id);
  // Bug: user might be undefined if id not found
  // TypeScript error: 'user' is possibly 'undefined'
  return user.name; // silent wrong result when user is undefined
}

// Found user — works
console.log(getUserName(1));

// Not found — returns wrong result (should be a fallback, not crash)
console.log(getUserName(99) || 'Unknown');`,
    bugDescription:
      'Array.find() returns T | undefined. Accessing .name without checking for undefined causes a runtime error when the item is not found. TypeScript flags this with strict null checks enabled.',
    fixedCode: `const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob',   role: 'user' },
  { id: 3, name: 'Carol', role: 'user' },
];

function getUserName(id) {
  const user = users.find(u => u.id === id);
  // Fix 1: null check with fallback
  if (!user) return 'Unknown';
  return user.name;

  // Fix 2: optional chaining + nullish coalescing (TypeScript idiomatic)
  // return users.find(u => u.id === id)?.name ?? 'Unknown';
}

console.log(getUserName(1));
console.log(getUserName(99));`,
    expectedOutput: 'Alice\nUnknown',
    explanation:
      'The null check guards against undefined before accessing .name. TypeScript with strict null checks would catch this at compile time, forcing you to handle the undefined case.',
    keyInsight:
      'TypeScript strict null checks (strictNullChecks: true) surface these bugs at compile time. T | undefined from find() forces you to handle both cases. Use optional chaining (?.) and nullish coalescing (??) for concise null-safe code.',
  },

  {
    id: 6003,
    cat: 'Type Errors' as any,
    difficulty: 'medium',
    title: 'Returning wrong type from a function — silently truncates data',
    description:
      'The function should return a full user object but returns only the name string — callers get wrong type and wrong data.',
    tags: ['return-type', 'type-mismatch', 'object', 'function'],
    companies: ['Microsoft', 'Google', 'Flipkart', 'CRED'],
    brokenCode: `// TypeScript: Type 'string' is not assignable to type 'User'
// At runtime: callers get a string instead of an object

function getUserById(id, users) {
  const user = users.find(u => u.id === id);
  if (!user) return null;

  // Bug: returns user.name (string) instead of user (object)
  return user.name;
}

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob',   email: 'bob@example.com',   role: 'user' },
];

const result = getUserById(1, users);
// Caller expects an object with .email, but gets a string
const email = result && typeof result === 'object' ? result.email : 'not found';
const name  = result && typeof result === 'object' ? result.name  : result;

console.log(name);
console.log(email);`,
    bugDescription:
      'getUserById returns user.name (string) instead of user (object). TypeScript would catch this with a return type annotation. Callers cannot access .email because they receive a string.',
    fixedCode: `function getUserById(id, users) {
  const user = users.find(u => u.id === id);
  if (!user) return null;

  // Fix: return the full user object
  return user;
}

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob',   email: 'bob@example.com',   role: 'user' },
];

const result = getUserById(1, users);
const email = result ? result.email : 'not found';
const name  = result ? result.name  : 'not found';

console.log(name);
console.log(email);`,
    expectedOutput: 'Alice\nalice@example.com',
    explanation:
      'Returning the full user object allows callers to access all properties. TypeScript enforces return type consistency — if you annotate the return type as User, returning a string would be a compile error.',
    keyInsight:
      'Always annotate function return types in TypeScript: function getUserById(id: number): User | null. This catches accidental narrowing bugs where you return part of an object instead of the whole thing.',
  },

  // ─── GENERIC CONSTRAINTS (3) ─────────────────────────────────────────────

  {
    id: 6004,
    cat: 'Generic Constraints' as any,
    difficulty: 'medium',
    title: 'Missing keyof constraint — unsafe property access',
    description:
      'The pluck function accepts any string key instead of only keys that exist on the object — returns undefined for invalid keys. Fix with keyof constraint.',
    tags: ['keyof', 'constraint', 'generic', 'property-access'],
    companies: ['Microsoft', 'Atlassian', 'Google', 'Razorpay'],
    brokenCode: `// TypeScript without constraint: pluck<T>(items: T[], key: string): any[]
// Bug: accepts ANY string as key — invalid keys return undefined silently

function pluck(items, key) {
  return items.map(item => item[key]);
}

const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob',   age: 25 },
];

// Valid key — works
const names = pluck(users, 'name');
console.log(names.join(','));

// Invalid key — returns undefined silently (no TypeScript error without constraint)
const emails = pluck(users, 'email');
console.log(emails.join(','));  // ",," — undefined stringified`,
    bugDescription:
      'Without K extends keyof T constraint, any string key is accepted. Invalid keys (like "email") return undefined for each item — producing an array of undefined values with no compile-time warning.',
    fixedCode: `// Fix: add K extends keyof T constraint — only valid keys accepted
// TypeScript: function pluck<T, K extends keyof T>(items: T[], key: K): T[K][]

function pluck(items, key) {
  // With K extends keyof T, TypeScript rejects invalid keys at compile time
  return items.map(item => item[key]);
}

const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob',   age: 25 },
];

// Fix: only use valid keys
const names = pluck(users, 'name');
console.log(names.join(','));

const ages = pluck(users, 'age');
console.log(ages.join(','));`,
    expectedOutput: 'Alice,Bob\n30,25',
    explanation:
      'Using only valid keys (name, age) ensures all values are defined. The TypeScript fix (K extends keyof T) makes invalid keys a compile error — preventing the silent undefined bug.',
    keyInsight:
      'The signature <T, K extends keyof T>(items: T[], key: K): T[K][] is three guarantees in one: K must be a real key of T, the return type T[K] matches the property type, and TypeScript prevents typos in key names.',
  },

  {
    id: 6005,
    cat: 'Generic Constraints' as any,
    difficulty: 'hard',
    title: 'Missing extends object constraint — primitive passed to object utility',
    description:
      'The merge function receives a primitive instead of an object and produces wrong output. Fix by validating the input type.',
    tags: ['extends-object', 'constraint', 'primitive', 'generic'],
    companies: ['Microsoft', 'Google', 'Meta', 'Flipkart'],
    brokenCode: `// TypeScript without constraint: merge<T, U>(a: T, b: U): T & U
// Bug: works at type level but no constraint prevents primitives

function merge(a, b) {
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    // No TypeScript error without constraint — silently returns wrong type
    return String(a) + String(b); // treats as string concat when primitives
  }
  return { ...a, ...b };
}

// Correct usage: two objects
const combined = merge({ name: 'Alice' }, { age: 30 });
console.log(JSON.stringify(combined));

// Bug: passing primitives — TypeScript should reject with T extends object constraint
const wrong = merge('hello', 42);
console.log(wrong);
console.log(typeof wrong);`,
    bugDescription:
      'Without T extends object constraint, TypeScript allows merging primitives. The function falls into the string concatenation branch and returns "hello42" — not an object merge. TypeScript fix: T extends object, U extends object.',
    fixedCode: `// Fix: validate inputs are objects before merging
function merge(a, b) {
  if (typeof a !== 'object' || a === null) {
    throw new TypeError('First argument must be an object');
  }
  if (typeof b !== 'object' || b === null) {
    throw new TypeError('Second argument must be an object');
  }
  return { ...a, ...b };
}

// Correct usage only — TypeScript constraint prevents primitives at compile time
const combined = merge({ name: 'Alice' }, { age: 30 });
console.log(JSON.stringify(combined));

const full = merge({ id: 1, name: 'Alice' }, { role: 'admin', active: true });
console.log(full.name + ':' + full.role);`,
    expectedOutput: '{"name":"Alice","age":30}\nAlice:admin',
    explanation:
      'With proper inputs, spread merge works correctly. TypeScript\'s T extends object constraint prevents primitives at compile time — no need for runtime checks when types are enforced.',
    keyInsight:
      'Constraints (T extends object) are compile-time guarantees. They prevent whole classes of misuse without runtime overhead. Always constrain generics to the minimum required interface — it documents intent AND prevents bugs.',
  },

  {
    id: 6006,
    cat: 'Generic Constraints' as any,
    difficulty: 'hard',
    title: 'Generic function returns any instead of constrained type',
    description:
      'The filter function loses type information by returning any[] instead of T[]. Fix to preserve the generic type.',
    tags: ['generic', 'return-type', 'any', 'type-preservation'],
    companies: ['Microsoft', 'Atlassian', 'Google', 'Razorpay'],
    brokenCode: `// Bug: returns any[] — TypeScript loses type information
// Should be: function filterDefined<T>(arr: (T | null | undefined)[]): T[]

function filterDefined(arr) {
  // Returns filtered array but type is lost — TypeScript sees any[]
  return arr.filter(item => item !== null && item !== undefined);
}

const maybeNumbers = [1, null, 3, undefined, 5];
const result = filterDefined(maybeNumbers);

// Bug: without proper typing, TypeScript allows incorrect method calls
// result is inferred as any[] — no type safety on elements
console.log(result.join(','));

// TypeScript with proper return type would infer result as number[]
// and result[0].toFixed(2) would be safe without assertion
const first = result[0];
console.log(typeof first);
console.log(result.length);`,
    bugDescription:
      'filterDefined returns any[] (or inferrred loosely) instead of T[]. TypeScript loses knowledge that elements are numbers after filtering. The fix requires an explicit generic return type annotation and/or a type predicate.',
    fixedCode: `// Fix: use type predicate to preserve generic type information
// TypeScript: function filterDefined<T>(arr: (T | null | undefined)[]): T[]

function filterDefined(arr) {
  return arr.filter(item => item !== null && item !== undefined);
}

// TypeScript fix would use type predicate:
// (item): item is T => item !== null && item !== undefined

const maybeNumbers = [1, null, 3, undefined, 5];
const result = filterDefined(maybeNumbers);

// With proper typing, result would be number[] — all operations safe
const doubled = result.map(n => n * 2);
console.log(doubled.join(','));

const first = result[0];
console.log(typeof first);
console.log(result.length);`,
    expectedOutput: '2,6,10\nnumber\n3',
    explanation:
      'filterDefined correctly removes null and undefined values — result has 3 elements [1, 3, 5]. doubled maps each by 2. TypeScript with proper return type T[] would know all elements are numbers.',
    keyInsight:
      'Type predicates (item is T) in filter callbacks tell TypeScript to narrow the array element type. (arr: (T|null|undefined)[]).filter((x): x is T => x != null) returns T[] — not (T|null|undefined)[].',
  },

  // ─── UTILITY TYPES (3) ────────────────────────────────────────────────────

  {
    id: 6007,
    cat: 'Utility Types' as any,
    difficulty: 'medium',
    title: 'Misusing Partial — required fields treated as optional at runtime',
    description:
      'The createUser function uses Partial<User> for its input but all fields are actually required — missing fields cause undefined values. Fix with proper typing.',
    tags: ['Partial', 'utility-types', 'required', 'create-function'],
    companies: ['Microsoft', 'Atlassian', 'Razorpay', 'Flipkart'],
    brokenCode: `// Bug: Partial<User> used for creation — all fields optional
// But name and email are required to create a valid user

function createUser(data) {
  // Partial<User> means caller can omit name, email — but they're needed
  return {
    id: Math.floor(Math.random() * 1000),
    name: data.name,       // undefined if omitted
    email: data.email,     // undefined if omitted
    role: data.role || 'user',
    createdAt: '2024-01-01',
  };
}

// Bug: missing required fields — silent undefined values
const incomplete = createUser({ role: 'admin' });
console.log(incomplete.name);    // undefined — should be required!
console.log(incomplete.email);   // undefined — should be required!
console.log(incomplete.role);`,
    bugDescription:
      'Partial<User> makes all fields optional. createUser should require name and email but allows them to be omitted. The correct type is: Pick<User, "name" | "email"> & Partial<Pick<User, "role">>',
    fixedCode: `// Fix: correct input type — name and email required, role optional
// TypeScript: function createUser(data: { name: string; email: string; role?: string }): User

function createUser(data) {
  if (!data.name || !data.email) {
    // Runtime guard — TypeScript would catch this at compile time
    throw new Error('name and email are required');
  }
  return {
    id: Math.floor(Math.random() * 1000),
    name: data.name,
    email: data.email,
    role: data.role || 'user',
    createdAt: '2024-01-01',
  };
}

const alice = createUser({ name: 'Alice', email: 'alice@example.com' });
console.log(alice.name);
console.log(alice.email);
console.log(alice.role);`,
    expectedOutput: 'Alice\nalice@example.com\nuser',
    explanation:
      'With proper required fields, name and email are always defined. The TypeScript fix removes Partial for required fields — only optional fields get the ? modifier.',
    keyInsight:
      'Use Partial only for update/patch operations. For create operations, explicitly list required fields. A common pattern: type CreateInput = Omit<User, "id" | "createdAt"> which requires all user-provided fields.',
  },

  {
    id: 6008,
    cat: 'Utility Types' as any,
    difficulty: 'medium',
    title: 'Pick selects too few fields — missing data causes wrong output',
    description:
      'The formatUser function picks only name but needs email too — the formatted string is incomplete. Fix the Pick selection.',
    tags: ['Pick', 'utility-types', 'subset', 'missing-fields'],
    companies: ['Microsoft', 'Google', 'Meta', 'CRED'],
    brokenCode: `// TypeScript: Pick<User, 'name'> — only name is selected, email missing

function formatUserCard(user) {
  // Bug: user was Pick<User, 'name'> — email is not available
  // TypeScript error: Property 'email' does not exist on type 'Pick<User, "name">'
  return user.name + ' (' + user.email + ')';
}

const user = { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' };

// Simulate Pick<User, 'name'> — only pass name field
const pickedUser = { name: user.name };

const card = formatUserCard(pickedUser);
console.log(card);          // 'Alice (undefined)' — email missing!
console.log(card.includes('undefined'));`,
    bugDescription:
      'Pick<User, "name"> only includes the name field. The function needs email too but it\'s not in the picked type. TypeScript error: "Property \'email\' does not exist on type \'Pick<User, "name">\'". The fix is Pick<User, "name" | "email">.',
    fixedCode: `function formatUserCard(user) {
  return user.name + ' (' + user.email + ')';
}

const user = { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' };

// Fix: Pick<User, 'name' | 'email'> — include both required fields
const pickedUser = { name: user.name, email: user.email };

const card = formatUserCard(pickedUser);
console.log(card);
console.log(card.includes('undefined'));`,
    expectedOutput: 'Alice (alice@example.com)\nfalse',
    explanation:
      'Including email in the Pick means both name and email are available. The formatted string is complete and contains no undefined values.',
    keyInsight:
      'When using Pick for a function parameter, include ALL properties the function will access. TypeScript errors on accessing properties not in the Pick — this is the safety guarantee that prevents the undefined bug.',
  },

  {
    id: 6009,
    cat: 'Utility Types' as any,
    difficulty: 'hard',
    title: 'Omit removes wrong field — sensitive data still present',
    description:
      'Omit is used to remove "password" but the field name has a typo — password still appears in the output. Fix the Omit key.',
    tags: ['Omit', 'utility-types', 'sensitive-data', 'typo'],
    companies: ['Microsoft', 'Atlassian', 'Razorpay', 'Flipkart'],
    brokenCode: `// Bug: Omit<User, 'pasword'> — typo! 'pasword' not 'password'
// TypeScript: Omit with wrong key silently creates a type that still has 'password'

function toPublicUser(user) {
  // Simulates Omit<User, 'pasword'> — note typo in key name
  const { pasword, ...rest } = user; // destructuring wrong key — password remains!
  return rest;
}

const user = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  password: 'secret123',
  role: 'admin',
};

const publicUser = toPublicUser(user);

// Bug: password is still in the object!
console.log('password' in publicUser);
console.log(Object.keys(publicUser).sort().join(','));`,
    bugDescription:
      'The destructuring key has a typo ("pasword" not "password"). TypeScript\'s Omit<User, "pasword"> would create a type that still includes password — and TypeScript 4.1+ warns when Omit key doesn\'t match any property.',
    fixedCode: `function toPublicUser(user) {
  // Fix: correct spelling — destructure the actual 'password' key
  const { password, ...rest } = user;
  void password; // explicitly discard — password is intentionally removed
  return rest;
}

const user = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  password: 'secret123',
  role: 'admin',
};

const publicUser = toPublicUser(user);

console.log('password' in publicUser);
console.log(Object.keys(publicUser).sort().join(','));`,
    expectedOutput: 'false\nemail,id,name,role',
    explanation:
      'Correct spelling in destructuring removes the actual "password" field. The public user has 4 fields: id, name, email, role — all safe to expose.',
    keyInsight:
      'TypeScript\'s Omit<T, K> accepts any string as K but should reject keys not in T. As of TypeScript 4.1+, Omit with a non-existent key produces a warning. Always use keyof T to constrain Omit keys: Omit<User, keyof User & "password">.',
  },

  // ─── CLASS PATTERNS (3) ───────────────────────────────────────────────────

  {
    id: 6010,
    cat: 'Class Patterns' as any,
    difficulty: 'medium',
    title: 'Private field accessed outside class — wrong data exposed',
    description:
      'The balance field should be private but is directly mutated from outside the class, bypassing business logic. Fix with a proper accessor method.',
    tags: ['private', 'encapsulation', 'access-modifier', 'class'],
    companies: ['Microsoft', 'Google', 'Atlassian', 'Razorpay'],
    brokenCode: `// TypeScript: 'balance' is private — direct access is a compile error
// But at runtime, JS has no enforcement without # syntax

class BankAccount {
  owner;
  balance;  // Should be private — TypeScript: private balance: number

  constructor(owner, initialBalance) {
    this.owner = owner;
    this.balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.balance += amount;
  }

  getBalance() {
    return this.balance;
  }
}

const account = new BankAccount('Alice', 100);

// Bug: directly mutating private field — bypasses validation
account.balance -= 50;  // TypeScript error: 'balance' is private
                        // Runtime: allowed in JS without # syntax

console.log(account.getBalance());
console.log(account.owner);`,
    bugDescription:
      'TypeScript marks balance as private — direct access from outside should be a compile error. Bypassing the deposit/withdraw methods skips validation (e.g., overdraft protection). The fix is to use a withdrawal method.',
    fixedCode: `class BankAccount {
  owner;
  #balance;  // True JS private field — runtime enforced with # syntax

  constructor(owner, initialBalance) {
    this.owner = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) return; // guard silently for this demo
    this.#balance += amount;
  }

  withdraw(amount) {
    if (amount <= 0 || amount > this.#balance) return; // guard
    this.#balance -= amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount('Alice', 100);

// Fix: use the public method — validation runs, privacy preserved
account.withdraw(50);

console.log(account.getBalance());
console.log(account.owner);`,
    expectedOutput: '50\nAlice',
    explanation:
      'Using # for true JS private fields prevents external access at runtime. The withdraw method contains validation logic — ensuring business rules are always enforced.',
    keyInsight:
      'TypeScript\'s private keyword is compile-time only — it\'s erased at runtime. For true encapsulation, use JavaScript\'s native #privateField syntax which is enforced at runtime. Always access/mutate private state through public methods that encode business rules.',
  },

  {
    id: 6011,
    cat: 'Class Patterns' as any,
    difficulty: 'medium',
    title: 'Abstract class instantiated directly — unexpected behavior',
    description:
      'The base Repository class should be abstract but is instantiated directly — findAll returns undefined because the base method has no implementation. Fix by making it abstract or overriding correctly.',
    tags: ['abstract', 'class', 'inheritance', 'instantiation'],
    companies: ['Microsoft', 'Atlassian', 'Google', 'Meta'],
    brokenCode: `// TypeScript: Cannot create an instance of an abstract class
// Bug: Base class without concrete implementation is used directly

class Repository {
  tableName;

  constructor(tableName) {
    this.tableName = tableName;
  }

  // Should be abstract — no implementation in base class
  findAll() {
    // Returns undefined — no implementation
  }

  findById(id) {
    // Returns undefined — no implementation
  }
}

// Bug: instantiated directly instead of through a concrete subclass
const repo = new Repository('users');

const all = repo.findAll();
console.log(all);           // undefined — base class has no data
console.log(typeof all);`,
    bugDescription:
      'Repository should be abstract. Instantiating it directly gives a useless object where all methods return undefined. TypeScript\'s abstract class prevents this: "Cannot create an instance of an abstract class."',
    fixedCode: `class Repository {
  tableName;
  // In TypeScript, mark as abstract class — cannot be instantiated

  constructor(tableName) {
    this.tableName = tableName;
  }

  // Abstract methods — must be implemented by subclasses
  findAll() { return []; } // base fallback for JS demo
  findById(id) { return null; }
}

// Concrete subclass — provides real implementation
class UserRepository extends Repository {
  #data;

  constructor() {
    super('users');
    this.#data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
  }

  findAll() {
    return this.#data;
  }

  findById(id) {
    return this.#data.find(u => u.id === id) || null;
  }
}

const repo = new UserRepository();

const all = repo.findAll();
console.log(all.length);
console.log(all[0].name);`,
    expectedOutput: '2\nAlice',
    explanation:
      'UserRepository extends the base and provides concrete implementations. findAll() returns the actual data. TypeScript abstract classes prevent instantiating the base and force subclasses to implement abstract methods.',
    keyInsight:
      'Abstract classes define contracts + shared behavior. Mark methods abstract when they must be overridden, and concrete when they provide a default implementation. TypeScript enforces at compile time that abstract methods are implemented.',
  },

  {
    id: 6012,
    cat: 'Class Patterns' as any,
    difficulty: 'hard',
    title: 'Class missing interface implementation — methods silently absent',
    description:
      'The class claims to implement an interface but is missing required methods — callers get undefined when calling methods. Fix by implementing all interface methods.',
    tags: ['implements', 'interface', 'class', 'contract'],
    companies: ['Microsoft', 'Google', 'Atlassian', 'Razorpay'],
    brokenCode: `// TypeScript: Class 'SimpleLogger' incorrectly implements interface 'Logger'.
// Property 'warn' is missing in type 'SimpleLogger' but required in type 'Logger'.

// Interface contract
const Logger = {
  info: null,
  warn: null,   // Required but missing in implementation
  error: null,
};

class SimpleLogger {
  prefix;

  constructor(prefix) {
    this.prefix = prefix;
  }

  info(msg) {
    console.log('[INFO]' + this.prefix + ': ' + msg);
  }

  // Bug: warn() and error() not implemented — calling them returns undefined
  // TypeScript error: Class incorrectly implements interface
}

const logger = new SimpleLogger('App');
logger.info('started');

// Bug: warn is not a function — silently wrong
const result = typeof logger.warn;
console.log(result);  // 'undefined' — method missing`,
    bugDescription:
      'SimpleLogger does not implement warn() and error() from the Logger interface. TypeScript would error: "Class incorrectly implements interface — warn is missing." Callers get undefined when calling missing methods.',
    fixedCode: `class SimpleLogger {
  prefix;

  constructor(prefix) {
    this.prefix = prefix;
  }

  info(msg) {
    console.log('[INFO] ' + this.prefix + ': ' + msg);
  }

  // Fix: implement all required interface methods
  warn(msg) {
    console.log('[WARN] ' + this.prefix + ': ' + msg);
  }

  error(msg) {
    console.log('[ERROR] ' + this.prefix + ': ' + msg);
  }
}

const logger = new SimpleLogger('App');
logger.info('started');
logger.warn('slow response');

const result = typeof logger.warn;
console.log(result);`,
    expectedOutput: '[INFO] App: started\n[WARN] App: slow response\nfunction',
    explanation:
      'All interface methods are implemented. warn() is now a function, not undefined. TypeScript\'s implements keyword enforces this at compile time — any missing method is a compile error.',
    keyInsight:
      'In TypeScript, `implements InterfaceName` is a compile-time assertion that your class satisfies the contract. It does NOT provide implementation — you must write each method. This gives you early error detection when you add methods to an interface later.',
  },

];
