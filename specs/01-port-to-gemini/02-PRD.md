# Product Requirements Document (PRD)
**Project Name:** Obsidian Skills Port for Gemini & Antigravity
**Date:** 2026-04-25

## 1. Introduction
### 1.1 Purpose
The purpose of this project is to make the `obsidian-skills` repository compatible with Google's Gemini CLI and Antigravity AI assistants. Currently, the repository is formatted specifically for Claude Code using the Agent Skills specification.

### 1.2 Target Audience
*   Developers and power users using Antigravity for pair programming within Obsidian vaults.
*   Users leveraging Gemini CLI for terminal-based AI interactions requiring Obsidian context.

## 2. Product Vision
To provide a seamless, command-line driven way to inject Obsidian-specific knowledge (Markdown flavors, JSON Canvas specs, etc.) into Gemini-backed assistants, without disrupting the existing Claude compatibility. The repository will remain the single source of truth for the skill content.

## 3. Functional Requirements

### 3.1 Antigravity Deployment
*   **Req 3.1.1:** A script must exist to convert Agent Skills format into Antigravity Knowledge Item (KI) format.
*   **Req 3.1.2:** The script must extract the YAML frontmatter (`name`, `description`) from `SKILL.md` and generate a compliant `metadata.json`.
*   **Req 3.1.3:** The script must copy the body of `SKILL.md` and any `references/` into an `artifacts/` subdirectory for the KI.
*   **Req 3.1.4:** The script should deploy these KIs directly to the user's Antigravity data directory (default: `C:\Users\<user>\.gemini\antigravity\knowledge`).

### 3.2 Gemini CLI Build
*   **Req 3.2.1:** A script must exist to compile the skills into Gemini-compatible prompt files.
*   **Req 3.2.2:** The script must support outputting a single, unified markdown file containing all skills for users who want complete context.
*   **Req 3.2.3:** The script must support outputting individual markdown files per skill for modular context injection.
*   **Req 3.2.4:** The build artifacts should be saved in a local `dist/` or `out/` folder within the repository.

### 3.3 Maintainability
*   **Req 3.3.1:** The original `skills/` directory structure and files MUST NOT be modified under any circumstances. This is a strict requirement to allow seamless merging and pulling of upstream updates from the original repository.
*   **Req 3.3.2:** The scripts should be easily runnable via `npm` or `yarn` (e.g., via `package.json` scripts).

## 4. Non-Functional Requirements
*   **Idempotency:** Running the deployment or build scripts multiple times should safely overwrite previous outputs without causing duplication or errors.
*   **Cross-Platform:** The scripts should run successfully on Windows, macOS, and Linux.
*   **Performance:** The conversion scripts should execute in under 5 seconds.

## 5. Success Metrics
*   Successful deployment of KIs to Antigravity and validation that Antigravity can read the `metadata.json` and `artifacts`.
*   Successful generation of Gemini CLI prompts.
*   Updated `README.md` clearly documenting the new commands.
