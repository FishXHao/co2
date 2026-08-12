---
name: commit-message
description: Generate and validate Git commit messages from repository changes using this project's Conventional Commits rules. Use when a user asks for a commit message, commit summary, commit message review, or commit type/scope selection.
---

# Commit Message Skill

依照專案文件中的 Conventional Commits 規範，從實際變更內容產生清楚、可追溯的 Git commit message。

## 工作流程

1. 先查看變更範圍與內容：優先使用 `git diff --cached`；若沒有 staged changes，再查看 `git diff`。
2. 同時參考與變更相關的 `documents/` 文件，避免在 commit message 中捏造需求或行為。
3. 判斷唯一最主要的變更目的，再選擇 type；只有在變更確實跨越多個目的時才拆分或提出疑問。
4. 從受影響的功能、模組或領域選擇簡短 scope；無法合理歸類時省略 scope。
5. 產生一個首選訊息。只有在變更目的確實有歧義時，才列出替代方案。
6. 除非使用者明確要求，僅產生或檢查訊息，不執行 `git commit`。

## 格式

```text
<type>(<scope>): <subject>

<body>

<footer>
```

`scope`、`body` 和 `footer` 都是可選的；簡單變更只需要 subject。

### Type

只使用下列類型：

- `feat`: 新功能
- `fix`: Bug 或錯誤修復
- `docs`: 文件更新
- `style`: 不改變行為的程式碼格式調整
- `refactor`: 不新增功能或修復 Bug 的程式碼重構
- `test`: 測試新增或修改
- `chore`: 建置工具、設定或其他維護工作

### Subject

- 使用現在式、祈使語氣或直接描述動作，並與專案既有語言保持一致。
- 使用小寫 type；scope 應簡短、具體，通常使用功能或模組名稱。
- 只描述這次變更的主要結果，不重述實作細節。
- 不以句號結尾；盡量讓第一行維持在 72 個字元以內。
- 不使用模糊的 `update code`、`fix stuff` 或單獨的 `changes`。

### Body 和 Footer

- 只有在 subject 不足以說明背景、影響或重要限制時才加入 body。
- body 說明為什麼改、影響什麼，不要逐行複製 diff。
- footer 用於 issue、review 或其他可追蹤參照，例如 `Closes #123`。
- 破壞性變更可在 type 後加 `!`，並在 footer 使用 `BREAKING CHANGE:` 說明遷移方式。

## 輸出規則

- 先輸出 `Suggested commit message`，接著提供完整訊息區塊。
- 若使用者只需要 subject，僅輸出第一行。
- 若使用者要求 review，指出 type、scope、subject、body/footer 是否符合規範，並提供修正版。
- 若沒有可讀取的變更，明確說明無法可靠判斷目的，請使用者提供 diff 或先 stage 變更。
- 不要把未驗證的測試結果、issue 編號、效能改善或使用者影響寫進訊息。

## 專案範例

```text
feat(auth): 實作登入功能
fix(login): 修正密碼驗證錯誤
docs(api): 更新登入端點文件
```

## 最終檢查

- type 是否來自允許清單？
- scope 是否反映實際受影響的模組？
- subject 是否具體、簡潔且描述主要目的？
- body/footer 是否有必要且內容可由變更或文件驗證？
- 是否誤把多個不相關目的合併成一個訊息？
