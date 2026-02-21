import * as core from '@actions/core';
import * as exec from '@actions/exec';

export async function execCommand(
  command: string,
  args: string[] = [],
  options: { silent?: boolean; ignoreReturnCode?: boolean; cwd?: string } = {},
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  let stdout = '';
  let stderr = '';

  const exitCode = await exec.exec(command, args, {
    silent: options.silent ?? true,
    ignoreReturnCode: options.ignoreReturnCode ?? true,
    cwd: options.cwd,
    listeners: {
      stdout: (data: Buffer) => {
        stdout += data.toString();
      },
      stderr: (data: Buffer) => {
        stderr += data.toString();
      },
    },
  });

  return { exitCode, stdout, stderr };
}

export function logInfo(message: string): void {
  core.info(message);
}

export function logWarning(message: string): void {
  core.warning(message);
}

export function logError(message: string): void {
  core.error(message);
}

export function logGroup(name: string, fn: () => void): void {
  core.startGroup(name);
  try {
    fn();
  } finally {
    core.endGroup();
  }
}

export async function logGroupAsync(
  name: string,
  fn: () => Promise<void>,
): Promise<void> {
  core.startGroup(name);
  try {
    await fn();
  } finally {
    core.endGroup();
  }
}

export function addLineNumbers(content: string): string {
  return content
    .split('\n')
    .map((line, i) => `${String(i + 1).padStart(4, ' ')} | ${line}`)
    .join('\n');
}

export function diffLineCount(original: string, modified: string): number {
  const origLines = original.split('\n');
  const modLines = modified.split('\n');
  const maxLen = Math.max(origLines.length, modLines.length);

  let changed = 0;
  for (let i = 0; i < maxLen; i++) {
    if (origLines[i] !== modLines[i]) {
      changed++;
    }
  }

  return changed;
}

export function diffPercentage(original: string, modified: string): number {
  const origLines = original.split('\n');
  const changed = diffLineCount(original, modified);
  if (origLines.length === 0) return 0;
  return (changed / origLines.length) * 100;
}
