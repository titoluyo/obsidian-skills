# Architectural Notes & Design Decisions

This document captures important design decisions made during the porting process, specifically regarding how different agents handle context.

## 1. Directory Structures vs. Flat Context
A key difference between AI agents is how they ingest contextual knowledge:

*   **Folder-Based Agents (Claude Code, Antigravity, Gemini Interactive REPL):** These agents are capable of traversing directory trees. They look at a root directory (like `.claude/`, `.gemini/antigravity/knowledge/`, or `~/.agents/skills/` for Gemini interactive REPLs) and can dynamically read `references/` subfolders as needed. Therefore, our deployment scripts (`deploy-antigravity.js` and `deploy-agents.js`) preserve the exact directory structure of the original skills, including recursive subfolders.
*   **Prompt-Based Agents (Gemini CLI standalone):** CLIs like Gemini running in standalone pipeline modes typically accept context via a single payload (e.g., passing a file to `--system-prompt`). They do not natively crawl folder structures during runtime.

## 2. Completeness in Gemini Prompts
Because Gemini CLI doesn't traverse subdirectories, a naive copy would result in the loss of crucial information stored in `references/` (such as `FUNCTIONS_REFERENCE.md` or `EXAMPLES.md`). 

To ensure **100% data completeness**, the `build-gemini.js` script was designed to automatically flatten the data:
1. It reads the main `SKILL.md` file.
2. It recursively crawls any `references/` subdirectories.
3. It concatenates the content of all found reference markdown files directly onto the bottom of the generated Gemini prompt.

**Result:** The generated files in `dist/gemini-prompts/` are larger, single-file documents containing the exact same amount of data and examples as the multi-file directory structures used by Claude and Antigravity. Nothing is lost; it is simply formatted on a "single silver platter" optimized for Gemini's ingestion method.
