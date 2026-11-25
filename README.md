# Next.js boilerplate (vitest + react testing library (with jest dom) + tailwindcss + eslint + prettier + husky + commitlint)

This is a Next.js boilerplate that comes with the following features:

- [Vitest](https://vitest.dev/) for testing
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for testing React components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [ESLint](https://eslint.org/) for linting
- [Prettier](https://prettier.io/) for code formatting
- [Husky](https://typicode.github.io/husky/#/) for Git hooks (like pre-commit for automatically lint your commit messages, code, and run tests upon committing or pushing).
- [Commitlint](https://commitlint.js.org/) for commit message linting

## New options applied (after initializing libraries)

### React Testing Library (with Jest DOM)

- Configure TypeScript and Vitest to accept Jest DOM useful matchers like toBeInTheDocument, toHaveClass, toBeDisabled, toHaveAttribute, etc. (see [@testing-library/jest-dom](https://www.npmjs.com/package/@testing-library/jest-dom) for more details).

### Husky

- Runs every commit (in order) to ensure code quality and consistency:
  - commitlint (for commit message linting)
  - npm test (for running tests)
  - npm run lint (for linting the codebase)
  - npm run format (for formatting the codebase with Prettier only if needed)

### Prettier

- npm script `format` is added to format the codebase with Prettier just when there's unformatted files (runs `--check` before `--write`).
- Better integration with ESLint using `eslint-config-prettier`.
- Intentional config options (e.g., `tabWidth`, `semi`, `singleQuote`) are set to ensure consistency.

### TailwindCSS

- Automatically sorts classes based on TailwindCSS team's recommended class order with prettier plugin (prettier-plugin-tailwindcss)

### Vitest

- Configured to work with compatible @types/node v22.12.0 (`create-next-app@latest` (version v16) starts with incompatible v20).
- Globals enabled with typescript support (like Jest does automatically).
- The test environment is set to `jsdom` for testing React components.
- Use the new tsconfigPaths native option instead of deprecated `vite-tsconfig-paths` plugin for path aliasing.
