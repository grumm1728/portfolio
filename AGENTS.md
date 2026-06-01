# AGENTS.md

Guidance for coding agents working in this portfolio.

## Portfolio Purpose

This is Scott Farrar's professional portfolio for product work, edtech, math writing, learning design, and small interactive prototypes. Changes should make the site better at showing:

- Product judgment, especially around classroom workflows and teacher/student needs.
- Edtech and math-learning point of view, not just polished UI output.
- Clear writing: case studies should explain the problem, design reasoning, constraints, and what the prototype teaches.
- Interactive thinking: applets and prototypes should let visitors manipulate an idea, notice a pattern, or feel a classroom/product affordance directly.

The audience includes edtech/product hiring teams, collaborators, researchers, and people evaluating Scott's ability to design learning experiences.

## Site Shape

This is a static GitHub Pages site with no build step.

- Entry point: `index.html`
- Main shared styles: `styles.css`
- Home project data and thumbnails: `script.js`
- Case study pages: root-level HTML files such as `algebuds.html`, `teacher-flow.html`, and `kidlinks.html`
- Applet gallery: `applets/index.html`
- Individual applets: `applets/<applet-name>/index.html`
- Shared applet code/styles: `applets/shared/`
- Images and media: `images/` unless an existing root asset clearly belongs where it already is

Keep the site easy to publish from the repository root on GitHub Pages. Avoid introducing build tooling, package managers, frameworks, or external runtimes unless the user explicitly asks and the benefit is very clear.

## Design Direction

The visual language is "math teacher notebook": graph paper, hand-drawn/projection-room energy, black ink, blue annotation, classroom artifacts, and approachable manipulatives.

Preserve and extend these patterns:

- Use the existing CSS variables in `styles.css`, especially `--ink`, `--blue`, `--paper`, `--grid`, `--grid-bold`, `--soft`, `--font`, and `--hand`.
- Prefer semantic HTML, direct typography, underlined links, bordered panels, graph-paper backgrounds, and simple drawings or real screenshots.
- Keep the feel professional but not corporate. It should read as rigorous, curious, and teachery, not SaaS-marketing slick.
- Use real artifacts, screenshots, applet states, or simple mathematical visuals over decorative stock imagery.
- Keep card radii modest and irregular where the current style does so.
- Avoid generic landing-page patterns, vague hero copy, decorative gradients, ornamental blobs, and over-polished template aesthetics.

Responsive polish matters. Text, buttons, applet stages, screenshots, and cards should not overlap or require horizontal scrolling on mobile.

## Writing Voice

Write like an experienced math educator/product designer explaining their thinking to a smart colleague.

- Be specific about the learning or product problem.
- Tie design choices to classroom reality, student reasoning, teacher flow, feedback, or mathematical noticing.
- Prefer concrete claims over vague outcomes.
- Keep headlines active and readable.
- Use lowercase section labels when matching existing case-study style.
- Do not inflate prototypes into finished products; describe what they test or reveal.

## Case Study Pages

Case studies are article-like portfolio pieces. Good additions usually include:

- A clear setup: problem, audience, context, and why it matters.
- An insight or design thesis.
- Design decisions with rationale.
- Evidence, screenshots, diagrams, applet states, or prototype moments.
- Constraints and tradeoffs.
- Impact, learning, or what the prototype proves.
- References/credits where the argument depends on research or another designer's work.

Use existing case-study classes and structure before inventing new ones: `case-body`, `case-page`, `case-hero`, `case-kicker`, `case-subtitle`, `case-section`, `section-label`, and local page-specific classes.

## Interactive Applet Pages

Applet pages should be focused and manipulable quickly.

- Lead with a direct mathematical invitation, such as "Drag point C."
- Make the first interaction obvious.
- Keep the applet centered on one idea.
- Prefer small, understandable controls over many settings.
- Include short notes that help visitors notice what to look for, not long instructions.
- Use `applets/shared/applet.css` for shared applet layout.
- Put reusable applet logic in `applets/shared/` and expose it through `window.MathApplets` when it is shared across pages.
- If adding an applet, also consider updating `applets/shared/applet-shell.js`, `applets/index.html`, `script.js`, and the homepage navigation if it should be discoverable.

Canvas or SVG applets should resize cleanly, support mouse and touch where practical, and provide useful `aria-label`s or nearby explanatory text for accessibility.

## Code Style

- Use plain HTML, CSS, and JavaScript.
- Prefer `const` and `let`.
- Keep JavaScript readable and local. Existing shared scripts use IIFEs and `window.MathApplets`; follow that pattern when appropriate.
- Avoid broad rewrites, minification, or generated-looking code.
- Keep comments sparse and useful.
- Use relative links that work on GitHub Pages from the repository root.
- Do not break existing direct links to deployed prototypes.

## Accessibility And UX

- Use semantic sections, headings, figures, captions, labels, and alt text.
- Links that open external sites should usually use `target="_blank" rel="noreferrer"` to match existing project cards.
- Ensure interactive controls have labels and visible states.
- Canvas elements need descriptive `aria-label`s and surrounding text that explains the experience.
- Preserve keyboard and touch usability where controls are present.

## Verification

For content-only changes, read the affected page and check links/paths mentally. For layout or interaction changes, verify in a browser.

Before finishing a visual or interactive change, check:

- Home page still renders.
- Affected case-study or applet page renders.
- Mobile and desktop widths do not overlap or crop important content.
- Applet interactions work with no console errors.
- Images load from the intended path.

Because this is a static site, opening the HTML file may be enough. A local static server is also fine when testing relative paths or browser behavior.

## Key Judgment

The portfolio should make Scott's thinking visible. A polished page that hides the learning-design argument is less valuable than a slightly simpler page that makes the product, pedagogy, and mathematical idea legible. When in doubt, strengthen the story, the interaction, or the classroom/product specificity.
