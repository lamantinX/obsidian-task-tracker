Импортировать список задач или идей в team mode.

## Использование
- `/import <file-path> --project <project>`
- `/import` и затем вставить список

## Логика
1. Прочитай исходный список.
2. Определи тип сущности:
   - неясные пункты и гипотезы -> `kind: idea`, каталог `ideas/`
   - исследовательские пункты -> `kind: research`, каталог `research/`
   - implementation-ready пункты -> `tasks/<project>/`
3. Генерируй ID по схеме `<PREFIX>-<YYYYMMDD>-<NN>` через сканирование существующих файлов.
4. Для ambiguous items ставь `executor: deerflow`, `deerflow_mode: triage`.
5. Не создавай Codex-ready задачи автоматически без явного dispatch.
