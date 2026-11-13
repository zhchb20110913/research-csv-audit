# Contributing to Research CSV Audit
Thank you for helping improve Research CSV Audit. Contributions that make research-data checks clearer, safer, or easier to reproduce are welcome.
## Development requirements
- Node.js 20 or newer
- Git
- No package installation is required; the project has no runtime dependencies
## Local setup
```bash
git clone https://github.com/zhchb20110913/research-csv-audit.git
cd research-csv-audit
node --test
```
Run the sample audit after the tests pass:
```bash
node bin/research-csv-audit.js samples/experiment.csv
```
## Contribution workflow
1. Fork the repository and create a focused branch from `main`.
2. Make one logically related change per pull request.
3. Add or update tests when behavior changes.
4. Run `node --test` and the sample audit locally.
5. Open a pull request that explains the problem, the change, and how it was verified.
## Project conventions
- Prefer Node.js standard-library APIs and keep runtime dependencies at zero unless a dependency is clearly justified.
- Keep CSV parsing and statistical calculations deterministic.
- Preserve existing CLI behavior unless the pull request documents a deliberate breaking change.
- Treat IQR results as screening signals, not automatic data-removal decisions.
- Add small, readable fixtures for parsing or calculation edge cases.
## Pull request checklist
- [ ] The change is focused and documented.
- [ ] All tests pass with `node --test`.
- [ ] New behavior includes test coverage.
- [ ] Markdown and JSON output remain valid when relevant.
- [ ] No generated reports or private research data are committed.
## Reporting problems
When reporting a bug, include the command used, the expected result, the actual result, and a minimal anonymized CSV example when possible. Never include confidential or personally identifiable research data.
