# Implementation Tasks
**Project:** Obsidian Skills Port for Gemini & Antigravity

This document outlines the step-by-step tasks required to implement the specifications detailed in `01-plan.md`, `02-PRD.md`, and `03-spec.md`.

## Phase 1: Setup
- [ ] Create a `scripts/` directory at the root of the repository.
- [ ] Initialize dependencies in `package.json` if needed (e.g., `npm install gray-matter` or `fs-extra`), or confirm the use of purely native Node.js modules (`fs`, `path`).
- [ ] Update `.gitignore` to ignore the `dist/` folder where Gemini prompts will be built.

## Phase 2: Antigravity Deployment Script (`scripts/deploy-antigravity.js`)
- [ ] Write logic to iterate through the `skills/` directory.
- [ ] Implement a parser for the YAML frontmatter inside each `SKILL.md` file.
- [ ] Write logic to dynamically resolve the local Antigravity knowledge path (`~/.gemini/antigravity/knowledge/`).
- [ ] For each skill, generate the corresponding `metadata.json` using the parsed `name` and `description`.
- [ ] For each skill, strip the frontmatter from `SKILL.md` and copy the body to the Antigravity `artifacts/skill.md` path.
- [ ] Ensure that any subdirectories, like `references/`, are recursively copied into the `artifacts/` folder.
- [ ] Validate that the script is strictly read-only regarding the original `skills/` directory.

## Phase 3: Gemini CLI Build Script (`scripts/build-gemini.js`)
- [ ] Write logic to iterate through the `skills/` directory.
- [ ] Ensure the output directory `dist/gemini-prompts/` exists (and is cleaned before the build).
- [ ] Implement the build logic for **Split Prompts**: 
  - For each skill, compile `SKILL.md` (without frontmatter) and the contents of any markdown files in its `references/` folder into a single `<skill-name>.md` file.
- [ ] Implement the build logic for the **Unified Prompt**: 
  - Concatenate all generated split prompts into a single `all-skills.md` file.
- [ ] Validate that the script is strictly read-only regarding the original `skills/` directory.

## Phase 4: Integration & Documentation
- [ ] Add npm run scripts to `package.json` for easy execution:
  - `"deploy:antigravity": "node scripts/deploy-antigravity.js"`
  - `"build:gemini": "node scripts/build-gemini.js"`
- [ ] Update the repository's main `README.md` to explain the new file structures, how to build prompts for Gemini CLI, and how to deploy to local Antigravity.

## Phase 5: Testing
- [ ] Run `npm run deploy:antigravity` and verify the files appear correctly in `<appDataDir>/knowledge/`.
- [ ] Run `npm run build:gemini` and verify the `dist/gemini-prompts/` directory contains correctly formatted markdown files.
- [ ] Verify `git status` shows no modifications inside the `skills/` directory.
