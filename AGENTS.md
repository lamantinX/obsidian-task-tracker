# Task Tracker Vault

`vault_path`: `C:\Users\zelen\OneDrive\Рабочий стол\projects\obsidian-task-tracker`

This file is the project-specific instruction source for terminal coding agents working in this Obsidian vault.

## Vault Purpose

This repository is an Obsidian vault for task tracking across multiple projects.
It uses markdown files with YAML frontmatter, Dataview queries, and Templater templates.

## Directory Structure

- `tasks/<project>/` - task files with YAML frontmatter
- `projects/` - project index files with metadata and Dataview queries
- `daily/<YYYY>/<MM>/` - daily notes
- `weekly/<YYYY>/` - weekly notes
- `templates/` - Templater templates
- `kanban/` - Kanban board files
- `analytics/` - burndown logs
- `archive/` - completed or old tasks
- `dashboard.md` - main dashboard

## Agent Rules

- Treat this repository as a markdown data vault, not as an application codebase.
- Prefer editing existing markdown and YAML frontmatter over introducing scripts or tooling.
- Do not modify files under `templates/` unless the user explicitly asks for template changes.
- Preserve existing Obsidian and Dataview formatting conventions.
- When adding new agent-specific files, keep them small and point back to this file instead of duplicating rules.

## Task File Conventions

- Path: `tasks/{project}/{kebab-case-slug}.md`
- Required frontmatter: `id`, `title`, `status`, `project`, `priority`, `created`
- Status: `todo | in-progress | done | blocked | cancelled`
- Priority: `high | medium | low`
- Dates: `YYYY-MM-DD`
- Effort: `30m, 1h, 2h, 4h, 1d, 2d, 1w`
- IDs: `{PREFIX}-{NNN}` such as `APP-001` or `WEB-012`

## Project Repos

| Project | Repo Path | ID Prefix |
|---------|-----------|-----------|

## When Creating Tasks

1. Read `projects/<project>.md` to get `id_prefix` and `next_id`
2. Generate ID as `{id_prefix}-{next_id zero-padded to 3}`
3. Create `tasks/<project>/<slug>.md`
4. Increment `next_id` in the project file

## When Completing Tasks

1. Set `status: done` and `completed:` to today's date
2. Add a log entry
3. Check whether any other tasks reference this task in `blocked_by`

## Git Log Commands

- Always use full absolute paths from the project `repo` field
- Use `--oneline` and `--since` or `--until` for date filtering

## Codex Notes

- Codex should read this file first for vault-specific behavior.
- Keep `CODEX.md` and `CLAUDE.md` as thin compatibility entrypoints when possible.
