const { app } = require('electron'); // Correct import for app
const fs = require('fs');
const path = require('path');
const log = require('electron-log');
const OpenAI = require("openai");


// Function to read a markdown file
function readMarkdownFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// Function to get the OpenAI API key from the user's config
function getApiKey() {
  return new Promise((resolve, reject) => {
    const configPath = path.join(app.getPath('userData'), 'config.json'); // Correct use of app.getPath
    fs.readFile(configPath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const config = JSON.parse(data);
        resolve(config.apiKey);
      }
    });
  });
}

// Function to get GPT instructions
async function getGPTInstructions(fileTree) {
  try {
    const apiKey = await getApiKey();
    
    const openai = new OpenAI({apiKey: apiKey});

    // Read the system prompt from the markdown file
    const systemPrompt = await readMarkdownFile(path.join(__dirname, 'gpt_system_prompt.md'));

    // Construct the user prompt with the file tree
    const userPrompt = `Here is the file tree:\n${fileTree}\n`;

    // Construct the chat messages
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    
    // Call to the OpenAI Chat Completions API
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: chatMessages,
      response_format: { type: "json_object" }
    });

    // Log the token usage
    const tokenUsage = response.usage.total_tokens;
    log.info(`Tokens used: ${tokenUsage} for message: ${userPrompt}`);

    // Extract the response content
    const responseContent = response.choices[0].message.content;

    // Attempt to parse the response as JSON
    try {
      const instructions = JSON.parse(responseContent);
      return instructions;
    } catch (error) {
      log.error('JSON decode error');
      return null;
    }
  } catch (error) {
    log.error(`Error processing the message: ${error}`);
    return null;
  }
}

// Function to scan a folder with a given depth
function scanFolder(rootFolder, depth) {
  function recursiveScan(folder, currentDepth) {
    if (currentDepth > depth) {
      return [];
    }
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
  log.info('Scanned file tree:', JSON.stringify(result, null, 2)); // Add logging here
  return result;
}

// Function to execute instructions
function executeInstructions(instructions) {
  for (const instruction of instructions) {
    if (instruction.action === 'CREATE') {
      fs.mkdirSync(instruction.path, { recursive: true });
    } else if (instruction.action === 'MOVE') {
      fs.renameSync(instruction.from, instruction.to);
    }
  }
}

// Function to revert instructions
function revertInstructions(instructions) {
  for (const instruction of instructions.reverse()) {
    if (instruction.action === 'CREATE') {
      fs.rmdirSync(instruction.path, { recursive: true });
    } else if (instruction.action === 'MOVE') {
      fs.renameSync(instruction.to, instruction.from);
    }
  }
}

// Function to load instructions from a file
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
