const fs = require('fs');
const path = require('path');
const os = require('os');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const skillsDir = path.join(rootDir, 'skills');
const agentsSkillsDir = path.join(os.homedir(), '.agents', 'skills');

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

function deployToAgents() {
    if (!fs.existsSync(skillsDir)) {
        console.error('Error: skills directory not found at', skillsDir);
        process.exit(1);
    }

    fs.mkdirSync(agentsSkillsDir, { recursive: true });

    const skills = fs.readdirSync(skillsDir).filter(item => {
        const itemPath = path.join(skillsDir, item);
        return fs.statSync(itemPath).isDirectory();
    });

    skills.forEach(skillName => {
        const sourceSkillPath = path.join(skillsDir, skillName);
        const targetSkillPath = path.join(agentsSkillsDir, skillName);
        
        // Wipe target directory if it exists to ensure clean copy
        if (fs.existsSync(targetSkillPath)) {
            fs.rmSync(targetSkillPath, { recursive: true, force: true });
        }
        
        // Copy the directory exactly as it is
        copyRecursiveSync(sourceSkillPath, targetSkillPath);

        console.log(`Successfully deployed ${skillName} to ~/.agents/skills/`);
    });
    
    console.log(`\nGlobal Agent Skills deployment complete. Skills located at: ${agentsSkillsDir}`);
}

deployToAgents();
