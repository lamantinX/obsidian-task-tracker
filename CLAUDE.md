# Инструкции для Claude / DeerFlow compatibility layer

Сначала прочитай [AGENTS.md](C:\Users\zelen\OneDrive\Рабочий стол\projects\obsidian-task-tracker\AGENTS.md). Это канонический источник правил для этого vault.

## Team mode
- Этот vault работает как central control plane для команды.
- DeerFlow — orchestration brain.
- Codex — execution layer.
- Никакая задача не должна исполняться автоматически без явного dispatch.

## Как работать
- Ищи задачу по `id`, `title` или по папкам `tasks/`, `ideas/`, `research/`, `dispatch/`.
- Для project-to-repo mapping читай `projects/<project>.md`.
- Для выбора knowledge board используй поле `knowledge_board` в project file.
- Если `executor: deerflow`, задача должна идти через orchestration workflow.
- Если `executor: codex`, проверь `dispatch_ready: true`, `repo` и наличие dispatch note.
- Research summary пиши в `research/` и связывай через `related_research`.
- Knowledge notes веди в `knowledge/` и связывай через `related_notes`.

## Slash commands
- Файлы в `.claude/commands/` сохранены как compatibility layer.
- Интерфейс и инструкции в них русскоязычные и DeerFlow-centric.
