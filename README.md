# ESLINT-PRETTIER-HUSKY

## About

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.4.

The purpose of this project is to demonstrate a set of rules for eslint and prettier, apply them through husky pre-commit hook and in that way enable uniform code writing at the team level, in accordance with up-to-date best practices and community recommendations.

Eslint settings are located in the `.eslintrc.json` file, while prettier rules are listed in `.prettierrc.json`. When running the pre-commit hook, the `lint-staged` command is executed, defined through `.lintstagedrc.json`. Also, attention should be paid to `.editorconfig` which is aligned with prettier rules.

## Prerequisites

| Installation | Version |
| ------------ | ------- |
| Node.js      | 22.21.0 |
| npm          | 10.9.4  |

## Recommended Extensions for VS Code

It's recommended to use **VS Code** for development.
The following VS Code extensions are Recommended:

| Name                     | ID                                        |
| ------------------------ | ----------------------------------------- |
| Angular Language Service | **Angular.ng-template**                   |
| Code Spell Checker       | **streetsidesoftware.code-spell-checker** |
| Prettier ESLint          | **rvest.vs-code-prettier-eslint**         |
| Prettier                 | **esbenp.prettier-vscode**                |
| ESLint                   | **dbaeumer.vscode-eslint**                |
| EditorConfig             | **editorconfig.editorconfig**             |

## Development guide

### Installation

To install dependencies, run:

```bash
npm install
```

### Development server

To start a local development server, run:

```bash
npm run start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.
