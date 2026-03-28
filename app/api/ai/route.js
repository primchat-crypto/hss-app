// Import necessary modules
const { GPT4O } = require('gpt-4o');

// Default system prompt improved for Thai language accuracy
const systemPrompt = 'คุณสามารถช่วยฉันได้ไหม? ฉันต้องการการตอบสนองที่มีความหมายและแม่นยำ.';

// Initialize the GPT-4o model
const gptModel = new GPT4O({
    systemPrompt: systemPrompt,
    temperature: 0.3
});

// Example usage of gptModel
async function getResponse(userInput) {
    try {
        const response = await gptModel.generate(userInput);
        return response;
    } catch (error) {
        console.error('Error generating response:', error);
    }
}

module.exports = { getResponse };