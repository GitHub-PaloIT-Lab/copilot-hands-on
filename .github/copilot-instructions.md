# GitHub Copilot Hands-on Workshop Repository

**ALWAYS follow these instructions first and fallback to additional search and context gathering only if the information here is incomplete or found to be in error.**

GitHub Copilot Hands-on Workshop is an educational repository containing 6 learning modules and a React chat application template for practicing GitHub Copilot skills. This is primarily a learning repository, not a production application.

## Working Effectively

### Repository Structure and Navigation
- **Root directory**: `/home/runner/work/copilot-hands-on/copilot-hands-on/`
- **Learning modules**:
  - `01_getting_started/` - Setup instructions for VS Code and IntelliJ
  - `02_basic_usage/` - Basic Copilot usage exercises
  - `03_comments_to_code/` - Converting comments to code exercises
  - `04_refactoring_optimization/` - Code refactoring exercises  
  - `05_mini_challenge/` - Mini coding challenges and React chat project template
  - `06_coding_agent/` - Using Copilot as an AI assistant

### Dependencies and Requirements
- **Node.js**: v20.19.4 (already available)
- **npm**: v10.8.2 (already available)
- **Java**: OpenJDK 17.0.16 (already available for Java exercises)
- **No additional installations required** for basic workshop exercises

### Running Individual Exercise Files
**All exercise files can be run directly with Node.js or Java:**

```bash
# JavaScript exercises (< 1 second execution time)
cd /home/runner/work/copilot-hands-on/copilot-hands-on/01_getting_started
node test.js

cd /home/runner/work/copilot-hands-on/copilot-hands-on/02_basic_usage  
node exercises.js

cd /home/runner/work/copilot-hands-on/copilot-hands-on/03_comments_to_code
node exercises.js

cd /home/runner/work/copilot-hands-on/copilot-hands-on/04_refactoring_optimization
node bad-code.js

cd /home/runner/work/copilot-hands-on/copilot-hands-on/05_mini_challenge
node starter-template.js

cd /home/runner/work/copilot-hands-on/copilot-hands-on/06_coding_agent
node exercises.js
```

```bash
# Java exercises (< 5 seconds execution time)
cd /home/runner/work/copilot-hands-on/copilot-hands-on/01_getting_started
javac TestCopilot.java && java TestCopilot
```

### React Chat Project Template
**IMPORTANT**: The React chat project in `05_mini_challenge/react-chat-project/` is a **TEMPLATE ONLY**:
- The `frontend/` and `backend/` directories contain only `.env.example` files
- The project is designed for students to build the actual application using Copilot
- **DO NOT attempt to build the incomplete template** - it will fail or loop infinitely

#### React Chat Project Structure (Template Only)
```bash
cd /home/runner/work/copilot-hands-on/copilot-hands-on/05_mini_challenge/react-chat-project

# Install template dependencies (takes ~15 seconds)
npm install

# The following commands will FAIL because frontend/backend are empty templates:
# npm run build     # FAILS - infinite loop
# npm run dev       # FAILS - no source code
# npm test          # FAILS - no test files
```

#### Deployment Infrastructure Available
The chat project template includes comprehensive deployment setup:
- **Docker**: `Dockerfile`, `docker-compose.yml`
- **GitHub Actions**: `.github/workflows/deploy.yml` 
- **Deployment targets**: Railway, Fly.io, Vercel, Render
- **Deployment script**: `deploy.sh` (requires actual application code)

## Validation

### Exercise File Validation
**Always test exercise files after making changes:**
```bash
# Test JavaScript files (each takes < 1 second)
node 01_getting_started/test.js
node 02_basic_usage/exercises.js  
node 03_comments_to_code/exercises.js
node 04_refactoring_optimization/bad-code.js
node 05_mini_challenge/starter-template.js
node 06_coding_agent/exercises.js

# Test Java files (takes < 5 seconds)
cd 01_getting_started && javac TestCopilot.java && java TestCopilot
```

### Manual Validation Scenarios
**When working with exercise files:**
1. **Basic functionality**: Ensure files execute without syntax errors
2. **Educational content**: Verify comments and exercise instructions are clear
3. **Copilot learning**: Test that examples demonstrate effective Copilot usage patterns

**When working with React chat template:**
1. **Template structure**: Verify directory structure and config files remain intact
2. **Dependencies**: Ensure `package.json` scripts and dependencies are valid
3. **Documentation**: Verify deployment instructions and examples are accurate

## Common Tasks

### Working with Learning Modules
```bash
# Navigate to specific module
cd /home/runner/work/copilot-hands-on/copilot-hands-on/[module_name]/

# View exercise instructions
cat README.md

# Run exercises
node exercises.js  # or appropriate file name
```

### Working with React Chat Template
```bash
cd /home/runner/work/copilot-hands-on/copilot-hands-on/05_mini_challenge/react-chat-project

# View project structure
ls -la frontend/ backend/

# Check deployment configuration
cat deploy.sh
cat Dockerfile
cat .github/workflows/deploy.yml
```

### Repository Overview Commands
The following are outputs from frequently used commands:

#### Repository Root
```bash
ls -la /home/runner/work/copilot-hands-on/copilot-hands-on/
# Output:
# 01_getting_started/
# 02_basic_usage/
# 03_comments_to_code/
# 04_refactoring_optimization/
# 05_mini_challenge/
# 06_coding_agent/
# README.md
```

#### Chat Project Template
```bash
ls -la /home/runner/work/copilot-hands-on/copilot-hands-on/05_mini_challenge/react-chat-project/
# Output:
# .github/
# Dockerfile
# README.md
# backend/          (contains only .env.example)
# deploy.sh
# docker-compose.yml
# fly.toml
# frontend/         (contains only .env.example)
# package.json
```

## Important Notes

### What Works
- **All exercise files execute successfully** with Node.js and Java
- **Template configuration files** are properly structured
- **Deployment infrastructure** is comprehensive and well-documented
- **Learning materials** are complete in Thai language

### What Doesn't Work (By Design)
- **React chat application build/run** - template only, no source code
- **Frontend/backend applications** - students need to create these using Copilot
- **Test suites** - no tests exist for template project

### Performance Expectations
- **Exercise file execution**: < 1 second for JavaScript, < 5 seconds for Java
- **Dependency installation**: ~15 seconds for React chat template
- **Repository exploration**: Immediate access to all files and documentation

### Troubleshooting
- **If build commands fail on React chat project**: This is expected - the project is a template only
- **If exercise files don't run**: Check you're in the correct directory and using `node filename.js`
- **If Java compilation fails**: Ensure you're using `javac` before `java` command

## Educational Focus

This repository is designed for:
1. **Learning GitHub Copilot** through hands-on exercises
2. **Practicing prompt engineering** with comment-to-code conversion
3. **Understanding code refactoring** with AI assistance
4. **Building complete applications** using the chat project template
5. **Exploring deployment options** through comprehensive infrastructure

**Remember**: The goal is education, not production deployment. Focus on learning effective Copilot usage patterns through the provided exercises.