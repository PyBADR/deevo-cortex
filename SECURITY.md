# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | ✅ Yes             |
| 1.x.x   | ❌ No              |
| 0.x.x   | ❌ No              |

## Reporting a Vulnerability

We take security seriously at DEEVO. If you discover a security vulnerability, please follow these steps:

### Do NOT

- Open a public GitHub issue
- Disclose the vulnerability publicly before it's fixed
- Exploit the vulnerability beyond what's necessary to demonstrate it
- Test the vulnerability on production systems

### Do

1. **Email us directly** at bader.marketing.39@gmail.com with:
   - Title and description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Any suggested fixes
   - Your contact information and PGP key (if available)

2. **Allow time for response** - We aim to:
   - Acknowledge receipt within 24 hours
   - Provide an initial assessment within 48 hours
   - Deploy fixes within 7 days for critical vulnerabilities

3. **Coordinate disclosure** - Work with us to fix the issue before public disclosure

4. **Credit** - We will acknowledge your contribution when disclosing the vulnerability (unless you prefer anonymity)

## Security Measures

### Data Protection

- All data is processed locally by default
- No sensitive data is transmitted without explicit configuration
- API keys and credentials are never logged
- Sensitive variables are redacted in logs and error messages

### Authentication

- API endpoints support token-based authentication
- Rate limiting is implemented on all endpoints (100 requests/minute)
- CORS is configured for production deployments only
- Session tokens expire after 1 hour of inactivity

### Dependencies

- Dependencies are regularly audited via npm audit and pip-audit
- Automated security scanning via GitHub Dependabot
- Critical vulnerabilities are patched within 24 hours
- All production dependencies are pinned to specific versions

### Infrastructure

- HTTPS enforced in production
- Security headers configured (CSP, X-Frame-Options, etc.)
- Rate limiting and DDoS protection
- Regular security updates for all systems

## Best Practices for Deployment

### 1. Environment Variables

Never commit secrets to the repository:

```bash
# Good - use .env.local (not committed)
BACKEND_API_KEY=xxx
DATABASE_PASSWORD=xxx

# Bad - never do this
const API_KEY = "secret-key-123"
```

Use environment variables for:
- API keys and tokens
- Database credentials
- Third-party service credentials
- Configuration secrets

### 2. Network Security

- Deploy behind a reverse proxy (nginx, Cloudflare)
- Enable HTTPS/TLS in production
- Configure proper firewall rules
- Use VPN for internal communications
- Implement DDoS protection

### 3. Access Control

- Implement role-based access control (RBAC)
- Use principle of least privilege
- Audit access logs regularly
- Rotate credentials periodically (every 90 days)
- Monitor for suspicious activity

### 4. Database Security

- Use encrypted connections (SSL/TLS)
- Enable database authentication
- Implement query parameterization
- Regular backups with encryption
- Test backup recovery procedures

### 5. API Security

- Validate all inputs (whitelist approach)
- Implement rate limiting
- Use API keys with expiration
- Log all API access
- Monitor for abuse patterns

## Vulnerability Disclosure Timeline

Once a vulnerability is reported:

1. **Day 0**: Acknowledge receipt and begin assessment
2. **Day 1-3**: Reproduce and assess severity
3. **Day 4-7**: Develop and test fix
4. **Day 8**: Release patch
5. **Day 9**: Public disclosure (coordinated with reporter)

Critical vulnerabilities may be expedited.

## Security Checklist for Production

Before deploying DEEVO Cortex to production:

- [ ] All dependencies are up to date
- [ ] Environment variables are configured securely
- [ ] HTTPS/TLS is enabled
- [ ] Rate limiting is configured
- [ ] Logging and monitoring are in place
- [ ] Database backups are tested
- [ ] Access logs are being collected
- [ ] Security headers are configured
- [ ] Regular security audits are scheduled
- [ ] Incident response plan is documented

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who help improve DEEVO's security.

Thank you to the following researchers who have responsibly disclosed vulnerabilities:
- (None yet - help us improve!)

---

For general questions, please use [GitHub Discussions](https://github.com/PyBADR/deevo-cortex/discussions).
