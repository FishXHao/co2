"use strict";

const questionTools = new Set([
  "askQuestions",
  "ask_questions",
  "vscode_askQuestions",
  "vscode_ask_questions"
]);

let input = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});

process.stdin.on("end", () => {
  let event;

  try {
    event = JSON.parse(input);
  } catch {
    process.stderr.write("Unable to parse hook input as JSON.\n");
    process.exitCode = 2;
    return;
  }

  if (!questionTools.has(event.tool_name)) {
    process.stdout.write(JSON.stringify({ continue: true }));
    return;
  }

  const questions = Array.isArray(event.tool_input?.questions)
    ? event.tool_input.questions
    : [];

  if (questions.length === 0) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason:
            "The question tool did not provide any questions, so this invocation was blocked."
        }
      })
    );
    return;
  }

  const countLabel = questions.length === 1
    ? "one question"
    : `${questions.length} questions`;

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason:
          `Review ${countLabel} before allowing it. Each question must be necessary, not answerable from the current context or workspace, and able to change the next decision.`,
        additionalContext:
          "Before asking the user, verify every question individually. Resolve questions through workspace inspection or a reasonable explicit assumption when possible."
      }
    })
  );
});
