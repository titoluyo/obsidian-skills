# Project Plan: Port to Gemini and Antigravity

## Objective
Adapt the `obsidian-skills` repository, originally built for Claude Code using the Agent Skills specification, to be usable by Google's Gemini CLI and Antigravity assistant.

## Background
The repository currently contains Markdown-based instruction sets (skills) with YAML frontmatter in a `skills/` directory. Each skill folder has a `SKILL.md` file and an optional `references/` directory.

## Adaptation Strategy

**CRITICAL REQUIREMENT:** The original code (e.g., the `skills/` directory) MUST NOT be modified. All adaptations must be done via non-destructive build/deployment scripts. This ensures that we can seamlessly merge and pull upstream updates from the original repository without conflicts.

### 1. Antigravity Knowledge Items (KIs)
Antigravity uses Knowledge Items stored in a local directory (`<appDataDir>\knowledge\`). Each KI requires a `metadata.json` and an `artifacts/` folder.
*   **Action:** Create a deployment script that reads each skill, converts the `SKILL.md` frontmatter to `metadata.json`, and copies the markdown body and references to the `artifacts/` folder inside the local Antigravity knowledge base.

### 2. Gemini CLI Prompts
Gemini CLI relies on system instructions passed as text files, without a standard "plugin" directory structure.
*   **Action:** Create a build script that processes the skills into usable Gemini CLI prompts. We will support two outputs:
    1.  **Unified Prompt (`obsidian-system-prompt.md`)**: All skills compiled into a single mega-prompt for broad context.
    2.  **Split Prompts (`prompts/<skill>.md`)**: Individual prompt files for targeted context injection.

### 3. Global Agents CLI (Interactive REPLs)
Agents with interactive REPLs (like `gemini-cli` in interactive mode or Claude Code) rely on a global skills directory adhering to the Agent Skills specification.
*   **Action:** Create a deployment script (`deploy-agents.js`) that safely copies the raw `skills/` directory directly into the user's `~/.agents/skills/` profile directory so commands like `/skills list` can detect them automatically.

### 4. Extensible Architecture for Future Agents
The directory structure and scripting approach are designed to be agent-agnostic. While this project focuses on Gemini and Antigravity, future agents can be supported by adding specific `build-<agent>.js` scripts and outputting to `dist/<agent>-prompts/` without colliding with existing implementations.

## Implementation Steps
1.  **Documentation:** Write PRD and Technical Specification (Current Phase).
2.  **Scripting (Antigravity):** Write `scripts/deploy_to_antigravity.js` or `.py` to handle the KI conversion and deployment to the user's local `~/.gemini/antigravity/knowledge` path.
3.  **Scripting (Gemini CLI):** Write `scripts/build_gemini_prompts.js` or `.py` to compile the skills into output markdown files.
4.  **Integration:** Update `package.json` with npm scripts (e.g., `npm run deploy:antigravity`, `npm run build:gemini`).
5.  **Documentation Update:** Update the root `README.md` to include instructions for Antigravity and Gemini CLI users.

## Open Decisions
*   The exact local path for Gemini CLI prompts, if the user has a preferred standard directory. Otherwise, the build script will output to a local `dist/` or `out/` folder.
