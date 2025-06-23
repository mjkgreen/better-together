# MVP Plan: "Event Agent – Your AI Networking + Follow-Up Assistant"

## Hard Truth:
Most event apps suck because they dump a list of attendees or sessions at you and expect you to figure it out. People don't know who to talk to, how to reach out, or what to do after a conversation. And they definitely don't follow up.

So instead of two disjointed tools (before-event networking and post-event follow-up), let's build a single, lean MVP that does this:

## 🔥 ONE-LINER:
> An AI agent that tells you who to meet at an event—and writes your follow-up messages afterward.

## ✅ MVP Scope (Buildable in 12 Hours)

### 🧠 MVP System Flow (Cleaned Up)
1.  **Event Sign-Up Form**
    -   Basic form to capture:
        -   Name
        -   Email (optional)
        -   Role / Job Title
        -   Company
        -   Interests / Goals for the event (freeform or dropdown)
2.  **AI-Powered Contact Match Engine**
    -   Input: user's form + mock attendee list (with similar fields)
    -   Agent uses embeddings or prompt engineering to match top 3–5 relevant people to user
3.  **Output Matches**
    -   Display:
        -   Names, brief context (why they were picked)
        -   Optional: CTA buttons like "Introduce me", "View profile", "Save contact"
    -   e.g., "You and Sarah are both working on climate tech startups. You should talk to her about funding strategies."
4.  **Save in Rolodex**
    -   "Add to my list" button stores matched contacts locally (can be JSON, localStorage or mock DB)
    -   Later used for follow-up
5.  **Post-Event: Follow-Up AI Agent**
    -   User selects a contact + writes 1–2 lines about what was discussed (or selects a template)
    -   Agent generates a follow-up message (email, Slack DM, or LinkedIn style)
    -   e.g., "Hi Sarah — great chatting about carbon credits at TechTO! Would love to continue the convo over coffee next week."

### 🔁 Stretch:
-   Option to let both people contact each other (e.g. if both are using app)
-   "Mutual interest" flag
-   Schedule time via Google Calendar integration

### ⏱️ 12-Hour Build Feasibility
| Component                      | Time Est. | Tool                       |
| ------------------------------ | --------- | -------------------------- |
| Signup form                    | 1 hr      | React                      |
| Mock attendee data             | 30 min    | JSON                       |
| AI match logic (prompt-based)  | 2 hrs     | OpenAI API / LangChain     |
| Match display UI               | 1 hr      | Tailwind + React           |
| Rolodex save (localStorage)    | 1 hr      | React                      |
| Follow-up agent (notes → draft)| 2 hrs     | OpenAI API                 |
| Demo polish & deploy           | 3 hrs     | Vercel or Netlify          |

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
