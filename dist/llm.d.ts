import { LLMResponse } from './types';
export declare function callLLM(prompt: string, provider: 'anthropic' | 'openai', apiKey: string): Promise<LLMResponse>;
export declare function extractCodeFromResponse(response: string): string | null;
