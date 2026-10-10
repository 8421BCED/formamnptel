# Java Practice Room

A calm practice site for **Programming in Java**, made as a gift for HOD Ma’am. Take a test by week, a mix of weeks, or fully
random, then see the score, what went wrong, and the correct answers.

It is a **static React app (Vite + TypeScript). There is no backend**: the questions ship inside the page, scoring
happens in the browser, and progress is kept in `localStorage` (so a refresh never loses an exam). That is why it
needs no server, database or login, and why Vercel's free static hosting is enough.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests (exam engine + question-bank validation)
npm run build    # type-check + production build into dist/
```

## Live site

**https://java-practice-room.vercel.app** (Vercel project `java-practice-room`).

To publish a change, run `npx vercel deploy --prod` from this folder. Once the Vercel account has a GitHub login
connection, run `npx vercel git connect` once and every `git push` to `main` will redeploy automatically.

## Deploy to Vercel

Either:

1. Push this folder to a GitHub repo, then on vercel.com choose **Add New -> Project**, import the repo and click
   **Deploy**. Vercel detects Vite on its own (build `npm run build`, output `dist`). No settings to change.
2. Or from this folder run `npx vercel` and follow the prompts (`npx vercel --prod` for the production URL).

## What the exam does

- **Week-wise / Mixed weeks / Random** exam types, number of questions, optional time limit (auto-submits at zero).
- Shuffled question order and shuffled options (options such as "None of the above" are never shuffled).
- Question palette (answered / not answered / marked for review), mark for review, clear response.
  Keyboard: `a`-`d` choose, left/right arrows move, `m` marks.
- Result page: score, correct / wrong / not attempted, score by week, and every question with your answer, the
  correct answer and an NPTEL-style "Accepted answer is ..." line. Filter to wrong or skipped only, or
  **retry just the questions you missed**.
- Resume an unfinished exam after a refresh; the last 15 results are listed on the home page.

## Personal touches

- **Name and tone:** change `RECIPIENT` (used in sentences, e.g. "Welcome, Ma’am!") and `RECIPIENT_FULL` (shown under the logo
  and in the footer, "HOD Ma’am") in [src/config.ts](src/config.ts). All wording is courteous and formal on purpose.
- **Icon:** the browser-tab icon and the header logo are the Java cup, cut from `assets-src/java-logo-original.jpg`.
  Run `powershell -ExecutionPolicy Bypass -File scripts\make-icons.ps1` to regenerate every size in `public/`.
- **Welcome:** the home page greets by the time of day (good morning / afternoon / evening, a quiet "hello" late at night)
  and picks a different welcome line each visit. Returning visitors are welcomed back and reminded of their last score.
- **Results:** the headline and message depend on the score band (perfect, excellent, good, steady, gentle) and are
  chosen from several wordings, so it never reads the same way twice. Under it, "What stood out" gives real facts about
  that attempt: up or down from last time, strongest and weakest week, a reminder that there is no negative marking when
  questions were skipped, and time to spare. All wording lives in [src/lib/messages.ts](src/lib/messages.ts).
- **Confetti** for 60% and above (a longer celebration from 85%). Once per exam, never for people who have asked their
  device to reduce motion.
- **Suggested practice:** after a few attempts the home page names the week she has struggled with most and offers a
  one-click round on it.

## Where the questions come from

Everything lives in [src/data/weeks/](src/data/weeks/) - one file per week. The raw dumps you started from are still
in [weeks/](weeks/); they were OCR text, so the questions were cleaned up by hand. Each question carries a `source`:

| source     | meaning                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| `nptel`    | The answer is NPTEL's own "Accepted answer".                                                         |
| `inferred` | The source file had no answer key (all of Week 0, the Week 1 lecture-practice set, the Week 12 quiz, and a few single questions), so the answer was worked out separately. |
| `derived`  | The source was a programming assignment (no MCQ), so the question was written for this site. None are in use right now - see `src/data/extras/`. |

The bank matches the real course: **Week 0 has 20 questions and Weeks 1-12 have 10 each (140 total)**; a test enforces
this. Week 0 and most of Week 12 are `inferred` because NPTEL showed no answer key for them.

Anything that is not `nptel` shows a small warning under the question on the result page. On the setup screen,
**"Only questions with a confirmed answer"** leaves all of them out.

Extra practice questions that are *not* part of the real assignments (25 lecture-practice questions for Week 1,
10 thread questions for Week 8 and 6 code questions for Week 12) are parked in
[src/data/extras/](src/data/extras/). They are not loaded by the app; each file explains how to bring them back.

### Adding or fixing questions

Add `src/data/weeks/week10.ts` (any file in that folder is picked up automatically):

```ts
import { defineWeek, java } from '../define'

export default defineWeek({
  week: 10,
  title: 'Topic name',
  questions: [
    {
      q: 'What is printed?',
      code: java`
        System.out.println(1 + 2 + "3");
      `,
      options: ['33', '123', '6', 'Compilation error'],
      answer: 0, // index of the correct option (0 = first)
      explain: 'Optional: shown on the result page.',
    },
  ],
})
```

`npm test` checks every question (valid answer index, no duplicate options, unique ids), so a typo is caught before you
deploy. A half-finished exam saved in someone's browser stays safe if you edit the bank later: each saved question
carries a fingerprint, and any question that changed or disappeared is dropped from the resumed exam instead of being
matched to the wrong one.
