# Gemini Project Context: MD-View

## Project Overview

MD-View is a free, open-source, and web-based Markdown editor with a real-time live preview. It is built with modern web technologies, including Next.js 15, React 19, TypeScript, and Tailwind CSS. The application provides a fast and beautiful interface for writing and previewing Markdown, suitable for creating documentation, READMEs, notes, and blog posts.

The editor supports GitHub Flavored Markdown (GFM), syntax highlighting for various programming languages, and multiple color themes. It also includes features like file import/export, different view modes (editor, preview, split), and local storage persistence for unsaved work.

## Building and Running

### Prerequisites

- Node.js 18.18+ (or 20+)

### Key Commands

- **Install dependencies:**

  ```bash
  npm ci
  ```

- **Run the development server:**

  ```bash
  npm run dev
  ```

  The application will be available at [http://localhost:3000](http://localhost:3000).

- **Build for production:**

  ```bash
  npm run build
  ```

- **Start the production server:**

  ```bash
  npm run start
  ```

- **Run linter:**

  ```bash
  npm run lint
  ```

- **Run prettier to format the code:**

  ```bash
  npm run format
  ```

- **Check for formatting issues:**

  ```bash
  npm run format:check
  ```

- **Run type checking:**

  ```bash
  npm run typecheck
  ```

## Development Conventions

### Code Style

- The project uses [Prettier](https://prettier.io/) for code formatting and [ESLint](https://eslint.org/) for linting.
- Adhere to the existing formatting rules by running `npm run format` before committing changes.

### Testing

- The project does not appear to have a dedicated test suite set up.
- For any new feature, consider adding relevant unit or integration tests.

### Contribution Guidelines

- Contributions are welcome.
- For major changes, open an issue first to discuss the proposed changes.
- Follow the standard fork, branch, commit, and pull request workflow.
