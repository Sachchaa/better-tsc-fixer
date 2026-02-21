import { TscError, TscRunResult } from './types';
export declare function runTsc(tsconfigPath: string): Promise<TscRunResult>;
export declare function parseTscErrors(output: string): TscError[];
export declare function groupErrorsByFile(errors: TscError[]): Map<string, TscError[]>;
