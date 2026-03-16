---
project: _example
full_name: Example Project
repo:
remote:
status: active
started: 2025-01-01
color: "#4A90D9"
id_prefix: EX
knowledge_board: knowledge/projects/_example/index
product: _example-product
next_id: 2
---

# Example Project

This is a sample project file showing the expected format. You can delete this after running `setup.sh` or `setup-team.sh` to create your own projects.

**Key fields:**
- `project`: folder name used in paths like `tasks/myapp/`
- `full_name`: display name for dashboards and reports
- `repo`: absolute path to the project's git repo
- `id_prefix`: short uppercase prefix for IDs
- `knowledge_board`: project-level knowledge board
- `next_id`: legacy counter for old workflows only

## Repo

`repo path not set`

## Knowledge Board

- [[knowledge/projects/_example/index|Example knowledge board]]

## Active Tasks

```dataview
TABLE status, priority, due, effort
FROM "tasks/_example"
WHERE status != "done" AND status != "cancelled"
SORT choice(priority, "high", 1, "medium", 2, "low", 3) ASC, due ASC
```

## Recently Completed

```dataview
TABLE completed, actual
FROM "tasks/_example"
WHERE status = "done"
SORT completed DESC
LIMIT 10
```

## Velocity (Last 4 Weeks)

```dataview
TABLE length(rows) as "Tasks Completed"
FROM "tasks/_example"
WHERE status = "done" AND completed >= date(today) - dur(28d)
GROUP BY dateformat(completed, "yyyy-'W'WW") as Week
SORT Week DESC
```
