import { TscError, TscRunResult } from './types';
import { execCommand, logInfo } from './utils';

const TSC_ERROR_REGEX = /^(.+)\((\d+),(\d+)\): error (TS\d+): (.+)$/gm;

export async function runTsc(tsconfigPath: string): Promise<TscRunResult> {
  logInfo(`Running tsc with config: ${tsconfigPath}`);

  const { exitCode, stdout, stderr } = await execCommand('npx', [
    'tsc',
    '--noEmit',
    '--pretty',
    'false',
    '-p',
    tsconfigPath,
  ]);

  const output = stdout + stderr;
  return { exitCode, output };
}

export function parseTscErrors(output: string): TscError[] {
  const errors: TscError[] = [];
  let match: RegExpExecArray | null;

  const regex = new RegExp(TSC_ERROR_REGEX.source, TSC_ERROR_REGEX.flags);

  while ((match = regex.exec(output)) !== null) {
    errors.push({
      file: match[1].trim(),
      line: parseInt(match[2], 10),
      col: parseInt(match[3], 10),
      code: match[4],
      message: match[5].trim(),
    });
  }

  return errors;
}

export function groupErrorsByFile(
  errors: TscError[],
): Map<string, TscError[]> {
  const grouped = new Map<string, TscError[]>();

  for (const error of errors) {
    const existing = grouped.get(error.file) || [];
    existing.push(error);
    grouped.set(error.file, existing);
  }

  return grouped;
}
