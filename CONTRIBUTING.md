# Contributing to Wise Signer

Thank you for considering contributing to Wise Signer! This document provides guidelines and instructions for contributing to this Next.js project.

## Table of Contents

- [Contributing to Wise Signer](#contributing-to-wise-signer)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Getting Started](#getting-started)
    - [Project Setup](#project-setup)
    - [Development Workflow](#development-workflow)
  - [How to Contribute](#how-to-contribute)
    - [Reporting Bugs](#reporting-bugs)
    - [Suggesting Features](#suggesting-features)
    - [Pull Requests](#pull-requests)
  - [Style Guide](#style-guide)
    - [Code Formatting](#code-formatting)
    - [Commit Messages](#commit-messages)
  - [Project Structure](#project-structure)
  - [Documentation](#documentation)

## Code of Conduct

Please be respectful and inclusive when contributing to this project. We aim to foster an open and welcoming community.

## Getting Started

### Project Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/wise-signer.git
   cd wise-signer
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

### Development Workflow

1. **Start the development server**:
   ```bash
   npm run dev
   ```
2. **Access the app** at http://localhost:3000
3. **Make changes** to the codebase
4. **See your changes** reflected in real-time

## How to Contribute

### Reporting Bugs

If you find a bug in the project:

1. Check if the bug has already been reported in the Issues section
2. If not, create a new issue with:
   - A clear title
   - A description of the bug
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots if applicable
   - Environment information (browser, OS, etc.)

### Suggesting Features

Have an idea to improve Wise Signer? We'd love to hear it!

1. Check if the feature has already been suggested in the Issues section
2. If not, create a new issue with:
   - A clear title prefixed with "[Feature]"
   - A detailed description of the feature
   - Any relevant mock-ups or examples
   - Why this feature would be beneficial to the project

### Pull Requests

1. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/bug-description
   ```

2. **Make your changes** and commit them with descriptive commit messages

3. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** from your fork to the main repository:
   - Use a clear title and description
   - Reference related issues using #issue-number
   - Fill out the PR template if one exists

5. **Address review comments** if requested

## Style Guide

### Code Formatting

- We use ESLint and Prettier for code formatting
- Run linting before submitting a PR:
  ```bash
  npm run lint
  ```
- Fix auto-fixable linting issues:
  ```bash
  npm run lint:fix
  ```

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Fix bug" not "Fixes bug")
- Limit the first line to 72 characters
- Reference issues and pull requests after the first line

## Project Structure

The Wise Signer project follows the Next.js App Router structure:

```
./src
├── app                  # App Router pages and routing
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── simulated        # Simulated wallet routes
│   ├── tenderly         # Tenderly routes
│   └── tools            # Tools & resources
├── components           # Reusable components
├── data                 # Data files and configurations
├── types                # TypeScript type definitions
└── utils                # Utility functions
```

## Documentation

- Comment your code, especially complex logic
- Update README.md when making significant changes
- Add JSDoc comments to functions and components

Thank you for contributing to Wise Signer!