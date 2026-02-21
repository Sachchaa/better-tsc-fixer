export declare function execCommand(command: string, args?: string[], options?: {
    silent?: boolean;
    ignoreReturnCode?: boolean;
    cwd?: string;
}): Promise<{
    exitCode: number;
    stdout: string;
    stderr: string;
}>;
export declare function logInfo(message: string): void;
export declare function logWarning(message: string): void;
export declare function logError(message: string): void;
export declare function logGroup(name: string, fn: () => void): void;
export declare function logGroupAsync(name: string, fn: () => Promise<void>): Promise<void>;
export declare function addLineNumbers(content: string): string;
export declare function diffLineCount(original: string, modified: string): number;
export declare function diffPercentage(original: string, modified: string): number;
