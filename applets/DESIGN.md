# Math Applet Design Principles

These applets should feel like precise classroom constructions: constrained, manipulable, and a little hand-annotated. They inherit a useful GeoGebra-like restraint, but the portfolio version should make the first interaction and the learning-design point easier to see.

## Core Principles

- Start with a direct mathematical invitation. The visitor should know what to try in one short phrase, such as "Drag point C."
- Keep the applet centered on one mathematical idea. Controls, labels, traces, and animation should support noticing that idea.
- Preserve the constructive feel of the original GeoGebra files: graph paper, plain labels, bounded motion, visible constraints, and teacher-notebook annotation.
- Make the applet the main first-viewport object. Titles should be compact, and the applet stage should appear early without excess page chrome.
- Use context above the applet when it matters, especially credits or a source prompt, but keep it compact. Longer reflection belongs below the stage.

## Interaction Grammar

- A ringed point means draggable. The ring is the affordance; its color can vary with the point's mathematical role.
- Most applets should have one obvious primary draggable point. Multiple main draggable points are fine when the construction genuinely needs multiple degrees of freedom.
- The first hint lives inside the stage: a handwritten label or arrow plus a gentle idle motion before interaction.
- Hide the inside-stage hint after the user actually starts interacting.
- Use attractor snapping at mathematically meaningful positions. Current catenary and quadrilateral snapping strength is the baseline: noticeable but not heavy-handed.
- Snap targets should usually stay visible so they read as mathematical invitations, not hidden UI.
- Reset should return to a thoughtfully chosen starting state, not just a generic neutral state.

## Visual Language

- Keep black for fixed structure and the main construction.
- Keep blue for annotation, labels, prompts, or explanatory marks.
- Use ringed points for draggable handles, with point color flexible by role.
- Use orange for traces, loci, or accumulated paths for now.
- Reposition labels freely for clarity. Point names and mathematical labels should be hand-authored for the construction.
- Avoid ornamental decoration. If something is drawn, it should either be part of the construction, a control, a prompt, or a mathematical trace.

## Page Pattern

- Prefer a smaller page title than the current case-study hero scale.
- Avoid a redundant blue handwritten kicker above every applet title.
- Keep the applet stage visually dominant and close to the top of the page.
- Add an optional below-applet section for authored reflection, often framed as "Now that you've tried it...".
- When adding or revising an applet, prompt Scott to hand-author any below-applet reflection questions or notes.

## Mobile And Touch

Classify each applet's touch behavior:

- `mobile-friendly`: the drag target is generous, the stage fits well, and touch interaction is central.
- `mobile-okay`: usable on touch, but more comfortable with a larger screen.
- `desktop-recommended`: precision, density, or screen size make the applet meaningfully better on desktop.

For drag-heavy applets:

- Allow the page to scroll normally when the user touches non-interactive stage space.
- Prevent page scrolling only after the user starts dragging a ringed point.
- Use generous hit targets for draggable points on touch, roughly 30 to 36 CSS pixels where practical.
- Keep mobile intro spacing tight so the stage appears before the visitor has to scroll far.
- Add a small desktop recommendation note only when the applet truly benefits from more screen or pointer precision.

## New Or Revised Applet Checklist

Before building or revising an applet, answer:

- Primary invitation:
- Mathematical idea visitors should notice:
- Primary draggable point or points:
- Ring color and role:
- Snap targets:
- Idle hint:
- Trace or locus color:
- Initial state:
- Reset state:
- Mobile classification:
- Controls:
- Accessibility label or nearby explanatory text:
- Below-applet reflection prompt for Scott to author:

