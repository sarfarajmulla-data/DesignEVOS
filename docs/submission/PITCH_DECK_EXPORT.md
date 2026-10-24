# Pitch deck export instructions

`PITCH_DECK.md` is the repository's editable slide source. It is not itself a PDF or PowerPoint file.

## Recommended export

The deck uses slide separators (`---`) and Mermaid architecture content. Before exporting:

1. Capture genuine screenshots from a clean local run.
2. Replace the screenshot placeholder in `PITCH_DECK.md` with approved images from `docs/submission/assets/`.
3. Add verified Exasol Personal architecture, SQL, and result evidence. Remove the `BLOCKED` wording only after those artifacts exist.
4. Render the Markdown with a trusted Markdown-to-PDF or slide tool such as Marp, then visually inspect every slide.
5. If a `.pptx` is required, import the rendered deck into an approved presentation tool and verify layout, fonts, links, and attribution.
6. Commit the final `PITCH_DECK.pdf` or `PITCH_DECK.pptx` under this directory and update `EXATHON_CHECKLIST.md`.

## Content rules

- Use only genuine application screenshots.
- Identify illustrative/synthetic results clearly.
- Do not invent metrics, benchmarks, customer research, testimonials, or Exasol query results.
- Do not show credentials or private dashboards.
- Keep the final presentation to approximately 7–9 slides and align it with `DEMO_SCRIPT.md`.
