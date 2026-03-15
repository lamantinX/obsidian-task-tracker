# Непривязанные заметки

```dataview
TABLE note_type as "Тип", project as "Проект", repo as "Репозиторий", created as "Создано"
FROM "knowledge"
WHERE id AND (!length(related_notes) OR length(related_notes) = 0) AND file.name != "README"
SORT created DESC
```
