# Web UI Uncodixfy Redesign

Date: 2026-03-16
Scope: `web/src` pages and components for `dashboard`, `tasks`, `projects`, `products`
Out of scope: auth flow changes, data model changes, API changes, markdown vault structure changes

## Goal

Rewrite the main web UI so it stops reading like a generic AI dashboard and instead behaves like a normal internal workspace. The redesign should follow the constraints from `Uncodixfy.md` while staying cheap to implement by preserving the current routing, data loading, and most component logic.

## Constraints

- Keep the left sidebar.
- Preserve the current Next.js app structure and route map.
- Reuse the current data model and API endpoints.
- Focus on visual hierarchy, layout, and component presentation rather than behavior changes.
- Avoid the banned Codex UI patterns: hero sections, eyebrow labels, glass panels, large radii, pill overload, decorative gradients, oversized KPI card grids, and “control room” copy.

## Design Direction

The chosen direction is a document-like workspace with a fixed sidebar and a plain main content column. Pages should feel operational and readable rather than branded or cinematic. The interface should use standard layout primitives: sidebar, page header, toolbar, table, list, simple panel, and task inspector where functionally required.

This direction intentionally keeps the UI boring in the good sense: predictable, dense enough for work, and visually calm.

## Global Layout

### App shell

- Keep a fixed-width left sidebar.
- Sidebar should use a solid background with a simple `border-right`.
- Remove floating-shell treatment, glassmorphism, and oversized corner radius.
- Main content should be a centered working column with standard padding and no decorative background treatments.

### Header

- Replace decorative page framing with a plain page title row.
- No eyebrow labels, uppercase microcopy, or hero-style section intros.
- The top row may contain title, search, and primary actions, but should remain compact.

### Containers

- Panels should become standard surfaces with subtle border, minimal or no shadow, and small radius.
- Use one consistent container language instead of separate `hero-panel`, `surface-panel`, `drawer`, and multiple “special” panel styles.
- Standard radius target: `8px`, with rare use of `10px` if needed.

## Visual System

### Colors

- Keep the existing warm-light direction from the project to minimize rewrite cost.
- Remove radial gradients, glass overlays, and teal-driven decorative accents.
- Use color for meaning, not atmosphere:
  - neutral page background
  - slightly stronger surface background
  - dark text
  - restrained accent for active controls
  - explicit warning/danger color for blocked or failing states

### Typography

- Keep typography simple and readable.
- Remove eyebrow labels and decorative uppercase metadata.
- Use normal hierarchy: `h1` for page title, `h2/h3` for section labels, plain body text for support copy.
- Avoid mixed “premium” styling tricks.

### Motion and interaction

- No transform-based hover animation.
- Hover and active states should rely on border, background, and text contrast only.
- Transitions should be subtle and short.

## Page Designs

### Dashboard

#### Intent

The dashboard should answer: what needs action now, what is ready to move, and where products/projects are stuck.

#### Structure

1. Compact page header with title and top-level utilities.
2. A single compact summary row with a few high-value counts.
3. Main action section for tasks that need attention.
4. Secondary section for product/project movement or backlog pressure.

#### Rules

- Do not lead with a large KPI-card grid.
- Counts should support reading, not dominate the page.
- Prefer tables or compact lists over decorative cards.
- Remove “command center” framing and similar copy.

### Tasks

#### Intent

The tasks screen is the primary operational workspace and can justify a split layout because editing and browsing happen together.

#### Structure

1. Plain page header.
2. Compact toolbar with:
   - view toggle (`table` / `kanban`)
   - filters
   - search if needed
3. Two-column workspace:
   - left: task list/table or kanban
   - right: selected task inspector

#### Rules

- Keep the split only because it is functionally useful here.
- Toolbar controls should be standard buttons/tabs, not pill-heavy segmented chips.
- Table mode should be the default “serious” view.
- Kanban should stay visually restrained and not become a card-showcase.
- The inspector should use standard form layout with labels above inputs and one clear save action.

### Projects Index

#### Intent

The projects index should behave like a manageable inventory, not a gallery of cards.

#### Structure

- Page header
- Compact list or table of projects
- Each row should expose the minimum useful summary:
  - name
  - product
  - status
  - active tasks
  - blocked tasks

#### Rules

- Replace large project cards with denser listing patterns.
- Use project color only as a small marker, not a decorative block.

### Project Details

#### Intent

Project detail pages should present facts and linked work without hero treatment.

#### Structure

1. Plain title row with project name and product context.
2. Context section with core metadata.
3. Knowledge/linked resources section.
4. Active tasks section as a table.

#### Rules

- Remove the hero panel.
- No decorative project-stat strip.
- Keep the knowledge entry point visible but plain.

### Products Index

#### Intent

The products index should act like a roll-up view across project groups.

#### Structure

- Page header
- Dense list or table of products
- Show only essential counts and navigation affordances

#### Rules

- Avoid large product cards.
- Prioritize scanability and comparison.

### Product Details

#### Intent

Product detail pages should summarize the product and expose its projects without dashboard theater.

#### Structure

1. Plain header with product name and optional description.
2. Compact metadata/summary section.
3. Projects table or list.

#### Rules

- Remove hero styling.
- Project listing should align visually with the projects index language.

## Component Mapping

Current component language to remove or reduce:

- `hero-panel`
- `eyebrow`
- oversized `project-card` presentation
- glass/frosted surfaces
- oversized stat cards as the dominant dashboard pattern

Component language to introduce or standardize:

- standard sidebar nav item
- page header row
- compact summary row
- standard section panel
- dense table
- plain list row
- restrained tab/toggle control
- normal inspector form

## Implementation Boundaries

The redesign should prefer:

- CSS replacement over logic rewrites
- small JSX structure changes where required for hierarchy
- reuse of existing server data-fetching
- reuse of existing task editing behavior

The redesign should avoid:

- route changes
- schema updates
- modal workflow redesign
- new visualization widgets
- decorative charts

## Testing Expectations

- Verify all four scoped routes render correctly on desktop and mobile widths.
- Verify sidebar navigation remains usable.
- Verify task selection and saving still works.
- Verify table and kanban switching still works.
- Verify project and product links still navigate correctly.
- Run existing tests and update them only where markup changes require it.

## Recommended Implementation Strategy

1. Replace the global shell and token system in `globals.css`.
2. Simplify `layout.tsx` structure where necessary to match the new shell.
3. Redesign `dashboard-view.tsx` around summary row + action lists.
4. Redesign `task-workspace.tsx` with restrained toolbar, denser table, and cleaner inspector.
5. Convert project and product index pages from cards to rows/tables.
6. Convert project/product detail pages from hero sections to plain structured sections.
7. Run tests and visual verification.

## Open Notes

- `login` is intentionally excluded from this first pass.
- The chosen direction is intentionally conservative because the requirement is to be cheaper, not more expressive.
- If a page-specific layout choice feels like “default AI dashboard UI,” it should be removed even if it is easy to keep.
