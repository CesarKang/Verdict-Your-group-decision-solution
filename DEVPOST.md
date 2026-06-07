# Verdict — Devpost Submission Copy

Use the sections below when filling in the Devpost form. All descriptions match the **live interactive demo** at https://verdict-your-group-decision-solutio.vercel.app/ (no video required).

---

## Tagline (max ~60 chars)

Turn stalled group chats into one fair decision.

---

## Inspiration

Every time we tried to plan something with friends, the group chat would spiral.

Not because nobody cared — because nobody wanted to be the one who decided.

Everyone says "I'm easy." Everyone says "you choose." But somehow, nothing happens.

We found three psychological phenomena that explain exactly why group chats get stuck:

- **Decision Fatigue** — everyone is too cognitively drained to evaluate options
- **The Abilene Paradox** — people hide what they actually want to avoid conflict
- **Diffusion of Responsibility** — everyone assumes someone else will sort it out

No poll, vote, or scheduling tool touches the real issue: the social pressure around deciding.

Verdict is built to turn messy group chat energy into one clear decision that feels fast, fair, and low-pressure.

Zymix is not just where close friends coordinate. It is where groups are still forming, which makes low-pressure decision-making especially important.

---

## What It Does

Verdict is an AI agent native to Zymix group chats.

**Try the live demo:** https://verdict-your-group-decision-solutio.vercel.app/

1. A user **selects any message** in a stalled conversation and taps the **✦ @Verdict** chip
2. Verdict reads the thread from that anchor forward, inferring explicit preferences, implicit signals, and hard constraints from each person's chat behavior and Profile
3. The triggering user optionally adds **per-event preferences** in a private sheet (vibe, budget, location, time — leave any field blank for *no strong preference*)
4. Verdict returns a **Decision Card**: venue, vibe, time, key constraints, and a one-line rationale
5. The user **Confirms** the plan, then optionally **Share Location** or types **`@Verdict split bill`** to trigger a mocked group collection flow

Each user can open **Verdict Profile** from Zymix's native **`+` menu** → **Verdict**:

- **Personal profile** — stable habits (punctuality, area preference, vibe)
- **Hard limit** — non-negotiables (dietary, alcohol, budget ceiling)
- **Allow real-time chat reading** — when enabled, a privacy notice appears in the group chat

The AI brings profile context in silently, so users do not fill out a new form every time they make a plan.

**More info** on the Decision Card expands to show inferred **group habits**, collapsible **personal preferences** per member, and **hard limits respected**.

---

## How We Built It

We anchored every decision to the real Zymix interface: the `+` attachment menu, message selection, Location sharing, and Split Bill.

Verdict had to feel native, not bolted on.

**Stack:** React 19, TypeScript, Vite, Tailwind CSS 4

**Architecture:**

- Seeded group chat dataset modelling a real London university friend group (four members with named messages)
- Fixed activity dataset with student-friendly London venues, tagged by vibe, dietary fit, capacity, budget, and latecomer-friendliness
- Deterministic scenario engine for demo stability: reading → preference collection → final card → confirm → location / split bill
- Optional live AI layer via OpenAI-compatible APIs (including Zhipu GLM preset) for unstructured chat → structured JSON verdict generation, with seeded fallback when no API key is configured
- Single-screen Zymix-skin UI rendering the Decision Card back into the chat

The deterministic layer keeps the public demo reliable. The AI layer handles preference inference, constraint reasoning, and verdict generation when live mode is enabled.

---

## Challenges We Ran Into

**Keeping it simple.** Every edge case tempted us to add another input, another screen, another option. We kept cutting back to the single killer journey: select message → `@Verdict` → optional preferences → Decision Card → confirm → location / split bill.

One path. No dead ends.

**Knowing what not to ask.** The product only works if triggering it feels like less effort than continuing the spiral. That constraint ruled out onboarding-heavy flows, repeated preference surveys, and anything that front-loads friction before the AI has demonstrated its value.

**AI output reliability.** We used careful prompt design, strict JSON output requirements, and seeded fallback handling so judges always get a working demo even without an API key.

**Demo vs. story alignment.** We initially described a two-step "direction then feedback" flow used in internal pitch recordings. The public demo uses a single preference sheet instead — we rewrote our submission copy to match what users actually click through.

---

## Accomplishments That We're Proud Of

- The **message-anchor trigger**: zero new gestures, living entirely inside existing Zymix chat behavior
- The **Profile architecture**: lightweight personal habits and hard limits that improve decisions without re-asking every time
- **Privacy-aware design**: optional real-time reading toggle with an in-chat notice when enabled
- The **psychological framing**: Decision Fatigue, the Abilene Paradox, and Diffusion of Responsibility give a clear answer to every "why not just use a poll?" question
- **Group habit inference** and **re-roll** ("Someone's not feeling it") built into the Decision Card
- Closing the loop natively into **Location** and **Split Bill**, turning social coordination into real-world action

---

## What We Learned

The hardest design decision was the framing, not the feature.

"AI picks a restaurant" is forgettable.

"AI turns messy group preferences into one decision that feels fair" is the actual value proposition.

We also learned that the most important UX question is not *what should we show*, but *what should we never ask*.

Every removed prompt is a removed barrier.

---

## What's Next for Verdict

- **Deeper group habit memory**: infer patterns across multiple events, not just the current thread
- **Proactive nudges**: surface stalled decisions before someone has to quote a message manually
- **Real Split Bill integration**: connect to Zymix's native payment layer once the wallet supports it
- **Expanding to other coordination jobs**: holiday planning, group gift decisions, and flat scheduling

---

## Built With

- react
- typescript
- vite
- tailwindcss

---

## Links for Devpost form

| Field | URL |
|-------|-----|
| **Demo** | https://verdict-your-group-decision-solutio.vercel.app/ |
| **GitHub** | https://github.com/CesarKang/Verdict-Your-group-decision-solution |

---

## 30-second judge walkthrough (for team reference)

1. Open live demo → scroll the stalled "the squad" chat (note member names on bubbles)
2. Tap Rachel's first message → tap **✦ @Verdict**
3. Submit preferences (try budget `under £20`, or leave all blank)
4. Expand **More info** on the Decision Card → group habits + personal preferences
5. **Confirm** → **Share Location** → type `@Verdict split bill` → request group collection
6. Optional: **`+` → Verdict** → fill profile → toggle **Allow real-time chat reading** → see privacy notice in chat
