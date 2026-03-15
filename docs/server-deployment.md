# Серверный сценарий развёртывания

## Базовая схема
- central vault хранится на сервере;
- DeerFlow работает на сервере как orchestration brain;
- Codex работает на сервере как execution worker;
- участники команды работают через локальные Obsidian clients;
- project repos живут отдельно от vault и подключаются через `projects/<project>.md`.

## Рекомендуемая модель доступа
- участники команды получают доступ к vault на чтение и запись;
- DeerFlow получает доступ к vault и к нужным project repos;
- Codex получает доступ только к vault и к тем repos, куда его явно dispatch-нули;
- production credentials не выдаются по умолчанию ни DeerFlow, ни Codex.

## Базовые меры безопасности
- отдельные системные пользователи или service accounts для DeerFlow и Codex;
- least privilege на уровне каталогов и SSH-ключей;
- audit trail через git и markdown log entries;
- ручной review перед merge/deploy;
- secrets хранить вне vault.

## Knowledge layer
Zettelkasten живёт в том же central vault:
- команда пишет заметки через Obsidian;
- DeerFlow читает и синтезирует знания;
- DeerFlow может создавать research/knowledge artifacts;
- DeerFlow и Codex не должны запускать execution напрямую из knowledge notes без dispatch.

## Почему нельзя давать production access по умолчанию
- orchestration и execution не должны обходить human review;
- ошибка в routing или prompt может привести к опасным действиям;
- central brain должен готовить handoff, а не администрировать production;
- least privilege проще сопровождать и аудировать.
