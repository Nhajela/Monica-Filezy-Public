const openai = require('openai');
const fs = require('fs');
const path = require('path');
const log = require('electron-log');

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
    const configPath = path.join(app.getPath('userData'), 'config.json');
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
    // Read the system prompt from the markdown file
    const systemPrompt = await readMarkdownFile(path.join(__dirname, 'assets', 'gpt_system_prompt.md'));

    // Construct the user prompt with the file tree
    const userPrompt = `Here is the file tree:\n${fileTree}\n`;

    // Construct the chat messages
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    // Get the OpenAI API key
    const apiKey = await getApiKey();
    openai.apiKey = apiKey;

    // Call to the OpenAI Chat Completions API
    const response = await openai.Completion.create({
      model: 'gpt-4-1106-preview',
      messages: chatMessages,
      response_format: 'json'
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

module.exports = {
  readMarkdownFile,
  getGPTInstructions
};
