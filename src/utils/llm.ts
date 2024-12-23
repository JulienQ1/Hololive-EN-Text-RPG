import { CreateMLCEngine } from '@mlc-ai/web-llm';

let engine: any = null;

export const initializeLLM = async () => {
  if (!engine) {
    engine = await CreateMLCEngine('Llama-3.1-8B-Instruct-q4f32_1-MLC');
  }
  return engine;
};

export const generateText = async (prompt: string, systemPrompt: string = '', options = {}) => {
  if (!engine) throw new Error('LLM engine not initialized');
  
  const response = await engine.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 150,
    ...options
  });
  
  return response.choices[0].message.content;
};