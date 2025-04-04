# Turborepo Starter Template with pnpm

Welcome to the Turborepo Starter Template! This guide provides everything you need to get started with the monorepo, including an overview of the project structure, instructions on using pnpm and Turborepo, and details about each component of the template.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
4. [pnpm Basics](#pnpm-basics)
5. [Turborepo Basics](#turborepo-basics)
6. [Template Overview](#template-overview)
   - [Apps](#apps)
   - [Packages](#packages)
7. [Scripts & Commands](#scripts--commands)
8. [Configuration Files](#configuration-files)

---

## Introduction

This Turborepo starter template is designed to streamline your development workflow in a monorepo environment using [pnpm](https://pnpm.io/) as your package manager and [Turborepo](https://turbo.build/) for task orchestration. It is preconfigured with modern tools such as ESLint, TypeScript, and Prettier, along with a sample UI component library (using shadcn/ui) for building user interfaces.

---

## Project Structure

```plaintext
turborepo-starter/
├── apps/
│   ├── express-rest-api/     # Express-based REST API backend
│   ├── next-web/             # Next.js web application
│   └── router-web/           # React Router V7-based web application
├── packages/
│   ├── eslint-config/        # Custom ESLint configuration package
│   ├── typescript-config/    # Shared TypeScript configuration package
│   └── ui/                   # shadcn UI components package
├── turbo.json                # Turborepo configuration file
├── package.json              # Root package configuration and scripts
└── README.md                 # This guide
```

---

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js (version 20 or later) installed.
- **pnpm**: The project uses [pnpm](https://pnpm.io/) as the package manager (version 10.4.1 or later).
- **Git**: For version control and working with repositories.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/turborepo-starter.git
   cd turborepo-starter
   ```

2. **Install dependencies** using pnpm:

   ```bash
   pnpm install
   ```

3. **Run the development server**:

   ```bash
   pnpm run dev
   ```

---

## pnpm Basics

[pnpm](https://pnpm.io/) is a fast, disk space-efficient package manager. Here are a few basic commands to get you started:

- **Install dependencies**:

  ```bash
  pnpm install
  ```

- **Add a package**:

  ```bash
  pnpm add <package-name>
  ```

- **Remove a package**:

  ```bash
  pnpm remove <package-name>
  ```

- **Run scripts** defined in `package.json`:

  ```bash
  pnpm run <script-name>
  ```

- **Workspace commands**: Since this is a monorepo, you can run commands in a specific package using:

  ```bash
  pnpm --filter <package-name> <command>
  ```

---

## Turborepo Basics

[Turborepo](https://turbo.build/) is a high-performance build system for JavaScript and TypeScript codebases. It allows you to run tasks across multiple projects within the monorepo efficiently. Key points include:

- **Task orchestration**: Turborepo orchestrates tasks like `dev`, `build`, and `start` across all packages.
- **Caching**: It can cache build outputs and tasks to speed up subsequent runs.
- **Parallel execution**: Tasks can run in parallel, which improves build times in larger projects.

Refer to the official Turborepo documentation for more details on advanced configurations.

---

## Template Overview

### Apps

The template includes three sample applications:

- **express-rest-api**: An Express.js backend API.
- **next-web**: A Next.js web application.
- **router-web**: A web application based on React Router V7 (aka Remix).

Each app is located under the `apps` directory and is configured to work seamlessly within the monorepo environment.

### Packages

Shared configurations and utilities are housed under the `packages` directory:

- **eslint-config**: Custom ESLint configuration to maintain code quality.
- **typescript-config**: Centralized TypeScript configuration used across apps and packages.
- **ui**: A package for shadcn UI components to help you build a cohesive UI experience.

---

## Scripts & Commands

The root `package.json` contains scripts to streamline development tasks. Here are some key commands:

- **Development**:

  ```bash
  pnpm run dev
  ```

  Runs the development server for all projects.

- **Build**:

  ```bash
  pnpm run build
  ```

  Builds all applications and packages. The build process depends on the build tasks of dependent projects and includes linting.

- **Start**:

  ```bash
  pnpm run start
  ```

  Starts the built applications.

- **Typecheck**:

  ```bash
  pnpm run typecheck
  ```

  Performs type checking across the repository.

- **Linting**:

  ```bash
  pnpm run lint
  pnpm run lint:fix
  ```

  Runs ESLint across the codebase to enforce code quality, with an option to automatically fix issues.

- **Formatting**:

  ```bash
  pnpm run format
  pnpm run format:check
  ```

  Formats code according to Prettier rules and checks for any formatting issues.

- **Clean**:

  ```bash
  pnpm run clean
  pnpm run clean:turbo
  ```

  Cleans up build artifacts and cache directories.

- **Reset**:

  ```bash
  pnpm run reset
  ```

  Cleans the Turborepo cache and reinstalls all dependencies.

- **UI Command**:

  ```bash
  pnpm --filter=ui shadcn <component-name>
  ```

  This  command allows you to generate components using the shadcn UI library in ui package.

---

## Configuration Files

### turbo.json

This file configures Turborepo's task orchestration. Key settings include:

- **Tasks**: Defines tasks such as `dev`, `build`, `start`, `typecheck`, `lint`, and `format` along with their dependencies.
- **Caching**: Controls caching behavior for faster builds.
- **Persistence**: Some tasks are set as persistent to keep services running during development.

Example snippet:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build", "lint"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "cache": false,
      "persistent": true
    },
    ...
  }
}
```

---