$inputJson = [Console]::In.ReadToEnd()

try {
    $event = $inputJson | ConvertFrom-Json -ErrorAction Stop
} catch {
    [Console]::Error.WriteLine('Unable to parse hook input as JSON.')
    exit 2
}

$questionTools = @(
    'askQuestions',
    'ask_questions',
    'vscode_askQuestions',
    'vscode_ask_questions'
)

if ($questionTools -notcontains [string]$event.tool_name) {
    @{ continue = $true } | ConvertTo-Json -Compress
    exit 0
}

$questions = @()
if ($null -ne $event.tool_input -and $null -ne $event.tool_input.questions) {
    $questions = @($event.tool_input.questions)
}

if ($questions.Count -eq 0) {
    [ordered]@{
        hookSpecificOutput = [ordered]@{
            hookEventName = 'PreToolUse'
            permissionDecision = 'deny'
            permissionDecisionReason = 'The question tool did not provide any questions, so this invocation was blocked.'
        }
    } | ConvertTo-Json -Compress -Depth 4
    exit 0
}

$countLabel = if ($questions.Count -eq 1) { 'one question' } else { "$($questions.Count) questions" }

[ordered]@{
    hookSpecificOutput = [ordered]@{
        hookEventName = 'PreToolUse'
        permissionDecision = 'ask'
        permissionDecisionReason = "Review $countLabel before allowing it. Each question must be necessary, not answerable from the current context or workspace, and able to change the next decision."
        additionalContext = 'Before asking the user, verify every question individually. Resolve questions through workspace inspection or a reasonable explicit assumption when possible.'
    }
} | ConvertTo-Json -Compress -Depth 4
