# MVP Plan: "Event Agent – Your AI Networking + Follow-Up Assistant"

## Hard Truth:
Most event apps suck because they dump a list of attendees or sessions at you and expect you to figure it out. People don't know who to talk to, how to reach out, or what to do after a conversation. And they definitely don't follow up.

So instead of two disjointed tools (before-event networking and post-event follow-up), let's build a single, lean MVP that does this:

## 🔥 ONE-LINER:
> An AI agent that tells you who to meet at an event—and writes your follow-up messages afterward.

## ✅ MVP Scope (Buildable in 12 Hours)

### 🧠 Core Flow:
1.  **User logs in with Google (or mock login)**
2.  **User enters what they're looking for** (e.g. "I want to meet AI startup founders")
3.  **Agent recommends 2-5 people to meet, with reasons** (e.g. "You and Jane are both building B2B tools for healthcare")
4.  **After event, user types notes about their conversations** (or selects from a template)
5.  **Agent drafts personalized follow-up messages, ready to send**

### 💻 Tech Stack
-   **Frontend:** Next.js (super fast for hackathon)
-   **Agent Runtime:** OpenAI API (or LangChain + open-source LLM if needed)
-   **Auth:** Google Login (or stub)
-   **Data Store:** Mock JSON files or localStorage (skip DB for now)
-   **UI:** Chat-style interface (Cursor + Tailwind = fast)

## Features to Build (MVP)

- [ ] **🧑‍💼 Profile Input**: "What are you hoping to get out of this event?" form
- [ ] **🧠 Matchmaking Agent**: Takes input + mock attendee list → suggests 3 best people to meet
- [ ] **💬 Intro Messages**: Auto-generates short intro blurbs or Slack DMs
- [ ] **🗒️ Post-event Notes**: Text area for user to summarize each convo
- [ ] **📩 Follow-up Generator**: Agent creates personalized email/text to send after event
- [ ] **📆 Add to Calendar**: Simple button to "schedule follow-up" via Google Calendar (optional)
