---
type: knowledge-dashboard
---

# База знаний команды

## Быстрый вход

- [[knowledge/inbox/README|Входящие знания]]
- [[dashboards/knowledge-inbox|Очередь входящих знаний]]
- [[dashboards/permanent-notes|Постоянные заметки]]
- [[dashboards/literature-notes|Заметки по источникам]]
- [[dashboards/structure-notes|Структурные заметки]]
- [[dashboards/unlinked-notes|Непривязанные заметки]]
- [[dashboards/notes-by-project|Заметки по проектам]]
- [[dashboards/notes-by-repo|Заметки по репозиториям]]

## Последние knowledge notes

```dataview
TABLE note_type as "Тип", project as "Проект", repo as "Репозиторий", created as "Создано"
FROM "knowledge"
WHERE id
SORT created DESC
LIMIT 20
```

## Непривязанные заметки

```dataview
TABLE note_type as "Тип", project as "Проект", repo as "Репозиторий"
FROM "knowledge"
WHERE id AND (!length(related_notes) OR length(related_notes) = 0) AND file.name != "README"
SORT created DESC
```

## Проектные доски знаний

```dataview
LIST FROM "knowledge/projects"
WHERE file.name = "index"
SORT file.path ASC
```

## Репозиторные доски знаний

```dataview
LIST FROM "knowledge/repos"
WHERE file.name = "index"
SORT file.path ASC
```
