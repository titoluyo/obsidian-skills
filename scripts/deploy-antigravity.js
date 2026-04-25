const fs = require('fs');
const path = require('path');
const os = require('os');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const skillsDir = path.join(rootDir, 'skills');
const antigravityBaseDir = path.join(os.homedir(), '.gemini', 'antigravity', 'knowledge');

// Helper function to recursively copy a directory
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else if (exists) {
        fs.copyFileSync(src, dest);
    }
}

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
    const descMatch = frontmatterBlock.match(/^description:\s*(.+)$/m);
    
    return {
        frontmatter: {
            name: nameMatch ? nameMatch[1].trim() : 'Unknown Skill',
            description: descMatch ? descMatch[1].trim() : ''
        },
        body: body.trim()
    };
}

function deployToAntigravity() {
    if (!fs.existsSync(skillsDir)) {
        console.error('Error: skills directory not found at', skillsDir);
        process.exit(1);
    }

    const skills = fs.readdirSync(skillsDir).filter(item => {
        const itemPath = path.join(skillsDir, item);
        return fs.statSync(itemPath).isDirectory();
    });

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

        // Target Paths
        const targetKiDir = path.join(antigravityBaseDir, frontmatter.name);
        const targetArtifactsDir = path.join(targetKiDir, 'artifacts');
        const metadataPath = path.join(targetKiDir, 'metadata.json');
        const targetSkillFile = path.join(targetArtifactsDir, 'skill.md');

        // Create Directories
        fs.mkdirSync(targetArtifactsDir, { recursive: true });

        // Write metadata.json
        const metadata = {
            summary: frontmatter.description,
            references: [frontmatter.name]
        };
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');

        // Write artifacts/skill.md
        fs.writeFileSync(targetSkillFile, body, 'utf8');

        // Copy references/ if it exists
        if (fs.existsSync(referencesDir)) {
            const targetReferencesDir = path.join(targetArtifactsDir, 'references');
            copyRecursiveSync(referencesDir, targetReferencesDir);
        }

        console.log(`Successfully deployed ${skillName} to Antigravity.`);
    });
    
    console.log(`\nAntigravity deployment complete. Knowledge Items located at: ${antigravityBaseDir}`);
}

deployToAntigravity();
