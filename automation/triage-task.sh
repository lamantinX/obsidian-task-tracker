#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

TASK_ID="${1:-}"
[[ -n "$TASK_ID" ]] || die "использование: ./automation/triage-task.sh <task-id>"

FILE="$(find_note_by_id "$TASK_ID")"
[[ -n "$FILE" ]] || die "не найден файл для ID $TASK_ID"

print_summary "$FILE"

HANDOFF="$(frontmatter_value "$FILE" handoff_status)"
[[ "$HANDOFF" == "inbox" || "$HANDOFF" == "triaged" ]] || die "triage допустим только для inbox или triaged"

print_prompt_header "DeerFlow triage"
sed -n '/## DeerFlow triage/,/## /p' "$SCRIPT_DIR/prompt-template.md" | sed '$d'
echo "Контекст: $FILE"
