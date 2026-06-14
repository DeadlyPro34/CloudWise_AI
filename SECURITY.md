# Security Policy

## Supported Versions

CloudWise AI is currently under active development. We actively support the latest release and the `main` branch with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅                 |
| < 1.0   | ❌                 |

## Vulnerability Reporting Process

We take the security of CloudWise AI seriously. If you discover a security vulnerability within this project, please **do not open a public issue**. 

Instead, please report it privately by reaching out to the maintainers:
- Security Team: `security@ideaforge.ai` (placeholder)

### What to include in your report:
- A clear description of the vulnerability and its potential impact.
- Detailed steps to reproduce the issue.
- Any potential mitigations or suggested solutions.

### Response Timeline
- We will acknowledge receipt of your vulnerability report within **48 hours**.
- We will provide a status update on our investigation within **1 week**.
- Once a fix is developed and tested, we will coordinate the patch release and ensure you are properly credited for your discovery.

## Security Practices

CloudWise AI adheres to the following security practices:
- **Authentication**: JWT-based authentication with Argon2 password hashing.
- **AWS Credentials**: Encrypted at rest using Fernet symmetric encryption. Role-based (STS AssumeRole) patterns are highly recommended for production.
- **API Protection**: Rate limiting is applied via SlowAPI on authentication, AWS syncing, and AI endpoints.
- **CORS & Headers**: Strict CORS policies and security headers (HSTS, X-Frame-Options) are enforced via FastAPI middleware.
- **Data Integrity**: SQLAlchemy ORM with parameterized queries protects against SQL Injection.

Thank you for helping keep CloudWise AI secure!
