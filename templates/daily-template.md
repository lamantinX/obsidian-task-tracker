---
type: daily
date: <% tp.date.now("YYYY-MM-DD") %>
weekday: <% tp.date.now("dddd") %>
week: <% tp.date.now("YYYY-[W]WW") %>
energy:
tasks_completed: 0
tasks_created: 0
---

# <% tp.date.now("dddd, MMMM D, YYYY") %>

## Планирование дня

### Топ-3 приоритета

1.
2.
3.

### Срок сегодня

```dataview
TABLE project as "Проект", priority as "Приоритет", effort as "Оценка"
FROM "tasks"
WHERE due = date("<% tp.date.now("YYYY-MM-DD") %>") AND status != "done" AND status != "cancelled"
SORT priority ASC
```

### Просрочено

```dataview
TABLE project as "Проект", priority as "Приоритет", due as "Срок", effort as "Оценка"
FROM "tasks"
WHERE due < date("<% tp.date.now("YYYY-MM-DD") %>") AND status != "done" AND status != "cancelled"
SORT due ASC
```

### В работе

```dataview
TABLE project as "Проект", priority as "Приоритет", due as "Срок"
FROM "tasks"
WHERE status = "in-progress"
SORT priority ASC
```

### Готово для Codex

```dataview
TABLE project as "Проект", owner as "Владелец", codex_mode as "Режим", handoff_status as "Этап"
FROM "tasks"
WHERE executor = "codex" AND dispatch_ready = true AND (handoff_status = "ready" OR handoff_status = "dispatched")
SORT priority ASC
```

## Блоки времени

| Время | Блок | Задача / заметки |
|------|------|-------------------|
| 09:00-10:30 | Фокус | |
| 10:30-11:00 | Перерыв | |
| 11:00-12:30 | Фокус | |
| 12:30-13:30 | Обед | |
| 13:30-14:00 | Коммуникации | |
| 14:00-16:00 | Фокус | |
| 16:00-16:30 | Перерыв | |
| 16:30-18:00 | Завершение дня | |

## Git-активность

<%*
const fs = require("fs");
const vaultPath = app.vault.adapter.basePath;
const projectDir = vaultPath + "/projects";
const files = fs.readdirSync(projectDir).filter(f => f.endsWith(".md") && !f.startsWith("_"));
const today = tp.date.now("YYYY-MM-DD");
const tomorrow = tp.date.now("YYYY-MM-DD", 1);
for (const file of files) {
  const content = fs.readFileSync(projectDir + "/" + file, "utf8");
  const nameMatch = content.match(/full_name:\s*(.+)/);
  const repoMatch = content.match(/repo:\s*(.+)/);
  const name = nameMatch ? nameMatch[1].trim() : file.replace(".md", "");
  const repo = repoMatch ? repoMatch[1].trim() : "";
  if (!repo) continue;
  tR += `### ${name}\n\`\`\`\n`;
  try {
    const log = await tp.system.command_output(`cd "${repo}" && git log --oneline --since="${today}" --until="${tomorrow}" 2>/dev/null || echo "Нет коммитов за сегодня"`);
    tR += log;
  } catch(e) {
    tR += "Не удалось получить git log";
  }
  tR += `\n\`\`\`\n\n`;
}
if (files.every(f => {
  const content = fs.readFileSync(projectDir + "/" + f, "utf8");
  const repoMatch = content.match(/repo:\s*(.+)/);
  return !repoMatch || !repoMatch[1].trim();
})) {
  tR += "_Репозитории проектов ещё не настроены. Заполните поле `repo:` в project files._\n";
}
%>

## Review дня

### Завершено сегодня

```dataview
LIST
FROM "tasks"
WHERE status = "done" AND completed = date("<% tp.date.now("YYYY-MM-DD") %>")
```

### Новые knowledge notes

```dataview
TABLE note_type as "Тип", project as "Проект", created as "Создано"
FROM "knowledge"
WHERE created = date("<% tp.date.now("YYYY-MM-DD") %>")
SORT file.name ASC
```

### Краткое summary

- Задач завершено:
- Задач создано:
- Что ушло в DeerFlow:
- Что ушло в Codex:
- Блокеры:
- Фокус на завтра:

---

[[<% tp.date.now("YYYY-MM-DD", -1) %>|Вчера]] | [[<% tp.date.now("YYYY-MM-DD", 1) %>|Завтра]] | [[<% tp.date.now("YYYY-[W]WW") %>|Эта неделя]]
