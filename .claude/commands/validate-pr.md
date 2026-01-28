---
description: Validate AI PR comments on current branch - checks if AI-generated review comments are accurate or hallucinated
---

Goal: Validate AI PR comments on the current branch.

PR URL: $ARGUMENTS

## Prerequisites

1. **Check if GH CLI is installed**:
   - Run `which gh` to verify the GitHub CLI is available
   - If not installed, stop and ask the user to install it:
     - macOS: `brew install gh`
     - Then authenticate: `gh auth login`

## Input Validation

1. **Validate PR argument**:
   - If `$ARGUMENTS` is empty or missing, display this error and stop:
     ```
     Error: Please provide a PR number or URL.

     Usage: /validate-pr <PR_NUMBER_OR_URL>

     Examples:
       /validate-pr 123
       /validate-pr https://github.com/owner/repo/pull/123
     ```
   - Accept either:
     - PR number (e.g., `123`)
     - Full PR URL (e.g., `https://github.com/owner/repo/pull/123`)
   - Extract the PR number from the URL if a full URL is provided

## Instructions

1. **Fetch PR information using GH CLI**:
   - Extract the PR number from the provided URL
   - Run `gh pr view <PR_NUMBER> --json comments,reviews,body,title,files` to get all PR data
   - List all comments and review comments on the PR

2. **Think critically about each comment**:
   - AI-generated comments may contain hallucinations or incorrect assumptions
   - For each comment, verify:
     - Is the referenced code/file actually present in the PR diff?
     - Is the assumption or concern actually valid?
     - Does the suggested fix make sense in context?

3. **Cross-reference with actual code**:
   - Use `gh pr diff <PR_NUMBER>` to see the actual changes
   - Read the relevant files to understand the full context
   - Check if the AI comment misunderstood the code intent

4. **Evaluate if issues are worth addressing**:
   - Even if an assumption is technically true, assess:
     - Is it a real problem or a theoretical edge case?
     - Does fixing it add value or just noise?
     - Is it aligned with project patterns and conventions?

5. **Double-check for missed comments**:
   - PRs often have many comments - make sure you reviewed ALL of them
   - Check both general PR comments and inline review comments
   - Use `gh api repos/<owner>/<repo>/pulls/<pr_number>/comments` if needed for complete coverage

## Output Format

1. **Display a summary table** sorted by priority (Critical first):

   | # | Brief Comment | Assessment | Priority |
   |---|---------------|------------|----------|
   | 1 | Description of the concern... | ✅ Valid | Critical |
   | 2 | Description of the concern... | ✅ Valid | High |
   | 3 | Description of the concern... | ⚠️ Low Priority | Medium |
   | 4 | Description of the concern... | ⚠️ Low Priority | Low |
   | 5 | Description of the concern... | ❌ Hallucination | - |

2. **Assessment categories with emojis**:
   - ✅ Valid - Valid concern worth addressing
   - ⚠️ Low Priority - Valid but low priority / not worth the change
   - ❌ Hallucination - Incorrect assumption or hallucination
   - ✔️ Addressed - Already addressed in the code

3. **Priority levels** (order by this, Critical first):
   - Critical - Must fix before merge
   - High - Should address
   - Medium - Nice to have
   - Low - Minor improvement
   - `-` for hallucinations/addressed items

4. **After the table**, inform the user:
   > Ask for details on any item by number (e.g., "more on #2")

## Follow-up Details

When the user asks for more details on a specific item (e.g., "more on #2"):

Provide expanded information including:
- **GitHub Comment ID**: The comment ID for direct linking
- **Assessment**: Full explanation of why this assessment was given
- **Verdict**: Final recommendation with detailed reasoning
