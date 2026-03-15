#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

TASK_ID="${1:-}"
[[ -n "$TASK_ID" ]] || die "использование: ./automation/dispatch-to-codex.sh <task-id>"

FILE="$(find_note_by_id "$TASK_ID")"
[[ -n "$FILE" ]] || die "не найден файл для ID $TASK_ID"

print_summary "$FILE"

EXECUTOR="$(frontmatter_value "$FILE" executor)"
READY="$(frontmatter_value "$FILE" dispatch_ready)"
REPO="$(frontmatter_value "$FILE" repo)"
HANDOFF="$(frontmatter_value "$FILE" handoff_status)"

[[ "$EXECUTOR" == "codex" ]] || die "dispatch в Codex возможен только для executor=codex"
[[ "$READY" == "true" ]] || die "dispatch_ready должен быть true"
require_value "$REPO" "repo"
[[ "$HANDOFF" == "ready" || "$HANDOFF" == "dispatched" ]] || die "handoff_status должен быть ready или dispatched"

print_prompt_header "Codex execution"
sed -n '/## Codex execution/,$p' "$SCRIPT_DIR/prompt-template.md"
echo "Контекст: $FILE"
echo "Repo: $REPO"
