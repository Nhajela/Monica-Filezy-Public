const fs = require('fs');
const path = require('path');
const log = require('electron-log');
const { app } = require('electron');
const OpenAI = require('openai');

function readMarkdownFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

async function getApiKey() {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  const data = fs.readFileSync(configPath, 'utf8');
  const config = JSON.parse(data);
  return config.apiKey;
}

async function getGPTInstructions(fileTree) {
  try {
    const apiKey = await getApiKey();
    const openai = new OpenAI({ apiKey });
    const systemPrompt = await readMarkdownFile(path.join(__dirname, 'gpt_system_prompt.md'));
    const userPrompt = `Here is the file tree:\n${fileTree}\n`;
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: chatMessages,
      response_format: { type: "json_object" }
    });

    log.info(`Tokens used: ${response.usage.total_tokens} for message: ${userPrompt}`);
    const responseContent = response.choices[0].message.content;

    try {
      return JSON.parse(responseContent);
    } catch (error) {
      log.error('JSON decode error');
      return null;
    }
  } catch (error) {
    log.error('Error processing the message:', error);
    return null;
  }
}

function scanFolder(rootFolder, depth) {
  function recursiveScan(folder, currentDepth) {
    if (currentDepth > depth) return [];
    const fileTree = [];
    const items = fs.readdirSync(folder);
    for (const item of items) {
      const itemPath = path.join(folder, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        fileTree.push({ name: item, type: 'folder', children: recursiveScan(itemPath, currentDepth + 1) });
      } else {
        fileTree.push({ name: item, type: 'file' });
      }
    }
    return fileTree;
  }

  const result = recursiveScan(rootFolder, 0);
  log.info('Scanned file tree:', JSON.stringify(result, null, 2));
  return result;
}

function executeInstructions(instructions, basePath) {
  let successfulCount = 0;
  let failedCount = 0;

  instructions.forEach(instruction => {
    try {
      const fullPath = path.join(basePath, instruction.path || '');
      if (instruction.action === 'CREATE') {
        fs.mkdirSync(fullPath, { recursive: true });
        successfulCount++;
      } else if (instruction.action === 'MOVE') {
        const fromPath = path.join(basePath, instruction.from);
        const toPath = path.join(basePath, instruction.to);
        fs.renameSync(fromPath, toPath);
        successfulCount++;
      }
    } catch (error) {
      log.error(`Failed to execute instruction: ${error.message}`);
      failedCount++;
    }
  });

  log.info(`Execution completed. Successful: ${successfulCount}, Failed: ${failedCount}, Total: ${instructions.length}`);
}

function revertInstructions(instructions) {
  instructions.reverse().forEach(instruction => {
    try {
      if (instruction.action === 'CREATE') {
        fs.rmdirSync(instruction.path, { recursive: true });
      } else if (instruction.action === 'MOVE') {
        fs.renameSync(instruction.to, instruction.from);
      }
    } catch (error) {
      log.error(`Failed to revert instruction: ${error.message}`);
    }
  });
}

function loadInstructions(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

module.exports = {
  readMarkdownFile,
  getGPTInstructions,
  scanFolder,
  executeInstructions,
  revertInstructions,
  loadInstructions
};
