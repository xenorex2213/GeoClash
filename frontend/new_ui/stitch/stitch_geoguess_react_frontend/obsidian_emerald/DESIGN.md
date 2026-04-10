# Design System Document: The Kinetic Explorer

## 1. Overview & Creative North Star
**Creative North Star: "Precision Luminescence"**

This design system moves away from the static, "boxy" nature of traditional gaming interfaces to embrace a high-end, editorial aesthetic defined by depth and light. For a competitive game like GeoGuess, the UI must feel as precise as a satellite coordinate yet as immersive as the locations being explored. 

We achieve this through **Intentional Asymmetry**—where critical data points are offset to create a sense of movement—and **Luminous Layering**, using light as a functional tool rather than just decoration. We break the "template" look by treating the screen not as a flat canvas, but as a deep, multi-layered cockpit of frosted glass and reactive energy.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a deep "Obsidian" base, utilizing neon-inflected greens to represent data, progress, and victory.

### Surface Hierarchy & The "No-Line" Rule
To maintain a premium feel, **1px solid borders for sectioning are strictly prohibited.** Boundaries are defined through background shifts or light-bleed.
- **Nesting Logic:** Place a `surface_container_lowest` card atop a `surface_container_low` section to create natural depth. 
- **The "Glass & Gradient" Rule:** All primary cards must utilize a backdrop blur (minimum 16px) combined with the `surface_variant` token at 60% opacity. 
- **Signature Texture:** Use a subtle linear gradient on main CTAs, transitioning from `primary` (#a4ffb9) to `primary_container` (#00fd87) at a 135-degree angle to provide "visual soul."

### Key Tokens
- **Background:** `surface` (#0d0f0f) — The void.
- **Action:** `primary` (#a4ffb9) — The pulse of the game.
- **Error:** `error` (#ff716c) — High-contrast alert.
- **Surface Tiers:** Use `surface_container_low` (#121414) for general layout areas and `surface_bright` (#2a2d2d) for high-impact interactive elements.

---

## 3. Typography: The Editorial Scale
We pair the technical precision of **Inter** with the aggressive, wide stance of **Space Grotesk** to create a "Tactical Editorial" vibe.

- **Display (Space Grotesk):** Used for scores, countdowns, and "VICTORY" states. These should use `display-lg` to `display-sm` to dominate the visual hierarchy.
- **Headlines (Space Grotesk):** For location names and round headers. Use `headline-md` for a modern, slightly "tech-noir" feel.
- **Body & Labels (Inter):** For coordinate data, player chats, and settings. High legibility is non-negotiable. Use `body-md` for standard text and `label-sm` for micro-metadata.

**Hierarchy Note:** Always pair a large `display-md` header with a `label-md` uppercase sub-header (tracked out 10%) to create an authoritative, premium contrast.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too heavy for this aesthetic. We use **Ambient Glows** and **Tonal Stacking**.

- **The Layering Principle:** Depth is achieved by stacking `surface-container` tiers. A player's profile card should be `surface_container_highest` set against a `surface_dim` backdrop.
- **The "Ghost Border" Fallback:** If a container needs more definition (e.g., in a crowded lobby), use a 1px border with `outline_variant` at **15% opacity**. On hover, this "Ghost Border" transitions to 100% opacity `primary` with a 4px outer glow (Soft Bloom).
- **Ambient Shadows:** For floating modals, use a shadow with a 40px blur at 6% opacity, using the `surface_tint` (#a4ffb9) color instead of black. This simulates the light from the UI elements reflecting off the glass surfaces.

---

## 5. Components

### Glassy Cards
*   **Background:** `surface_variant` at 40% opacity with a `backdrop-filter: blur(20px)`.
*   **Edge:** A "Top-Light" stroke—only the top and left edges receive a 1px stroke of `on_surface_variant` at 20% opacity to mimic light hitting the edge of a glass pane.
*   **Interaction:** No divider lines. Separate content with 24px vertical padding (Spacing Scale).

### Kinetic Buttons
*   **Primary:** Solid `primary_container` gradient. 
*   **Hover State:** Scale `1.05`, change background to `primary` (vibrant green), and apply a `primary_dim` outer glow.
*   **Secondary:** Ghost variant. No fill, `primary` border at 30%. On hover, fills to 10% opacity.

### Input Fields
*   **Base:** `surface_container_highest` with `md` (0.375rem) roundedness.
*   **Focus State:** The "Ghost Border" becomes a solid `primary` stroke. The label slides 4px to the right, creating a sense of "activation."

### Feedback Indicators
*   **Success:** Pulsing `primary` ring around the element.
*   **Error:** Background shift to `error_container` with a jitter animation (200ms).

---

## 6. Do's and Don'ts

### Do
*   **Do** use intentional white space. If two elements feel cluttered, increase the gap rather than adding a line.
*   **Do** lean into asymmetry. For example, right-aligning labels while left-aligning data points creates a sophisticated, custom-built look.
*   **Do** use `surface_tint` for subtle atmospheric glows behind major UI clusters to ground them in the "dark space."

### Don't
*   **Don't** use 100% black (#000000) for cards. It kills the glassmorphism effect. Use `surface_container_low`.
*   **Don't** use standard "Drop Shadows." They feel dated. Use tonal shifts and blurs.
*   **Don't** over-round corners. Stick to the `md` (0.375rem) or `lg` (0.5rem) tokens for a sharp, competitive edge. Avoid `full` rounding except for small notification pips.