# Implementation Tasks
**Project:** Obsidian Skills Port for Gemini & Antigravity

This document outlines the step-by-step tasks required to implement the specifications detailed in `01-plan.md`, `02-PRD.md`, and `03-spec.md`.

## Phase 1: Setup
- [x] Create a `scripts/` directory at the root of the repository.
- [x] Initialize dependencies in `package.json` if needed (e.g., `npm install gray-matter` or `fs-extra`), or confirm the use of purely native Node.js modules (`fs`, `path`).
- [x] Update `.gitignore` to ignore the `dist/` folder where Gemini prompts will be built.

## Phase 2: Antigravity Deployment Script (`scripts/deploy-antigravity.js`)
- [x] Write logic to iterate through the `skills/` directory.
- [x] Implement a parser for the YAML frontmatter inside each `SKILL.md` file.
- [x] Write logic to dynamically resolve the local Antigravity knowledge path (`~/.gemini/antigravity/knowledge/`).
- [x] For each skill, generate the corresponding `metadata.json` using the parsed `name` and `description`.
- [x] For each skill, strip the frontmatter from `SKILL.md` and copy the body to the Antigravity `artifacts/skill.md` path.
- [x] Ensure that any subdirectories, like `references/`, are recursively copied into the `artifacts/` folder.
- [x] Validate that the script is strictly read-only regarding the original `skills/` directory.

## Phase 3: Gemini CLI Build Script (`scripts/build-gemini.js`)
- [x] Write logic to iterate through the `skills/` directory.
- [x] Ensure the output directory `dist/gemini-prompts/` exists (and is cleaned before the build).
- [x] Implement the build logic for **Split Prompts**: 
  - For each skill, compile `SKILL.md` (without frontmatter) and the contents of any markdown files in its `references/` folder into a single `<skill-name>.md` file.
- [x] Implement the build logic for the **Unified Prompt**: 
  - Concatenate all generated split prompts into a single `all-skills.md` file.
- [x] Validate that the script is strictly read-only regarding the original `skills/` directory.

## Phase 4: Integration & Documentation
- [x] Add npm run scripts to `package.json` for easy execution:
  - `"deploy:antigravity": "node scripts/deploy-antigravity.js"`
  - `"build:gemini": "node scripts/build-gemini.js"`
- [x] Ensure all folder structures (like `dist/gemini-prompts/`) and script names are strictly scoped by agent name to avoid collisions when future CLI agents are added.
- [x] Modify the repository's main `README.md` to add this new multi-agent capability. Explain what this capability is, how to use the deployment/build scripts for Gemini and Antigravity, and provide other relevant knowledge to the user.

## Phase 5: Testing
- [x] Run `npm run deploy:antigravity` and verify the files appear correctly in `<appDataDir>/knowledge/`.
- [x] Run `npm run build:gemini` and verify the `dist/gemini-prompts/` directory contains correctly formatted markdown files.
- [x] Verify `git status` shows no modifications inside the `skills/` directory.
