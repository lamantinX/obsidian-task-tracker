---
type: dashboard
---

# Командный dashboard

## Операционные очереди

- [[dashboards/ideas-inbox|Входящие идеи]]
- [[dashboards/research-queue|Очередь research]]
- [[dashboards/ready-for-deerflow|Готово для DeerFlow]]
- [[dashboards/planned-by-deerflow|Спланировано DeerFlow]]
- [[dashboards/ready-for-codex|Готово для Codex]]
- [[dashboards/in-execution|В исполнении]]
- [[dashboards/waiting-review|Ожидает ревью]]
- [[dashboards/blocked|Заблокировано]]
- [[dashboards/active-by-owner|Активное по владельцу]]
- [[dashboards/active-by-project|Активное по проекту]]

## Активные задачи по проектам

```dataview
TABLE WITHOUT ID
  project as "Проект",
  length(filter(rows, (r) => r.status = "todo")) as "Todo",
  length(filter(rows, (r) => r.status = "in-progress")) as "В работе",
  length(filter(rows, (r) => r.status = "blocked")) as "Заблокировано",
  length(filter(rows, (r) => r.executor = "deerflow")) as "DeerFlow",
  length(filter(rows, (r) => r.executor = "codex")) as "Codex",
  length(rows) as "Всего"
FROM "tasks"
WHERE file.name != "README" AND status != "cancelled"
GROUP BY project
SORT project ASC
```

## Готово для Codex

```dataview
TABLE project as "Проект", owner as "Владелец", repo as "Репозиторий", codex_mode as "Режим", handoff_status as "Этап"
FROM "tasks"
WHERE executor = "codex" AND dispatch_ready = true AND (handoff_status = "ready" OR handoff_status = "dispatched")
SORT priority ASC, created DESC
```

## В работе

```dataview
TABLE project as "Проект", owner as "Владелец", executor as "Исполнитель", status as "Статус", handoff_status as "Этап"
FROM "tasks"
WHERE status = "in-progress" OR handoff_status = "implementing"
SORT created DESC
```

## Заблокировано

```dataview
TABLE project as "Проект", owner as "Владелец", blocked_by as "Блокеры", due as "Срок"
FROM "tasks"
WHERE status = "blocked" OR handoff_status = "blocked"
SORT due ASC
```

## База знаний

- [[knowledge/knowledge-hub|Хаб базы знаний]]
- [[dashboards/knowledge-inbox|Входящие знания]]
- [[dashboards/permanent-notes|Постоянные заметки]]
- [[dashboards/literature-notes|Заметки по источникам]]
- [[dashboards/structure-notes|Структурные заметки]]
- [[dashboards/unlinked-notes|Непривязанные заметки]]

## Research notes за 7 дней

```dataview
TABLE project as "Проект", owner as "Владелец", created as "Создано", deerflow_mode as "Режим"
FROM "research"
WHERE created >= date(today) - dur(7d)
SORT created DESC
```

## Knowledge notes без связей

```dataview
TABLE note_type as "Тип", project as "Проект", repo as "Репозиторий", created as "Создано"
FROM "knowledge"
WHERE id AND (!length(related_notes) OR length(related_notes) = 0) AND file.name != "README"
SORT created DESC
```

## Knowledge notes, связанные с активными задачами

```dataview
TABLE project as "Проект", repo as "Репозиторий", related_tasks as "Связанные задачи"
FROM "knowledge"
WHERE length(related_tasks) > 0
SORT created DESC
```

## Быстрые ссылки

- [[projects/|Проекты]]
- [[knowledge/projects|Доски знаний по проектам]]
- [[knowledge/repos|Доски знаний по репозиториям]]
