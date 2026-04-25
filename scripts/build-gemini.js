const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const skillsDir = path.join(rootDir, 'skills');
const distDir = path.join(rootDir, 'dist', 'gemini-prompts');

// Function to parse Frontmatter and Body
function parseSkillFile(content) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { frontmatter: null, body: content };
    }
    
    const frontmatterBlock = match[1];
    const body = match[2];
    
    const nameMatch = frontmatterBlock.match(/^name:\s*(.+)$/m);
    
    return {
        frontmatter: {
            name: nameMatch ? nameMatch[1].trim() : 'Unknown Skill'
        },
        body: body.trim()
    };
}

// Function to read all markdown files in a directory recursively
function readMarkdownReferences(dirPath) {
    let refsContent = '';
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const fullPath = path.join(dirPath, file);
            if (fs.statSync(fullPath).isDirectory()) {
                refsContent += readMarkdownReferences(fullPath);
            } else if (file.endsWith('.md')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                refsContent += `\n\n## Reference: ${file}\n\n${content}`;
            }
        });
    }
    return refsContent;
}

function buildGeminiPrompts() {
    if (!fs.existsSync(skillsDir)) {
        console.error('Error: skills directory not found at', skillsDir);
        process.exit(1);
    }

    // Clean and create dist directory
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(distDir, { recursive: true });

    const skills = fs.readdirSync(skillsDir).filter(item => {
        const itemPath = path.join(skillsDir, item);
        return fs.statSync(itemPath).isDirectory();
    });

    let allSkillsContent = '';

    skills.forEach(skillName => {
        const skillPath = path.join(skillsDir, skillName);
        const skillFile = path.join(skillPath, 'SKILL.md');
        const referencesDir = path.join(skillPath, 'references');
        
        if (!fs.existsSync(skillFile)) {
            console.warn(`Skipping ${skillName}: SKILL.md not found.`);
            return;
        }

        const content = fs.readFileSync(skillFile, 'utf8');
        const { frontmatter, body } = parseSkillFile(content);
        
        if (!frontmatter) {
            console.warn(`Skipping ${skillName}: No frontmatter found.`);
            return;
        }

        let skillPromptContent = `# Skill: ${frontmatter.name}\n\n${body}`;

        // Append references if they exist
        const refsContent = readMarkdownReferences(referencesDir);
        skillPromptContent += refsContent;

        // Write individual skill prompt
        const targetFile = path.join(distDir, `${skillName}.md`);
        fs.writeFileSync(targetFile, skillPromptContent, 'utf8');

        // Append to unified prompt
        allSkillsContent += `${skillPromptContent}\n\n---\n\n`;

        console.log(`Built prompt for ${skillName}.`);
    });
    
    // Write unified prompt
    const allSkillsFile = path.join(distDir, 'all-skills.md');
    fs.writeFileSync(allSkillsFile, allSkillsContent.trim(), 'utf8');
    console.log(`Built unified prompt: all-skills.md`);
    
    console.log(`\nGemini CLI prompt build complete. Prompts located at: ${distDir}`);
}

buildGeminiPrompts();
