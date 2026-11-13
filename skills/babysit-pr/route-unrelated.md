# Route an unrelated red check

The check is red on main too, so a PR already merged broke it. Hand the fix to
another session and wait for the fix to land on main.

1. **Find the culprit.** Start from the quickest signal: the latest changes on
   main to the failing code. Otherwise walk main's runs of that workflow back
   to the last run where this job was green; the first red run after it is the
   culprit commit, and its PR is the culprit PR. If the culprit PR links the
   agent session that wrote it, note that link.
2. **Claim it.** Post the marker on the culprit PR, then re-read its comments:

   ```
   <!-- babysit-pr:broken-check <job> -->
   Broken on main since <sha>; routing to a fix session.
   ```

   The oldest marker for this job wins. If another one predates yours, another
   run already routed it: delete your comment → step 5.

3. **Hand it off.** Write a self-contained message: the red job, the culprit
   commit and PR, the main run URL, the failing test and its error, and the
   culprit's session link if there is one. End with: "Fix this on a new PR
   from main, then run `/babysit-pr` on that PR."

   Deliver it through the best channel the runtime offers:

   - The runtime can message the culprit's session → send it there.
   - The runtime can start agent sessions → start a fix session with the
     message as its first prompt.
   - Neither → post the message as a comment on the culprit PR, addressed to
     the team's coding-agent bot if the repo uses one, else to the PR author.
4. **Tell this PR's session** which check broke on main and where it was
   handed (the fix session link, or the comment link).

5. **Wait.** Set `waitingOn` (culprit PR, workflow, job, start time).
   Preserve the start time on resume. Run a background command that polls
   every 60 seconds, then wait for the command to exit.

   On each poll, select main's latest completed run of that workflow and read
   its jobs, including all pages. Exit successfully only when the named job
   completed with a `success`, `skipped` or `neutral` conclusion. A missing
   run, a missing job or a red job means keep waiting; completion alone is not
   success.

   Retry network errors and HTTP 5xx responses on the next poll; escalate
   after three consecutive errors. Reset the error count after a successful
   read of both the run and its jobs. For rate limits, honor `Retry-After` or
   the rate-limit reset time. Escalate immediately for other API errors,
   including authentication or permission failures.

   Escalate with the latest run URL and the API error. Before any escalation,
   clear `waitingOn` and save the state file.

Done when that job is green on main: clear `waitingOn`, save the state file,
and return to step 2 of the loop.
