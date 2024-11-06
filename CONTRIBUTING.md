# Contributing to Crous'Tillant

First of all, thank you for considering contributing to this project! We appreciate your time and effort.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
    - [Reporting Bugs](#reporting-bugs)
    - [Feature Requests](#feature-requests)
    - [Pull Requests](#pull-requests)
3. [Development Setup](#development-setup)
    - [Prerequisites](#prerequisites)
    - [Setting Up the Next.js TypeScript App](#setting-up-the-nextjs-typescript-app)
    - [Setting Up Prisma with PostgreSQL](#setting-up-prisma-with-postgresql)
    - [Setting Up the Python Scraper](#setting-up-the-python-scraper)
4. [Style Guides](#style-guides)
    - [Git Commit Messages](#git-commit-messages)
    - [TypeScript and Python Code Style](#typescript-and-python-code-style)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [adlen.cherif@cpe.fr](mailto:adlen.cherif@cpe.fr).

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please report it by [opening an issue](https://github.com/cherifad/CrousTillant/issues). Please include:

- A clear and descriptive title.
- A detailed description of the issue.
- Steps to reproduce the issue.
- Any relevant logs or screenshots.

### Feature Requests

We welcome new ideas! To request a feature, please [open an issue](https://github.com/cherifad/CrousTillant/issues) with:

- A clear and descriptive title.
- A detailed description of the feature.
- Any additional context or examples.

### Pull Requests

If you have a fix or an improvement, feel free to submit a pull request. Please follow these steps:

1. Fork the repository.
2. Create a new branch from `main` (e.g., `feature/new-feature` or `fix/bug-name`).
3. Make your changes.
4. Test your changes thoroughly.
5. Commit and push your changes to your fork.
6. Open a pull request against the `main` branch.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [Python](https://www.python.org/) (version 3.8 or higher)
- [PostgreSQL](https://www.postgresql.org/) (version 12 or higher)
- [Git](https://git-scm.com/)

### Setting Up the Next.js TypeScript App

1. Clone the repository:
    ```bash
    git clone https://github.com/cherifad/CrousTillant.git
    cd CrousTillant
    ```

2. Navigate to the Next.js app directory:
    ```bash
    cd front
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Set up the environment variables. Create a `.env` file in the root of the `nextjs-app` directory and add the following:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
    ```

    Replace `user`, `password`, `localhost`, `5432`, and `mydatabase` with your PostgreSQL credentials and database details.

5. Initialize Prisma:
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

6. Start the development server:
    ```bash
    npm run dev
    ```

   The app should now be running at [http://localhost:3000](http://localhost:3000).

### Setting Up Prisma with PostgreSQL

Prisma is an ORM (Object-Relational Mapping) tool that simplifies database interactions. To use Prisma with PostgreSQL, follow these steps:

1. Make sure PostgreSQL is installed and running on your machine.
2. Create a new PostgreSQL database.
3. Configure the `DATABASE_URL` environment variable in your `.env` file (as described above).
4. Define your data models in the `schema.prisma` file located in the `prisma` directory.
5. Run migrations to set up your database schema:
    ```bash
    npx prisma migrate dev --name init
    ```
6. Generate the Prisma client:
    ```bash
    npx prisma generate
    ```

### Setting Up the Python Scraper

1. Navigate to the Python scraper directory:
    ```bash
    cd scraper
    ```

2. Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Run the scraper:
    ```bash
    python main.py
    ```

## Style Guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- Limit the first line to 72 characters or less.
- Reference issues and pull requests liberally.

### TypeScript and Python Code Style

- Follow [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for TypeScript code formatting and linting. You can run `npm run lint` to check for linting errors and `npm run format` to automatically format your code.
- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) for Python code style. Consider using a linter like [flake8](https://flake8.pycqa.org/en/latest/) to check your code.

Thank you for contributing!
