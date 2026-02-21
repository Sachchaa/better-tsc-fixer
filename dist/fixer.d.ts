import { TscError, FixSummary } from './types';
export declare function buildPrompt(filePath: string, fileContent: string, errors: TscError[]): string;
export declare function fixLoop(maxRetries: number, tsconfigPath: string, provider: 'anthropic' | 'openai', apiKey: string): Promise<FixSummary>;
