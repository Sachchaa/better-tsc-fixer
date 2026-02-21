import { FixSummary } from './types';
export declare function buildPrBody(summary: FixSummary): string;
export declare function createPullRequest(baseBranch: string, headBranch: string, title: string, body: string, githubToken: string): Promise<string>;
