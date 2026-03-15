---
type: knowledge-board
project: _example
repo: C:\path\to\example-repo
note_type: structure
created: 2026-03-15
related_notes: []
---

# Доска знаний репозитория Example Repo

## Knowledge notes

```dataview
TABLE note_type as "Тип", project as "Проект", created as "Создано"
FROM "knowledge"
WHERE repo = "C:\\path\\to\\example-repo" AND file.path != this.file.path
SORT created DESC
```

## Активные задачи по репозиторию

```dataview
TABLE project as "Проект", owner as "Владелец", executor as "Исполнитель", status as "Статус"
FROM "tasks"
WHERE repo = "C:\\path\\to\\example-repo"
SORT created DESC
```
