# Verdict — Your Group Decision Solution

**Verdict** is an AI agent for Zymix group chats. When a plan stalls, it reads the thread, weighs what everyone actually wants, and returns one **Decision Card** — so nobody has to be the reluctant decider.

**Live demo:** https://verdict-your-group-decision-solutio.vercel.app/

*Concept demo · not affiliated with Zymix*

---

## Walkthrough — what you'll see in the UI

Open the demo on desktop or mobile. You land in **the squad**, a four-person group chat where Saturday plans have gone nowhere. Each message shows the sender's name (Fangzhe, Rachel, Ac, Sam).

### Main flow (~2 min)

| Step | What to do | What happens |
|------|------------|--------------|
| **1** | Tap any message in the chat (e.g. Rachel's *"ok so saturday??"*) | The message highlights; a **✦ @Verdict** chip appears above it |
| **2** | Tap **✦ @Verdict** | Verdict reads the thread from that message forward |
| **3** | In the **Add your preferences** sheet, fill any fields you like — or leave them all blank | Only you see this form. Blank = *no strong preference* |
| **4** | Tap **Submit preferences** | A **Decision Card** appears in the chat: venue, vibe, budget, time, constraints |
| **5** | Tap **More info** on the card (optional) | Expands to show the decision rationale, inferred **group habits**, per-member **personal preferences**, and **hard limits respected** |
| **6** | Tap **Confirm** | Locks the plan |
| **7** | Tap **Share Location** | A map preview card appears for the chosen venue |
| **8** | Type **`@Verdict split bill`** in the message box and send | Opens the split sheet → tap **Request from group** → a **Group collection** card shows the per-person amount |

Tap **↻ Reset demo** in the top bar anytime to start over.

### Verdict Profile (`+` menu)

Tap **`+`** next to the message box → **Verdict** (last tile in the attachment grid):

- **Personal profile** — stable habits, e.g. *Usually 15–20 min late, prefer chill spots*
- **Hard limit** — non-negotiables, e.g. *vegetarian only, no alcohol*
- **Allow Verdict to read chat history in real-time** — when turned on, a privacy notice is pinned in the chat timeline

### Other things to try

- **Someone's not feeling it** — re-roll the verdict with a reason; Verdict returns an alternate plan
- **⚙️** in the header — switch to live AI mode (requires API key; seed mode works out of the box)

---

## Live Demo

**https://verdict-your-group-decision-solutio.vercel.app/**

---

## Why Verdict?

Group chats stall for social reasons, not information reasons:

| Phenomenon | What happens in chat |
|------------|----------------------|
| **Decision Fatigue** | Everyone's too tired to evaluate options |
| **Abilene Paradox** | People hide what they want to avoid conflict |
| **Diffusion of Responsibility** | Everyone waits for someone else to decide |

Polls and schedulers don't fix the pressure of *being the one who picks*. Verdict does.

---

## How it works

```
Select message → ✦ @Verdict → [optional preference sheet] → Decision Card → Confirm → Location / Split bill
```

| Layer | Role |
|-------|------|
| **Chat anchor** | Verdict reads from the selected message forward |
| **Member inference** | Preferences extracted from chat + Verdict Profile |
| **Venue dataset** | Student-friendly London options with tags (vibe, diet, budget, lateness) |
| **Decision Card** | One venue, rationale, constraints, native next actions |
| **Seed / Live AI** | Seeded verdicts for reliable demo; optional GLM/OpenAI live mode |

---

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4
- **AI (optional):** OpenAI-compatible API — Zhipu GLM preset included
- **Deploy:** Vercel (SPA)

---

## Local development

```bash
git clone https://github.com/CesarKang/Verdict-Your-group-decision-solution.git
cd Verdict-Your-group-decision-solution
npm install
npm run dev
```

Open the URL Vite prints (e.g. `http://127.0.0.1:5173/`).

### Optional: Live AI mode

Create `.env.local`:

```env
VITE_VERDICT_MODE=live
VITE_LLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
VITE_LLM_API_KEY=your_key_here
VITE_LLM_MODEL=glm-4-flash
```

Use the ⚙️ settings button in the demo header to switch modes. Without an API key, the demo runs in **seed mode** automatically.

### Build

```bash
npm run build
npm run preview
```

---

## Project structure

```
src/
├── components/     # Zymix UI — chat, Decision Card, panels, sheets
├── data/           # Seed chat, venue dataset, group profile, prebaked verdicts
├── lib/            # Verdict engine, group habit inference, LLM client
└── App.tsx         # Demo flow orchestration
```

---

## Submission

Full Devpost copy (Inspiration, What It Does, Challenges, etc.) is in **[DEVPOST.md](./DEVPOST.md)**.

---

## Team

Built for the Zymix hackathon · Team Verdict

## License

MIT (or adjust as needed)
