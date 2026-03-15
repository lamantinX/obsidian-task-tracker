# Постоянные заметки

```dataview
TABLE project as "Проект", repo as "Репозиторий", created as "Создано", length(related_notes) as "Связей"
FROM "knowledge"
WHERE note_type = "permanent"
SORT created DESC
```
