# Contributing to react-confetti-burst

Thank you for considering contributing to react-confetti-burst! This document outlines the guidelines for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run tests:**
   ```bash
   npm test
   ```
4. **Build the project:**
   ```bash
   npm run build
   ```

## Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance tasks

### Code Style

- **TypeScript:** All code must be written in TypeScript with strict mode enabled
- **No any:** Avoid using `any` type; use `unknown` or proper typing
- **Pure Functions:** Prefer pure functions where possible
- **Immutability:** Use `readonly` for properties that shouldn't be modified
- **Documentation:** Add JSDoc comments for public APIs

### Testing

- Write tests for all new features and bug fixes
- Maintain >80% code coverage
- Run `npm test` before submitting a PR

### Pull Request Process

1. Create a new branch from `main`
2. Make your changes
3. Add/update tests as needed
4. Update documentation if applicable
5. Run `npm run lint` and fix any issues
6. Run `npm test` and ensure all tests pass
7. Submit a pull request with a clear description

## Project Structure

```
react-confetti-burst/
├── src/
│   ├── index.ts          # Main exports
│   ├── types.ts          # TypeScript types
│   ├── constants.ts      # Default values
│   ├── utils.ts          # Utility functions
│   ├── particle.ts       # Particle system
│   ├── confetti-engine.ts # Canvas animation engine
│   ├── hooks.ts          # React hooks
│   └── components.tsx    # React components
├── tests/
│   ├── setup.ts          # Test setup
│   └── *.test.ts(x)      # Test files
├── examples/
│   └── *.tsx             # Usage examples
└── package.json
```

## Design Principles

1. **Zero Dependencies:** Use native APIs only
2. **TypeScript First:** Full type safety
3. **Performance:** Canvas-based rendering, no DOM thrashing
4. **SSR Safe:** Handle server-side rendering gracefully
5. **Small Bundle:** Keep the package size minimal

## Questions?

Feel free to open an issue for any questions or concerns.
