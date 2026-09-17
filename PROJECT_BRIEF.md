# PROJECT 23 — BIRTHDAY EXPERIENCE

A handcrafted, 4-chapter interactive birthday experience for his girlfriend.
Birthday: **23 September 2026**.

---

## What This Is

A 4-day cinematic narrative site delivered via QR code.
Each day (Sept 20–23) unlocks a new chapter.
Each chapter has its own visual tone, pacing, and a question that builds a sentence.
On the final day, all four words combine — and the gift acrostic is revealed.

---

## The Four Chapters

| Key | Date | Title | Gift | Word choices |
|-----|------|-------|------|-------------|
| sweet | Sept 20 | The Sweet | Lindor (L) | sweet / warm / gentle |
| wild | Sept 21 | The Wild | pOwer bank (O) | wild / brave / alive |
| fierce | Sept 22 | The Fierce | YOUtube Premium | fierce / certain / relentless |
| forever | Sept 23 | The Forever | Mystery (VEgetable in person) | mine / home / everything |

Gift acrostic: L + O + VE + YOU = LOVE YOU

---

## Sentence System

Each chapter asks one question. She picks one word.
Final sentence revealed on Day 4:
  "you are [ch1 word], [ch2 word], [ch3 word], and [ch4 word]."

localStorage keys: p23_word_ch1, p23_word_ch2, p23_word_ch3, p23_word_ch4

---

## LOVE YOU Reveal Sequence (Chapter 4)

1. "you thought the gifts were just... things." / "they weren't." / "each one was a letter."
2. Plain gift list (no highlights): lindor box, power bank, a random vegetable, youtube premium
3. "look at the first letters."
4. Same gifts with gold highlighted letters: [L]indor, p[O]wer bank, [VE]getable, [YOU]tube
5. L · O · V · E · Y · O · U assembles letter by letter with haptic
6. "love you." — rose, large, confetti
7. "always been the point." — quiet below
8. CTA → Final screen (mystery gift + birthday message)

---

## Chapter Stage Machines

Ch1 (The Sweet):   opening -> letter -> question -> gift -> gift-reveal -> horizon
Ch2 (The Wild):    opening -> question -> gift-reveal -> horizon
Ch3 (The Fierce):  opening -> question -> gift-reveal -> horizon
Ch4 (The Forever): opening -> question -> sentence-reveal -> love-reveal -> final

---

## Routing (app/page.tsx)

?chap=4 or activeChapterKey === "forever" -> HandcraftedChapter04
?chap=3 or activeChapterKey === "fierce"  -> HandcraftedChapter03
?chap=2 or activeChapterKey === "wild"    -> HandcraftedChapter02
default                                    -> HandcraftedChapter01

Use ?chap=N to preview any chapter during development.

---

## Key Files

components/chapters/chapter01/HandcraftedChapter01.tsx  - The Sweet
components/chapters/chapter02/HandcraftedChapter02.tsx  - The Wild
components/chapters/chapter03/HandcraftedChapter03.tsx  - The Fierce
components/chapters/chapter04/HandcraftedChapter04.tsx  - The Forever
components/handcrafted/UnfoldingLetter.tsx              - Ch1 letter animation
components/handcrafted/LuxuryEnvelope.tsx               - Ch1 envelope animation
lib/audio/bg-music.ts                                   - music singleton
app/admin/page.tsx                                      - admin dashboard (passkey: 2309)
app/api/state/route.ts                                  - returns active chapter
app/api/chapter/response/route.ts                       - saves answers
app/api/chapter/spin/route.ts                           - marks chapter complete

---

## Design

Fonts: Playfair Display (serif), Caveat (handwritten)
Dark bg: #0E0B09   Ivory bg: #FAF7F2
Gold: #C9974A      Rose: #C4687A
Sign-off: — ♡

Admin passkey: 2309
