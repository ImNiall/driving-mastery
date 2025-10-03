# Module Authoring Guide (DVSA‑style)

This guide helps you write launch‑ready educational modules that prepare learners for the DVSA Theory Test. It standardises structure, tone, and markdown syntax so every module looks and feels consistent.

## Goals
- Teach each topic sufficiently for the learner to pass DVSA theory on that topic.
- Keep a universal look; modules differ only by their content.
- Use clear, concise, plain English.

## Structure (use these headings in your markdown)
- # Overview
  - 2–3 sentences: what this teaches and why it matters.
- # Key Principles
  - 3–7 concise bullets of the core ideas.
- ## Technique/Procedure
  - Step‑by‑step guidance; include at least one Tip.
- ## Common Mistakes
  - At least one Warning for risk/legal points.
- ## Examples
  - Use `>` blockquotes for Highway Code extracts.
  - Include one realistic scenario (conditions, cues, response).
- ## Checks for Understanding
  - 3–5 measurable outcomes: “You should be able to …”.
- ## Practice
  - 1–2 prompts to try before/after the MiniQuiz.

## Markdown syntax supported by the app
- Headings:
  - `#` → H2 (section)
  - `##` → H3 (subsection)
  - `###` → H4 (minor subhead)
- Lists:
  - Unordered: start line with `-`, `*`, or `•` (grouped automatically)
- Blockquotes:
  - Start line with `>`; consecutive lines group into a single quote block
- Callouts (use explicit words when authoring):
  - `Note: …` → informational (blue)
  - `Warning: …` → safety/legal risk (yellow)
  - `Tip: …` → helpful heuristic (green)
  - Legacy variants also render (case‑insensitive, with optional `>` and shorthand `N/W/T/!`), but prefer the explicit forms above for clarity.

## Voice & tone
- Plain English, active voice; second person (you/your) when instructive.
- Short sentences (12–18 words); one idea per sentence.
- Define terms briefly on first use (e.g., “PSL: Position–Speed–Look”).
- Use concrete cues (time/distance, mirror checks, road markings).

## Outcomes (assessment‑ready)
Write outcomes so they are testable:
- Identify … (signs, cues, hazards)
- Adjust … (speed/position/following distance)
- Apply … (PSL, two‑second rule, mirror–signal–manoeuvre)

## Examples
- Tip: “Tip: Count ‘only a fool breaks the two‑second rule’ to check your following distance.”
- Warning: “Warning: Using a phone while driving is illegal; even hands‑free can distract.”
- Blockquote: 
  > Highway Code, Rule 126: “Leave enough space… so you can pull up safely.”

## SEO & metadata
- Title: “{Topic}: {Plain‑English hook}”.
- Description: 150–160 chars, outcome‑oriented; avoid keyword stuffing.

## Accessibility
- Keep heading order (no jumps: H2 → H3 → H4).
- Callouts have colour + textual labels (Note/Warning/Tip) – don’t rely on colour alone.

## Quality checklist (quick)
- Overview explains purpose and payoff.
- Principles are concise and complete.
- Procedure is actionable and includes a Tip.
- At least one Warning where relevant.
- A Highway Code quote and a realistic scenario.
- 3–5 “You should be able to …” outcomes.
- Practice prompts present.
