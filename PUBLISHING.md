# Publishing Guide for react-confetti-burst

## Pre-publish Checklist

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] TypeScript compiles without errors: `npm run typecheck`
- [ ] Version bumped in package.json
- [ ] CHANGELOG updated (if applicable)
- [ ] README is up to date

## Version Bumping

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backwards compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backwards compatible

```bash
# Patch release
npm version patch

# Minor release
npm version minor

# Major release
npm version major
```

## Publishing to npm

1. **Login to npm:**
   ```bash
   npm login
   ```

2. **Dry run to check what will be published:**
   ```bash
   npm publish --dry-run
   ```

3. **Publish:**
   ```bash
   npm publish
   ```

4. **Create a GitHub release** with the version tag

## Post-publish

- [ ] Verify package on npmjs.com
- [ ] Test installation in a fresh project
- [ ] Announce release (if significant)

## Unpublishing

If you need to unpublish within 72 hours:

```bash
npm unpublish react-confetti-burst@<version>
```

> ⚠️ Be careful! Unpublishing can break downstream projects.
