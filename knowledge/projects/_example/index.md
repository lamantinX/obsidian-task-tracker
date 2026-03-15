---
type: knowledge-board
project: _example
repo:
note_type: structure
created: 2026-03-15
related_notes: []
---

# Доска знаний проекта Example

## Ключевые заметки

```dataview
TABLE note_type as "Тип", created as "Создано"
FROM "knowledge"
WHERE project = "_example" AND file.path != this.file.path
SORT created DESC
```

## Связанные идеи

```dataview
TABLE priority as "Приоритет", handoff_status as "Этап", created as "Создано"
FROM "ideas"
WHERE project = "_example"
SORT created DESC
```

## Research notes

```dataview
TABLE owner as "Владелец", handoff_status as "Этап", created as "Создано"
FROM "research"
WHERE project = "_example"
SORT created DESC
```

## Связанные задачи

```dataview
TABLE owner as "Владелец", executor as "Исполнитель", status as "Статус", handoff_status as "Этап"
FROM "tasks"
WHERE project = "_example"
SORT created DESC
```

## Dispatch notes

```dataview
TABLE executor as "Исполнитель", codex_mode as "Режим Codex", created as "Создано"
FROM "dispatch"
WHERE project = "_example"
SORT created DESC
```
