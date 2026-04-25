# Technical Specification
**Project:** Obsidian Skills Port for Gemini & Antigravity

## 1. Overview
This specification details the technical implementation of the scripts required to port the `obsidian-skills` to Antigravity Knowledge Items (KIs) and Gemini CLI prompts. We will use Node.js for the scripting to align with the existing `package.json` and web-centric nature of the Obsidian ecosystem.

## 2. System Architecture

The core architecture relies on source-to-source transformation. The `skills/` directory is the single source of truth and must be treated as **strictly read-only**. No scripts or processes should modify the original files, ensuring that upstream updates from the original repository can be pulled and merged without conflicts. Build scripts will read from `skills/` and write to either a local output directory (`dist/`) or the user's system directory (`.gemini/`).

### Directory Flow
```
obsidian-skills/
├── skills/                  <-- Source of Truth (SKILL.md, references/)
├── scripts/
│   ├── deploy-antigravity.js
│   └── build-gemini.js
└── dist/                    <-- Output for Gemini CLI
    ├── gemini-prompts/
    │   ├── all-skills.md
    │   ├── obsidian-markdown.md
    │   └── ...
```

## 3. Data Mapping

### 3.1 Antigravity KI Mapping
**Source:** `skills/<skill-name>/SKILL.md` (with YAML frontmatter)
**Destination:** `<appDataDir>/knowledge/<skill-name>/`

**Mapping Logic:**
1.  **Frontmatter Parser:** Use a library like `gray-matter` or a custom Regex to extract the YAML frontmatter.
2.  **`metadata.json`:**
    ```json
    {
      "summary": "<description from frontmatter>",
      "references": ["<name from frontmatter>"]
    }
    ```
    *Note: Timestamps can be automatically generated during script execution.*
3.  **`artifacts/`:**
    *   Save the markdown content (sans frontmatter) to `artifacts/skill.md`.
    *   Copy `skills/<skill-name>/references/` (if it exists) to `artifacts/references/`.

### 3.2 Gemini CLI Prompt Mapping
**Source:** `skills/<skill-name>/SKILL.md` (and references)
**Destination:** `dist/gemini-prompts/`

**Mapping Logic:**
1.  **Unified Prompt (`all-skills.md`):**
    *   Concatenate the markdown content of all `SKILL.md` files.
    *   Append the contents of referenced files inline to ensure the LLM has full context without needing to read secondary files, as the CLI might only read the single prompt file.
2.  **Split Prompts (`<skill-name>.md`):**
    *   Same as above, but scoped to individual skills.

## 4. Implementation Details

### 4.1 Prerequisites
Add dependencies to `package.json`:
*   `gray-matter` (Optional, for parsing YAML frontmatter if regex is too brittle).
*   `fs-extra` (Optional, for easier directory copying/manipulation).
Alternatively, write zero-dependency Node scripts using built-in `fs` and `path` modules to minimize overhead.

### 4.2 Script 1: `deploy-antigravity.js`
**Execution:** `node scripts/deploy-antigravity.js` (or via `npm run deploy:antigravity`)
**Logic:**
1.  Determine Antigravity path. On Windows: `%USERPROFILE%\.gemini\antigravity\knowledge`. On Unix: `~/.gemini/antigravity/knowledge`.
2.  Iterate through subdirectories in `skills/`.
3.  For each, parse `SKILL.md`.
4.  Ensure target directory exists.
5.  Write `metadata.json`.
6.  Write `artifacts/skill.md`.
7.  Recursively copy `references/` if present.

### 4.3 Script 2: `build-gemini.js`
**Execution:** `node scripts/build-gemini.js` (or via `npm run build:gemini`)
**Logic:**
1.  Ensure `dist/gemini-prompts/` directory exists (clean it if it does).
2.  For each skill, read `SKILL.md` (strip frontmatter).
3.  Read any markdown files in `references/` and append their contents to the skill's main markdown string. Example:
    ```markdown
    # Obsidian Markdown Skill
    <content>

    ## Reference: PROPERTIES.md
    <content of properties.md>
    ```
4.  Write to `dist/gemini-prompts/<skill>.md`.
5.  Append to a running string for `dist/gemini-prompts/all-skills.md` and write it at the end.

## 5. Next Steps
1.  Create the `scripts/` directory.
2.  Implement `deploy-antigravity.js` using Node.js built-ins.
3.  Implement `build-gemini.js`.
4.  Test execution locally.
