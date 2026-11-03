---
name: screenshot-to-code
description: Recreating a design from an uploaded screenshot or hand-drawn sketch
triggers: şekil, sekil, screenshot, ekran görüntüsü, ekran goruntusu, eskiz, sxem, bu dizayn, buna oxşar, buna oxsar
always: false
---
# Screenshot / sketch → site
1. First describe what you see in `<novo-plan>`: layout grid, sections top-to-bottom, color palette (estimate oklch values), font style (serif/sans, weights), spacing density, corner radius, shadows.
2. Translate the palette and fonts into the `@theme` tokens and the Google Fonts link.
3. Rebuild section by section, matching proportions, alignment and hierarchy closely. Use real Azerbaijani copy instead of the screenshot text unless asked to keep it.
4. For hand-drawn sketches: treat boxes as layout intent, and apply the design-excellence rules to make it look professional.
5. Make it responsive even if the screenshot is desktop-only.
