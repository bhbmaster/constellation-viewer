# Contributing to Constellation Viewer

Thank you for your interest in contributing to the Constellation Viewer! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use the [GitHub Issues](https://github.com/bhbmaster/constellation-viewer/issues) page
- Search existing issues before creating new ones
- Provide detailed information about the issue
- Include steps to reproduce if it's a bug

### Suggesting Features
- Use the [GitHub Discussions](https://github.com/bhbmaster/constellation-viewer/discussions) page
- Describe the feature and its benefits
- Consider implementation complexity
- Check if similar features already exist

### Code Contributions
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## 🛠 Development Setup

### Prerequisites
- Node.js 14 or higher
- Git
- Modern web browser

### Setup Steps
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/constellation-viewer.git
cd constellation-viewer

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📝 Code Style Guidelines

### JavaScript
- Use ES6+ features
- Follow existing code patterns
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused

### CSS
- Use consistent indentation (2 spaces)
- Group related properties
- Use meaningful class names
- Follow BEM methodology when appropriate

### HTML
- Use semantic HTML elements
- Include proper accessibility attributes
- Keep structure clean and logical

## 🧪 Testing Guidelines

### Writing Tests
- Write tests for new features
- Aim for high test coverage
- Use descriptive test names
- Test edge cases and error conditions

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex algorithms
- Include usage examples
- Update API documentation

### User Documentation
- Update README.md for user-facing changes
- Add screenshots for UI changes
- Update changelog for significant changes

## 🎯 Areas for Contribution

### High Priority
- Additional constellation data
- Enhanced mobile support
- Performance optimizations
- Accessibility improvements

### Medium Priority
- New astronomical features
- UI/UX enhancements
- Plugin system
- Internationalization

### Low Priority
- Advanced visualizations
- Additional data sources
- Export functionality
- Advanced search features

## 🐛 Bug Reports

### Before Reporting
- Check if the issue already exists
- Try the latest version
- Test in different browsers
- Gather relevant information

### Bug Report Template
```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- Browser: [e.g. Chrome 91]
- OS: [e.g. Windows 10]
- Version: [e.g. 2.0.0]

**Additional Context**
Any other relevant information.
```

## ✨ Feature Requests

### Feature Request Template
```markdown
**Feature Description**
A clear description of the feature.

**Use Case**
Why would this feature be useful?

**Proposed Solution**
How would you like to see this implemented?

**Alternatives**
Any alternative solutions you've considered.

**Additional Context**
Any other relevant information.
```

## 🔄 Pull Request Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] No merge conflicts
- [ ] Commit messages are clear

### Pull Request Template
```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added if applicable
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 📋 Commit Guidelines

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

### Examples
```
feat(star-map): add constellation search functionality
fix(coordinates): correct sky-to-screen transformation
docs(api): update StarMap class documentation
```

## 🏷 Release Process

### Version Numbering
- **Major** (X.0.0): Breaking changes
- **Minor** (X.Y.0): New features
- **Patch** (X.Y.Z): Bug fixes

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Tagged and released

## 💬 Communication

### Getting Help
- **GitHub Discussions**: For questions and discussions
- **GitHub Issues**: For bug reports and feature requests
- **Email**: [bhbmaster@gmail.com](mailto:bhbmaster@gmail.com)

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the golden rule

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to the Constellation Viewer! 🌟
