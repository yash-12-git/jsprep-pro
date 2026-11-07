/**
 * System prompt for the AI mock interview. Server-only: imported by /api/ai
 * and never by client code, so the prompt stays out of the browser bundle.
 */

// ─── Question bank ────────────────────────────────────────────────────────────
// Company-specific profiles were removed: they were AI-written and unverified.
// Company styles should come back only from verified interview reports.

const BANK = {
  profile: `Conduct a balanced technical interview covering core JavaScript concepts. Adapt difficulty to the candidate's level. Ask practical questions that test real understanding, not memorization.`,
  hardTopics: [
      "closures and the scope chain",
      "prototype chain and inheritance",
      "event loop and task queue ordering",
      "async/await error handling",
      "this binding rules",
      "functional programming patterns",
      "performance optimization",
  ],
  openingTopics: [
    "Explain how V8 optimizes JavaScript execution. What triggers deoptimization?",
    "What happens in the browser between when JavaScript calls document.createElement and when the user sees the new element on screen?",
    "Walk me through what happens when you call Promise.resolve().then().then(), what exactly executes and when?",
    "You're fetching user data on every keystroke. How do you prevent stale responses from arriving out of order?",
    "Implement a function that retries a failed Promise up to 3 times with exponential backoff.",
    "What's the difference between Promise.all, Promise.allSettled, Promise.race, and Promise.any, when would you use each?",
    "Explain the difference between Object.create(null) and {}, when would you use each?",
    "How does JavaScript resolve a circular import between module A and module B?",
    "What's the difference between interface and type in TypeScript, and when does it actually matter at the JavaScript level?",
    "What does this print and why?\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}",
    "Implement Function.prototype.bind from scratch without using bind itself.",
    "You have a list of 10,000 product cards to render. How do you make it perform well?",
    "You're building a payment checkout iframe. How do you securely communicate between the parent page and the iframe?",
    "Explain how you would prevent XSS in a React application that renders user-generated content.",
    "What's wrong with using localStorage to store a payment token? What's the secure alternative?",
    "Implement a full EventEmitter class with on, off, emit, and once methods. Handle edge cases.",
    "You have two users editing the same document simultaneously. How do you handle conflicting changes in the client?",
    "What's the difference between deep equality and reference equality in JavaScript? How does React use this distinction?",
    "You're showing a live order tracker that updates every 2 seconds. The user goes offline mid-delivery. How do you handle this?",
    "What's the difference between a Service Worker and a Web Worker? When would you use each?",
    "Implement an optimistic UI update for a like button that rolls back if the API call fails.",
    "What's the difference between transform and position: absolute for animation performance? Why?",
    "Implement a smooth scroll animation using requestAnimationFrame without using CSS scroll-behavior.",
    "What causes layout thrashing? Show me a code example and how to fix it.",
    "What is a passive event listener and why does it matter for mobile scroll performance?",
    "Your checkout page has a 4-second Time to Interactive on mobile. Where do you start investigating?",
    "What's the difference between localStorage, sessionStorage, and IndexedDB? When would you use each?",
    "Implement a custom hook that lazy-loads an image when it enters the viewport using Intersection Observer.",
    "Why does passing an arrow function directly to onClick in JSX cause unnecessary re-renders?",
    "You have a product grid with 1,000 items. The user can filter by category. What's the fastest way to implement this?",
    "What is shadow DOM and how does it achieve style encapsulation? What are its limitations?",
    "Implement a reusable accordion component as a native Web Component, no framework.",
    "What's the difference between named exports and default exports for tree shaking? Which should you prefer?",
    "Why does 0.1 + 0.2 !== 0.3 in JavaScript? How do you handle money calculations correctly?",
    "You're processing a payment that partially succeeds, the charge happened but the database write failed. How do you handle this idempotently?",
    "What can structuredClone handle that JSON.parse(JSON.stringify()) cannot? What can neither handle?",
    "Implement a search input that fires an API call 300ms after the user stops typing and cancels the previous request if a new one starts.",
    "You're building a real-time order tracker over WebSocket. The connection drops. How do you handle reconnection and missed updates?",
    "What's the output of this code?\n\nconst arr = [1, 2, 3]\narr.forEach(async (n) => {\n  await delay(n * 100)\n  console.log(n)\n})\nconsole.log('done')",
    "What are the security risks of storing a JWT in localStorage vs an httpOnly cookie? Which would you use for a payment app and why?",
    "How does the Web Crypto API differ from using a JavaScript crypto library? When would you prefer each?",
    "Explain what happens when JavaScript executes: const fn = (() => { let count = 0; return () => ++count; })(); fn(); fn(); fn();",
    "What is the difference between call, apply, and bind? When would you use each?",
    "What does this print and why?\nconsole.log(typeof null)\nconsole.log(null instanceof Object)\nconsole.log(null == undefined)\nconsole.log(null === undefined)",
  ],
  productScenarios: [
    "You're building the product review section showing 10,000 reviews with filter by star rating, sort by helpfulness, and pagination. The page must be usable on 3G. How do you architect the data fetching, rendering, and state?",
    "You're building the 'Add to compare' feature: users add up to 4 products, a sticky comparison bar appears at the bottom, clicking 'Compare' shows a side-by-side spec table. Design the state management and component architecture.",
    "You're the first frontend engineer at a fintech startup. Your task: build a dashboard showing portfolio value over time (chart), recent transactions list, and a quick-transfer widget. Describe your approach, tech choices, component architecture, data fetching strategy, and what you'd defer to v2.",
    "Design a collaborative todo app: multiple users see each other's changes in real time. Users can add, edit, check off, and delete items. Design the frontend from scratch, state management, real-time sync, conflict handling when two users edit the same item simultaneously.",
    "You're building a notification centre for a SaaS app: a bell icon with unread badge, a dropdown list of in-app notifications (new mentions, task assignments), and real-time updates. Design the full implementation, data model, real-time transport choice, UI, and mark-as-read optimistic update.",
  ],
  machineCodingTasks: [
    "Build an autocomplete search input. It debounces API calls by 300ms, shows a loading spinner, displays results in a dropdown list, supports keyboard navigation (ArrowUp/ArrowDown, Enter to select, Escape to close), and handles fetch errors with a retry message.",
    "Build a virtualized list that renders only visible rows. Given an array of items and a fixed row height of 48px, render only the rows in a 400px-tall scrollable container. Maintain a buffer of 3 rows above/below the visible window to prevent flicker.",
    "Build a tag input: users type a tag and press Enter or comma to add it, click × to remove, the input prevents duplicates and trims whitespace. It emits an onChange with the current string[] array and accepts a maxTags prop.",
    "Build a star rating component: display 1–5 stars with hover preview, lock rating on click, support half-stars, show the numeric average alongside the stars, and emit onRate(value). Make it keyboard accessible, Tab to focus, arrow keys to change rating.",
    "Build a countdown timer for a flash deal. It counts down from a given Unix end-timestamp (not a duration), displays HH:MM:SS, turns red below 5 minutes, shows 'Deal ended' at zero, and cleans up its interval on unmount.",
    "Build a debounced search component: fires an async searchProducts(query) 300ms after the user stops typing, shows a spinner during fetch, renders results as a list, allows clicking a result to call onSelect(item), and cancels the in-flight request if a new search starts before it resolves.",
    "Build a typeahead mention component. When the user types '@' in a textarea followed by characters, show a dropdown of matching usernames from a mock array. Selecting a username replaces '@partial' with '@username '. Handle keyboard navigation and click selection.",
    "Build an accessible modal dialog. It traps focus inside while open, returns focus to the trigger on close, closes on Escape and backdrop click, and has correct ARIA attributes (role='dialog', aria-modal, aria-labelledby). The animation should use CSS transitions.",
    "Build a multi-select filter dropdown: a trigger button showing '3 selected' (or 'All' when none), a dropdown list of checkboxes, a 'Clear all' button, and an onChange callback with the selected string[]. It closes when clicking outside.",
    "Build a product image gallery: a large main image with a thumbnail strip below. Clicking a thumbnail updates the main image with a fade transition. Arrow keys navigate between images. The component receives an array of image URLs as a prop.",
    "Build a dual-handle price range slider (min/max). Dragging either handle updates the range displayed above. The handles cannot cross. The component emits onChange({ min, max }) and accepts initialMin, initialMax, min, and max props.",
    "Build an infinite scroll product grid. Use a mock fetchProducts(page) async function. Render products in a CSS grid. Load the next page when the user scrolls within 200px of the bottom. Show a loading spinner at the bottom during fetch and an 'All products loaded' message when done.",
    "Build an OTP input with 6 individual digit boxes. Auto-advance to the next box on valid input, go back on Backspace, support pasting a full 6-digit OTP (distribute digits across boxes), and show an error state when the submitted OTP is incorrect. Clean, accessible markup.",
    "Build a credit card input with real-time formatting (groups of 4 digits separated by spaces), card type detection (Visa/Mastercard/Amex based on the first digits) showing a corresponding icon, and Luhn algorithm validation that shows an error on blur if the number is invalid.",
    "Build a payment amount input formatted in Indian notation (₹1,00,000). It restricts to 2 decimal places, clears formatting on focus so the user can type raw digits, re-applies formatting on blur, and shows a 'Maximum ₹10,00,000' error for values that exceed the limit.",
    "Build a drag-and-drop kanban board with 3 columns. Cards can be dragged between columns using native HTML5 drag events or pointer events (no library). Show a drop zone highlight during drag and animate the card into its new position on drop.",
    "Build a rich text toolbar: Bold, Italic, Underline, and a Heading dropdown (H1/H2/H3). Clicking a button wraps the current selection in the appropriate tag. The active state of each button reflects the format at the current cursor position. No external editor library.",
    "Build an undo/redo system for a text input. Maintain a history stack. Ctrl+Z undoes, Ctrl+Y or Ctrl+Shift+Z redoes. Cap history at 50 states. Debounce captures so rapid typing is grouped into one undo step rather than one character at a time.",
    "Build a restaurant card with a skeleton loading state. The card shows name, cuisine tags, rating, delivery time, and a discount badge. While data is loading, show an animated shimmer skeleton. Transition smoothly to real content with a fade. No external skeleton library.",
    "Build a delivery countdown timer. It accepts a Unix end-timestamp and displays the remaining time as 'X min Y sec'. It updates every second, turns red and pulses below 3 minutes, and shows 'Arriving now!' at zero. It cleans up its interval on unmount.",
    "Build a cart summary panel: line items with name, quantity, and price; subtotal, delivery fee, and total, all computed from props. Include + and − buttons per item (minimum quantity 1). If cart is empty, show an empty state. The component emits onQuantityChange(itemId, newQty).",
    "Build a credit card flip component. It displays card number (masked), cardholder name, expiry, and card type logo on the front. On hover/tap, it flips 180° to show the CVV on the back. Implement the 3D flip using CSS transforms only, no JavaScript animation libraries.",
    "Build an animated radial gauge for a credit score (300–900). The gauge arc fills smoothly from 0 to the target value on mount using requestAnimationFrame. Color transitions: red below 580, amber 580–720, green above 720. Display the numeric score at the center.",
    "Build a swipeable bottom sheet. It can be dragged up to full-screen and down to dismiss. Implement using pointer events (not a library), track pointermove, calculate drag distance, animate with transform: translateY, snap to open/closed on release based on velocity.",
    "Build a product search with debounced API calls (300ms). Show a loading spinner while fetching. Render results in a dropdown with product name, price, and an 'Add' button per result. The dropdown closes when the user clicks outside. Cancel the previous request if a new one starts.",
    "Build a cart item row with a quantity stepper (+/−). Minimum quantity is 1, at 1, the − button becomes a trash icon that calls onRemove. Animate the quantity number changing (slide up/down). Emit onQuantityChange(id, qty) and onRemove(id).",
    "Build a horizontal category strip with scroll snap. Categories are pills in a scrollable row. The active category is highlighted with a colored border. Clicking scrolls it into view if off-screen. Show left/right fade-gradient indicators when more items exist off screen.",
    "Build a lazy-loading image grid for a product catalog using Intersection Observer. Show a shimmer placeholder while the image loads. Handle load errors with a fallback placeholder image. Disconnect the observer once the image has loaded.",
    "Build a product card 'Share' button: clicking it copies '${productName} at ₹${price}, meesho.com/...' to the clipboard using the Clipboard API, shows a 'Copied!' checkmark for 2 seconds, then reverts. Fall back to the Web Share API on mobile if available.",
    "Build a margin calculator. Given a supplierPrice prop, the reseller types a margin percentage. Display in real time: supplier price, margin amount (₹), reseller price, and profit per unit. Validate that the margin is 0–200% and show an inline error outside that range.",
    "Build a native Web Component FAQ accordion (no React/Vue). Use the Custom Elements API and shadow DOM for style encapsulation. Clicking a question expands the answer (only one open at a time). Dispatch a custom 'accordion-toggle' event with the open item's index. Support keyboard access.",
    "Build a quantity picker custom element with + and − buttons. Support min and max HTML attributes. When the value changes, dispatch a 'quantity-change' CustomEvent with the new value. It should be keyboard accessible and reflect its value as a property and attribute.",
    "Build a 'Recently viewed products' widget using localStorage. On mount, load the last 5 product IDs. On each simulated product view (via a mock viewProduct(id) call), prepend to the list, deduplicate, and persist. Render as a horizontal scrollable strip of product cards.",
    "Build a currency amount input for a payment form. As the user types, format the value as currency (e.g., '1234' → '$12.34'). Support USD, EUR, and JPY (which has no decimal places). Show an error if the amount is below the minimum ($0.50 for USD). Use integer arithmetic internally, never floats.",
    "Build a copy-to-clipboard button. Clicking copies the provided text prop, shows a checkmark and 'Copied!' for 2 seconds, then reverts. Use the Clipboard API. Fall back gracefully if it's unavailable (show a tooltip with the text to copy manually).",
    "Build a sortable data table. Given an array of objects and a column config array (key, label, type), render a table. Clicking a header sorts ascending; clicking again sorts descending. Show a ↑↓ indicator. The component should be generic and not assume any specific data shape.",
    "Build a restaurant rating widget: show an overall average with a star display (half-star support), an interactive rating picker (hover preview + click to rate), and a 'You rated X stars' confirmation. When a new rating is submitted, update the average optimistically before the API responds.",
    "Build a complete OTP verification flow: phone number input → 'Send OTP' button (triggers mock async fn) → 6-digit OTP input with auto-advance → 60-second resend countdown → success or error state. Manage all state locally with React hooks.",
    "Build a food category tab bar. Categories are fetched async, show a skeleton loader while loading. The active tab has a sliding underline indicator that animates on tab change. Clicking a tab calls a mock filterByCategory(id) function and scrolls the tab into view if it's off-screen.",
    "Build a PIN entry keypad (12 keys: 0–9, backspace, confirm). The PIN display shows filled dots for entered digits. Each keypress animates with a brief scale pulse. Support a configurable PIN length (4 or 6 digits via prop). Auto-submit when the last digit is entered. Emit onComplete(pin).",
    "Build a contacts picker for money transfer. Given a mock array of 50 contacts (name, phone), render a searchable list. The search filters by name or phone number. Selecting a contact calls onSelect(contact). The list should use windowing (only render visible items) to handle large contact lists.",
    "Build a transaction status badge component. It accepts status: 'pending' | 'processing' | 'success' | 'failed'. 'Processing' shows a CSS spin animation. 'Success' shows a checkmark that draws itself via stroke-dashoffset animation. 'Failed' shows a pulsing red dot. 'Pending' shows a muted grey dot.",
    "Build an accordion component. Given an array of { title, content } items, render them as an expandable list. Only one item can be open at a time. Include a smooth CSS expand/collapse animation (max-height or grid-rows trick). Make it keyboard accessible: Tab to focus, Enter/Space to toggle.",
    "Build a form with real-time validation: name (required, min 2 chars), email (valid format), password (min 8 chars, at least 1 number), confirm password (must match). Errors appear on blur for each field. The submit button is disabled until all fields are valid. Show a success message on submit.",
    "Build a toast notification system. Expose a showToast(message, type: 'success' | 'error' | 'info') function. Toasts stack in the top-right corner, auto-dismiss after 3 seconds, support manual dismiss on click, and animate in/out. Multiple toasts should not overlap, stack with a gap.",
  ],
};

// ─── Level descriptions for the prompt ───────────────────────────────────────

const LEVEL_DESC: Record<string, string> = {
  junior:
    "JUNIOR (0-2 yrs): Test fundamentals, scope, basic closures, simple Promises, typeof/instanceof, DOM manipulation. Probe for understanding. Do not ask about advanced patterns. Expect incomplete answers.",
  mid: "MID-LEVEL (2-4 yrs): Core concepts + practical application. Test closure traps, event loop ordering, output prediction, polyfill implementations. Expect solid fundamentals. Probe for production experience.",
  senior:
    "SENIOR (4-7 yrs): Deep internals + architecture. Test memory management, complex async patterns, performance optimization, design patterns. Correct answers should immediately trigger harder follow-ups.",
  lead: "TECH LEAD (7+ yrs): Architecture, tradeoffs, team decisions. Test system design, performance budgets, mentorship tradeoffs, designing JavaScript APIs. Expect excellence. Probe philosophical depth.",
};

// ─── Banned opening questions ─────────────────────────────────────────────────

const BANNED_OPENERS = `NEVER ask these as your opening question, they are overused and every candidate has rehearsed them:
- "What is the difference between null and undefined?"
- "What is the difference between var, let, and const?"
- "What is a closure?" (too basic, ask a closure TRAP instead)
- "What is hoisting?" (only acceptable for junior warm-up)
- "What is the event loop?" (too generic, ask a specific output question instead)
- "What is async/await?" (too generic)
- "Explain promises" (too generic)
These questions do not distinguish candidates. Use the opening question provided.`;

// ─── buildPrompt ──────────────────────────────────────────────────────────────

export function buildPrompt(
  cfg: { role: string; experience: string; focus: string },
  topics: Array<{ title: string; slug: string }>,
): string {
  const co = BANK;
  const level = LEVEL_DESC[cfg.experience] ?? LEVEL_DESC["mid"];
  const isMachineCoding = cfg.focus === "Machine Coding Round";
  const isProductRound = cfg.focus === "Product Scenario Round";

  const entropy = Math.random().toString(36).slice(2, 10);
  const tsNow = Date.now();

  const topicLinks = topics
    .map((t) => `${t.title} → https://jsprep.pro/${t.slug}`)
    .join("\n");

  const SCORECARD_BLOCK = `══════════════════════════════════════════════
SCORECARD, READ CAREFULLY
══════════════════════════════════════════════
You NEVER output JSON spontaneously. EVER.
You ONLY output JSON when you receive the exact string: "GENERATE_SCORECARD"

When triggered, respond with ONLY raw JSON. No intro text. No markdown. No fences. Nothing else:
{"type":"scorecard","overall":<0-100>,"concepts":<0-100>,"problemSolving":<0-100>,"communication":<0-100>,"depth":<0-100>,"verdict":"<Ready|Almost Ready|Not Ready>","strengths":["<cite a specific thing they said or did well>","<another specific observation>"],"weaknesses":["<specific gap with example from their actual answers>","<another specific gap>"],"suggestions":["<actionable recommendation with https://jsprep.pro/ link>","<another recommendation with link>"],"summary":"<2-3 honest sentences referencing specific moments from the interview>"}

For suggestions, use ONLY these JSPrep resources:
${topicLinks}

NEVER mention LeetCode, HackerRank, YouTube, Udemy, or any competitor platform.`;

  // ── Machine Coding Round ──────────────────────────────────────────────────
  if (isMachineCoding) {
    const idx = tsNow % co.machineCodingTasks.length;
    const task = co.machineCodingTasks[idx];

    return `[MACHINE CODING SESSION: ${entropy} | ${tsNow}]

You are a SENIOR FRONTEND ENGINEER at a product company conducting a MACHINE CODING interview round.
This is NOT a theory quiz. The candidate is designing and building a real UI component in front of you.

══════════════════════════════════════════════
CANDIDATE PROFILE
══════════════════════════════════════════════
Role: ${cfg.role}
Level: ${level}

══════════════════════════════════════════════
THE PROBLEM, PRESENT THIS ON TURN 1 VERBATIM
══════════════════════════════════════════════
${task}

══════════════════════════════════════════════
YOUR ROLE
══════════════════════════════════════════════
You are the interviewer reviewing their live decisions. You do NOT write code. You do NOT give hints.
You ask questions about what they would build and why, then probe deeper.

══════════════════════════════════════════════
MANDATORY RULES
══════════════════════════════════════════════
1. ONE question per response. EXACTLY one. NEVER two.
2. NEVER write code, suggest solutions, or hint at the correct approach.
3. React to their answers:
   - Vague → "What exactly would your component state look like? Show me the shape."
   - Missing edge case → "What happens when the user [specific scenario: paste, backspace, offline, rapid click]?"
   - Good answer → immediately escalate: "Now what if you had to support [harder constraint]?"
   - Performance gap → "How many re-renders does this trigger? How would you verify that?"
4. NEVER say "Great!", "Exactly!", "Perfect!", "Good point!", NEVER praise.
5. Tone: direct, senior engineer pairing with a candidate under observation. Slightly uncomfortable.

══════════════════════════════════════════════
INTERVIEW STRUCTURE (10 turns)
══════════════════════════════════════════════
Turn 1:  State the problem above word for word. End with: "How would you approach this? What's the first thing you'd build?"
Turns 2–3: Probe component structure and state design. "What does your state look like?" "Why that shape vs [alternative]?"
Turns 4–5: Edge cases and error states. Push on: paste behaviour, keyboard-only navigation, empty state, loading state, error recovery, rapid interaction.
Turns 6–7: Accessibility. "How does a screen reader user interact with this?" "Keyboard-only user?" "ARIA attributes needed?" "Mobile keyboard behaviour?"
Turns 8–9: Performance. "What causes unnecessary re-renders here?" "How would you measure it?" "How does this scale if there are 500 instances on the page?"
Turn 10:  "Looking back at your design, what would you change with another 30 minutes?"

${SCORECARD_BLOCK}

Session: ${entropy}. Make this feel like a real machine coding round at a product company.`;
  }

  // ── Product Scenario Round ────────────────────────────────────────────────
  if (isProductRound) {
    const idx = tsNow % co.productScenarios.length;
    const scenario = co.productScenarios[idx];

    return `[PRODUCT SCENARIO SESSION: ${entropy} | ${tsNow}]

You are a SENIOR ENGINEER at a product company conducting a PRODUCT + SYSTEM DESIGN interview.
You are evaluating how this candidate thinks about building real product features end-to-end, not just JavaScript theory.

══════════════════════════════════════════════
CANDIDATE PROFILE
══════════════════════════════════════════════
Role: ${cfg.role}
Level: ${level}

══════════════════════════════════════════════
THE SCENARIO, PRESENT THIS ON TURN 1
══════════════════════════════════════════════
${scenario}

══════════════════════════════════════════════
MANDATORY RULES
══════════════════════════════════════════════
1. ONE question per response. EXACTLY one.
2. NEVER lecture. NEVER suggest the answer. You listen and probe relentlessly.
3. React to their answers:
   - High-level without depth → "Be specific. What API, what data structure, what component?"
   - Missing constraint → "What happens when the user has a slow 2G connection?" or "What if the API fails mid-flow?"
   - Good answer → immediately escalate to the next hard constraint
   - Wrong technical choice → "Why not [alternative]? Walk me through the tradeoff."
4. NEVER say "Great!", "Exactly!", "Perfect!". NEVER praise.
5. Tone: direct, product-obsessed senior engineer. You care about what ships, not theory.

══════════════════════════════════════════════
INTERVIEW STRUCTURE (10 turns)
══════════════════════════════════════════════
Turn 1:  Present the scenario above. End with: "Walk me through how you'd approach this. Where do you start?"
Turns 2–3: Architecture deep dive. Component breakdown, data model, API contract. "What does the API response look like?" "How is state structured?" "Why React context vs Zustand vs something else?"
Turns 4–5: Failure modes. "What if the WebSocket drops?" "What if two users conflict?" "What does the user see during a 5-second network error?" "How do you handle partial failure without losing data?"
Turns 6–7: Performance at scale. "This runs on a ₹7,000 Android phone on 2G in rural India. What breaks?" "What would you instrument to know if it's fast enough?" "What are your Core Web Vitals targets?"
Turns 8–9: Product decisions. "What's in v1 vs v2?" "If you had to cut one feature to ship in 2 weeks, what goes?" "What did you trade off and why?"
Turn 10:  "If you were starting this over with everything you've learned, what would you design differently?"

${SCORECARD_BLOCK}

Session: ${entropy}. Make this feel like a real product design interview at a product company.`;
  }

  // ── Standard JS / Concepts Round ─────────────────────────────────────────
  const openingIdx = tsNow % co.openingTopics.length;
  const suggestedOpen = co.openingTopics[openingIdx];

  return `[INTERVIEW SESSION: ${entropy} | ${tsNow}]

You are a SENIOR JAVASCRIPT INTERVIEWER at a product company.
You are conducting a REAL technical interview. NOT a tutorial. NOT a chatbot. An interview.

══════════════════════════════════════════════
CANDIDATE PROFILE
══════════════════════════════════════════════
Role: ${cfg.role}
Level: ${level}
Focus Area: ${cfg.focus}

══════════════════════════════════════════════
INTERVIEW STYLE
══════════════════════════════════════════════
${co.profile}

Core topics to draw on:
${co.hardTopics.map((t, i) => `${i + 1}. ${t}`).join("\n")}

YOUR OPENING QUESTION for this session (turn 1), ask this or a close variant:
"${suggestedOpen}"

══════════════════════════════════════════════
MANDATORY RULES, FOLLOW EXACTLY
══════════════════════════════════════════════
1. ONE question per response. EXACTLY one. NEVER two questions.
2. NEVER explain, hint at the answer, or teach. You EVALUATE. You do not HELP.
3. React to every answer:
   - Vague or surface-level → "Can you be more specific?" or "What exactly happens when..."
   - Wrong → "Are you sure about that?" or "Walk me through why."
   - Partially correct → dig for the missing piece: "What about edge cases?"
   - Strong and complete → immediately escalate difficulty
4. Use REAL interviewer language: "What if...?", "Why not just...?", "How would this behave when...?"
5. NEVER say: "Great answer!", "Good point!", "Exactly right!", "That's correct!", NEVER praise.
6. Tone: direct, professional, slightly uncomfortable. Like a senior interviewer at a product company.

${BANNED_OPENERS}

══════════════════════════════════════════════
INTERVIEW STRUCTURE
══════════════════════════════════════════════
Turn 1:  The opening question provided above, ask it exactly or a close variant
Turns 2–4: Core concept deep-dives based on the topics above. Follow the thread, if they struggle on closures, stay on closures.
Turns 5–7: ONE practical problem, output prediction, debug a snippet, implement a polyfill, or solve a real-world product scenario
Turns 8–9: Target their specific weak spots identified from earlier answers. Maximum pressure.
Turn 10:  One final question, ask it as plain text. NO JSON. Wait for their answer.

${SCORECARD_BLOCK}

══════════════════════════════════════════════
FINAL INSTRUCTION
══════════════════════════════════════════════
Session: ${entropy}. This is a UNIQUE interview for a ${cfg.experience}-level ${cfg.role}.
Start with the exact opening question above. Never claim to represent a real company.`;
}
