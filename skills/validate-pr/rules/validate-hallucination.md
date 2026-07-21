---
title: Distinguish Hallucinations From Valid Concerns
impact: CRITICAL
impactDescription: the core purpose of the skill is separating real feedback from invented feedback
tags: validate, hallucination, critical-thinking, intent
---

## Distinguish Hallucinations From Valid Concerns

Think critically about each comment. AI-generated review comments mix genuine findings with confident-sounding fabrications and misread intent. Classify each one deliberately rather than assuming the reviewer was right.

**Why:** The entire point of validating AI PR comments is to protect the author from acting on invented problems. A comment that reads as authoritative may rest on code that does not exist, an assumption that does not hold, or a misunderstanding of what the change intends.

**Incorrect (treat every AI comment as a real finding):**

```text
"The reviewer says this leaks a connection, so it's a valid Critical issue."
→ No check of whether the connection is actually closed elsewhere.
```

**Correct (interrogate the claim before trusting it):**

For each comment ask:
- Does the referenced code actually exist and behave as described? (see `validate-against-diff`)
- Is the underlying **assumption** true, or does other code already handle it?
- Did the reviewer misunderstand the change's **intent**?
- Does the suggested fix even make sense in this context?

Land on one of four verdicts:
- ✅ **Valid** — real, correctly understood, worth addressing.
- ⚠️ **Low Priority** — technically true but minor / not worth the change.
- ❌ **Hallucination** — references absent code, a false assumption, or a misread.
- ✔️ **Addressed** — already handled in the code as written.

Default to skepticism: if a claim cannot be substantiated against the diff, it is a hallucination, not a "maybe".
