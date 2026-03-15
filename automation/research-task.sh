#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

TASK_ID="${1:-}"
[[ -n "$TASK_ID" ]] || die "использование: ./automation/research-task.sh <task-id>"

FILE="$(find_note_by_id "$TASK_ID")"
[[ -n "$FILE" ]] || die "не найден файл для ID $TASK_ID"

print_summary "$FILE"

HANDOFF="$(frontmatter_value "$FILE" handoff_status)"
DEERFLOW_MODE="$(frontmatter_value "$FILE" deerflow_mode)"
[[ "$HANDOFF" == "researching" || "$DEERFLOW_MODE" == "research" || "$DEERFLOW_MODE" == "triage" ]] || die "research допустим только в research context"

print_prompt_header "DeerFlow research"
sed -n '/## DeerFlow research/,/## /p' "$SCRIPT_DIR/prompt-template.md" | sed '$d'
echo "Контекст: $FILE"
