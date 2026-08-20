# Security policy

Report vulnerabilities privately to the repository maintainers. Do not open a public issue with exploit details, credentials, personal data, or access tokens.

Secrets must be stored in GitHub or Cloudflare secrets, never in committed `.env` files. The pre-commit hook scans staged files, and CI runs Gitleaks on pull requests and pushes.
