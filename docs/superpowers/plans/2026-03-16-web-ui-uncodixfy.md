# Web UI Uncodixfy Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the scoped Next.js UI so `dashboard`, `tasks`, `projects`, and `products` follow the approved Uncodixfy design without changing routes, APIs, or task editing behavior.

**Architecture:** Keep the current data-loading and page/component boundaries, but replace the visual system and page composition. Consolidate the shell and surface styles in `globals.css`, simplify page markup where hierarchy currently depends on hero/eyebrow patterns, and keep the task split-view only where it serves the workflow.

**Tech Stack:** Next.js 15, React 19, TypeScript, CSS, Vitest, Testing Library

---

## File Structure

### Existing files to modify

- `web/src/app/globals.css`
  - Replace Codex-style tokens, gradients, large radii, glass panels, and hero/card styling with a restrained, document-like system.
- `web/src/app/layout.tsx`
  - Simplify the shell markup and align sidebar/header structure with the new page language.
- `web/src/components/dashboard-view.tsx`
  - Replace KPI-first dashboard composition with summary row + action lists.
- `web/src/components/task-workspace.tsx`
  - Keep behavior, but simplify toolbar, table, kanban, and inspector markup so the page reads as a workbench.
- `web/src/app/projects/page.tsx`
  - Convert the projects index from large cards to a compact listing.
- `web/src/components/products-overview.tsx`
  - Convert the products index from large cards to a compact listing.
- `web/src/components/project-workspace.tsx`
  - Remove hero treatment and recompose project details into plain sections.
- `web/src/components/product-workspace.tsx`
  - Remove hero treatment and recompose product details into plain sections.
- `web/src/components/dashboard-view.test.tsx`
  - Update expectations for the new dashboard hierarchy.
- `web/src/components/task-workspace.test.tsx`
  - Update expectations for renamed/simplified task UI controls if needed.
- `web/src/components/project-workspace.test.tsx`
  - Update assertions to match the plainer project detail page.

### New test files likely to add

- `web/src/components/products-overview.test.tsx`
  - Cover the new products index listing.
- `web/src/components/product-workspace.test.tsx`
  - Cover the new product detail layout.

### Existing files to verify but avoid changing unless needed

- `web/src/app/dashboard/page.tsx`
- `web/src/app/tasks/page.tsx`
- `web/src/app/products/page.tsx`
- `web/src/app/projects/[slug]/page.tsx`
- `web/src/app/products/[slug]/page.tsx`
- `web/src/components/new-task-modal.tsx`
- `web/src/components/search-box.tsx`

## Chunk 1: Global Shell And Visual Tokens

### Task 1: Capture the current shell behavior in tests if coverage is missing

**Files:**
- Modify: `web/src/components/dashboard-view.test.tsx`
- Modify: `web/src/components/task-workspace.test.tsx`

- [ ] **Step 1: Add or adjust failing assertions for the new plain page language**

```tsx
expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
expect(screen.getByRole("heading", { name: "Tasks" })).toBeInTheDocument();
```

- [ ] **Step 2: Run the focused tests to confirm failures reflect outdated UI copy**

Run: `npm test -- dashboard-view task-workspace`
Expected: FAIL because old headings like `Team command center` / `Operational workspace` are still rendered.

- [ ] **Step 3: Rewrite the global CSS tokens in `web/src/app/globals.css`**

```css
:root {
  --bg: #f5f3ef;
  --surface: #ffffff;
  --surface-muted: #f7f5f1;
  --border: #d7d1c7;
  --text: #1f1b16;
  --text-muted: #5f574d;
  --accent: #3b342c;
  --danger: #9a3d2e;
}
```

- [ ] **Step 4: Replace shell/layout classes with normal sidebar/header/container styles**

```css
.app-shell { display: grid; grid-template-columns: 248px minmax(0, 1fr); }
.sidebar { background: var(--surface-muted); border-right: 1px solid var(--border); }
.page-shell { max-width: 1280px; width: 100%; margin: 0 auto; }
```

- [ ] **Step 5: Update `web/src/app/layout.tsx` to match the simpler shell**

```tsx
<div className="app-shell">
  <aside className="sidebar">...</aside>
  <div className="page-shell">
    <header className="page-header">...</header>
    <main className="page-content">{children}</main>
  </div>
</div>
```

- [ ] **Step 6: Run the focused tests again**

Run: `npm test -- dashboard-view task-workspace`
Expected: PASS or fail only on page-specific components not yet updated.

- [ ] **Step 7: Commit the shell foundation**

```bash
git add web/src/app/globals.css web/src/app/layout.tsx web/src/components/dashboard-view.test.tsx web/src/components/task-workspace.test.tsx
git commit -m "refactor: simplify web shell and visual tokens"
```

## Chunk 2: Dashboard Rewrite

### Task 2: Replace KPI-first dashboard composition with summary and action lists

**Files:**
- Modify: `web/src/components/dashboard-view.tsx`
- Modify: `web/src/components/dashboard-view.test.tsx`

- [ ] **Step 1: Write failing dashboard assertions for the new structure**

```tsx
expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
expect(screen.getByText("Needs attention")).toBeInTheDocument();
expect(screen.getByText("Ready to move")).toBeInTheDocument();
```

- [ ] **Step 2: Run the dashboard test to verify failure**

Run: `npm test -- dashboard-view`
Expected: FAIL because the component still renders the old heading and KPI-card layout.

- [ ] **Step 3: Replace the dashboard JSX with summary row + two main sections**

```tsx
const summary = [
  ["Open", snapshot.kpis.totalTasks],
  ["In progress", snapshot.kpis.inProgressTasks],
  ["Blocked", snapshot.kpis.blockedTasks],
  ["Overdue", snapshot.kpis.overdueTasks]
];
```

```tsx
<section className="page-stack">
  <header className="section-header">
    <h1>Dashboard</h1>
  </header>
  <dl className="summary-row">...</dl>
  <div className="content-grid">
    <section className="section-panel">...</section>
    <section className="section-panel">...</section>
  </div>
</section>
```

- [ ] **Step 4: Add any supporting CSS selectors needed for summary rows and list sections**

```css
.summary-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.summary-item dt { color: var(--text-muted); }
.list-table { width: 100%; border-collapse: collapse; }
```

- [ ] **Step 5: Run the dashboard test to verify pass**

Run: `npm test -- dashboard-view`
Expected: PASS

- [ ] **Step 6: Commit the dashboard rewrite**

```bash
git add web/src/components/dashboard-view.tsx web/src/components/dashboard-view.test.tsx web/src/app/globals.css
git commit -m "refactor: redesign dashboard workspace"
```

## Chunk 3: Tasks Workspace Rewrite

### Task 3: Simplify task toolbar, table, kanban, and inspector without changing behavior

**Files:**
- Modify: `web/src/components/task-workspace.tsx`
- Modify: `web/src/components/task-workspace.test.tsx`
- Modify: `web/src/app/globals.css`

- [ ] **Step 1: Add failing assertions for the plainer tasks page**

```tsx
expect(screen.getByRole("heading", { name: "Tasks" })).toBeInTheDocument();
expect(screen.getByRole("button", { name: "Table" })).toBeInTheDocument();
expect(screen.getByText("Select a task")).toBeInTheDocument();
```

- [ ] **Step 2: Run the task workspace test to confirm failure**

Run: `npm test -- task-workspace`
Expected: FAIL because the page still uses old heading/layout patterns.

- [ ] **Step 3: Rewrite the task page markup around one toolbar and one justified split layout**

```tsx
<section className="page-stack">
  <header className="section-header">
    <h1>Tasks</h1>
    <div className="toolbar">...</div>
  </header>
  <div className="workspace-split">
    <section className="section-panel">table or kanban</section>
    <aside className="inspector-panel">selected task</aside>
  </div>
</section>
```

- [ ] **Step 4: Simplify filter/toggle controls to use standard tab/button styling**

```css
.toolbar-tabs button[aria-pressed="true"] { background: var(--surface); color: var(--text); }
.toolbar-filters button.is-active { border-color: var(--text); }
```

- [ ] **Step 5: Densify the table and restrain kanban visuals**

```css
.task-table th,
.task-table td { padding: 10px 12px; border-bottom: 1px solid var(--border); }
.kanban-card { border: 1px solid var(--border); border-radius: 8px; box-shadow: none; }
```

- [ ] **Step 6: Run the task workspace tests**

Run: `npm test -- task-workspace`
Expected: PASS

- [ ] **Step 7: Commit the tasks rewrite**

```bash
git add web/src/components/task-workspace.tsx web/src/components/task-workspace.test.tsx web/src/app/globals.css
git commit -m "refactor: simplify task workspace ui"
```

## Chunk 4: Projects And Products Index Pages

### Task 4: Convert index pages from cards to dense listings

**Files:**
- Modify: `web/src/app/projects/page.tsx`
- Modify: `web/src/components/products-overview.tsx`
- Create: `web/src/components/products-overview.test.tsx`
- Modify: `web/src/app/globals.css`

- [ ] **Step 1: Write a failing test for the new products index listing**

```tsx
render(<ProductsOverview products={products} />);
expect(screen.getByRole("table")).toBeInTheDocument();
expect(screen.getByText("Example Product")).toBeInTheDocument();
```

- [ ] **Step 2: Run the focused products test to verify failure**

Run: `npm test -- products-overview`
Expected: FAIL because no products overview test exists yet and the component still renders cards.

- [ ] **Step 3: Rewrite `ProductsOverview` to render a compact table/list**

```tsx
<section className="page-stack">
  <header className="section-header"><h1>Products</h1></header>
  <div className="section-panel">
    <table className="entity-table">...</table>
  </div>
</section>
```

- [ ] **Step 4: Rewrite `web/src/app/projects/page.tsx` to use the same compact listing pattern**

```tsx
<section className="page-stack">
  <header className="section-header"><h1>Projects</h1></header>
  <div className="section-panel">
    <table className="entity-table">...</table>
  </div>
</section>
```

- [ ] **Step 5: Add table/list CSS shared by project and product indexes**

```css
.entity-table { width: 100%; border-collapse: collapse; }
.entity-table tr:hover { background: var(--surface-muted); }
.entity-marker { width: 8px; border-radius: 999px; }
```

- [ ] **Step 6: Run the new and existing focused tests**

Run: `npm test -- products-overview`
Expected: PASS

- [ ] **Step 7: Commit the index-page rewrite**

```bash
git add web/src/app/projects/page.tsx web/src/components/products-overview.tsx web/src/components/products-overview.test.tsx web/src/app/globals.css
git commit -m "refactor: simplify project and product indexes"
```

## Chunk 5: Project And Product Detail Pages

### Task 5: Remove hero sections from detail pages and align detail sections

**Files:**
- Modify: `web/src/components/project-workspace.tsx`
- Modify: `web/src/components/project-workspace.test.tsx`
- Modify: `web/src/components/product-workspace.tsx`
- Create: `web/src/components/product-workspace.test.tsx`
- Modify: `web/src/app/globals.css`

- [ ] **Step 1: Update/add failing tests for plain detail page structure**

```tsx
expect(screen.getByRole("heading", { name: "Example Project" })).toBeInTheDocument();
expect(screen.getByText("Project context")).toBeInTheDocument();
expect(screen.getByRole("heading", { name: "Example Product" })).toBeInTheDocument();
```

- [ ] **Step 2: Run the focused detail-page tests to verify failure**

Run: `npm test -- project-workspace product-workspace`
Expected: FAIL because the current detail pages still depend on hero sections and product-workspace lacks a test file.

- [ ] **Step 3: Rewrite `ProjectWorkspace` as plain sections**

```tsx
<section className="page-stack">
  <header className="section-header">
    <div className="entity-title">
      <span className="entity-marker" style={{ backgroundColor: project.color }} />
      <h1>{project.fullName}</h1>
    </div>
  </header>
  <div className="two-column-sections">...</div>
</section>
```

- [ ] **Step 4: Rewrite `ProductWorkspace` using the same detail-page grammar**

```tsx
<section className="page-stack">
  <header className="section-header"><h1>{product.name}</h1></header>
  <section className="section-panel">...</section>
  <section className="section-panel">...</section>
</section>
```

- [ ] **Step 5: Add or refine CSS for detail headers, metadata blocks, and linked-resource rows**

```css
.entity-title { display: flex; align-items: center; gap: 10px; }
.meta-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.resource-link { display: inline-flex; padding: 10px 12px; border: 1px solid var(--border); }
```

- [ ] **Step 6: Run the focused detail-page tests**

Run: `npm test -- project-workspace product-workspace`
Expected: PASS

- [ ] **Step 7: Commit the detail-page rewrite**

```bash
git add web/src/components/project-workspace.tsx web/src/components/project-workspace.test.tsx web/src/components/product-workspace.tsx web/src/components/product-workspace.test.tsx web/src/app/globals.css
git commit -m "refactor: simplify project and product detail pages"
```

## Chunk 6: Full Verification

### Task 6: Run regression checks and inspect the live UI

**Files:**
- Verify: `web/src/app/layout.tsx`
- Verify: `web/src/components/dashboard-view.tsx`
- Verify: `web/src/components/task-workspace.tsx`
- Verify: `web/src/app/projects/page.tsx`
- Verify: `web/src/components/products-overview.tsx`
- Verify: `web/src/components/project-workspace.tsx`
- Verify: `web/src/components/product-workspace.tsx`

- [ ] **Step 1: Run the component test suite**

Run: `npm test`
Expected: PASS

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Start the app locally for visual QA**

Run: `npm run dev`
Expected: local Next.js server starts successfully

- [ ] **Step 4: Verify the scoped routes manually**

Run through:
- `/dashboard`
- `/tasks`
- `/projects`
- `/products`
- one project detail route
- one product detail route

Expected:
- sidebar remains usable
- no hero blocks or eyebrow labels remain in scoped screens
- tasks still open in the inspector and save correctly
- listings remain readable on narrow widths

- [ ] **Step 5: Commit final verification-safe polish**

```bash
git add web/src
git commit -m "test: verify uncodixfy web ui rewrite"
```
