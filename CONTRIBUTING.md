# Contributing to DEEVO Cortex

Thank you for your interest in contributing to DEEVO! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

1. **Check existing issues** - Search the [issue tracker](https://github.com/PyBADR/deevo-cortex/issues) to see if the bug has already been reported.
2. **Create a new issue** - If not found, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, browser, Node version, Python version)
   - Screenshots if applicable

### Suggesting Features

1. **Check existing discussions** - Review open issues and discussions first.
2. **Create a feature request** - Include:
   - Clear description of the feature
   - Use case and motivation
   - Potential implementation approach
   - Any relevant examples

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed
4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new signal processing capability"
   ```
5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Development Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- npm or yarn
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
pip install -r requirements.txt
python run.py
```

## Code Style

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Prefer functional components in React

### Python

- Follow PEP 8 guidelines
- Use type hints for function arguments and returns
- Add docstrings for functions and classes
- Use descriptive variable names

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements

Example:
```
feat: add support for custom signal aggregation

This allows users to define their own signal aggregation
functions for domain-specific intelligence gathering.

Closes #123
```

## Review Process

1. All PRs require at least one review
2. CI checks must pass (linting, tests, builds)
3. Documentation must be updated if needed
4. Breaking changes require discussion
5. Code coverage should not decrease

## Testing

### Frontend Tests

```bash
cd frontend
npm test
```

### Backend Tests

```bash
pytest tests/
```

## Documentation

- Update README.md if adding features or changing setup
- Add comments for complex logic
- Update API documentation if changing endpoints
- Include examples for new features

## Architecture Guidelines

- Follow the 7-layer architecture pattern
- Keep signal processing modular
- Maintain separation between UI and backend logic
- Use TypeScript interfaces for data contracts

## Questions?

- Open a [Discussion](https://github.com/PyBADR/deevo-cortex/discussions)
- Email us at bader.marketing.39@gmail.com

---

Thank you for contributing to DEEVO! 🚀
