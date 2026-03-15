# Заметки по источникам

```dataview
TABLE project as "Проект", repo as "Репозиторий", source as "Источник", created as "Создано"
FROM "knowledge"
WHERE note_type = "literature"
SORT created DESC
```
