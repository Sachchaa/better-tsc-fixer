import { execCommand, logInfo } from './utils';

export async function configureGit(): Promise<void> {
  await execCommand('git', [
    'config',
    'user.name',
    'better-tsc-fixer[bot]',
  ]);
  await execCommand('git', [
    'config',
    'user.email',
    'better-tsc-fixer[bot]@users.noreply.github.com',
  ]);
  logInfo('Git configured with bot identity');
}

export async function hasChanges(): Promise<boolean> {
  const { stdout } = await execCommand('git', [
    'status',
    '--porcelain',
  ]);
  return stdout.trim().length > 0;
}

export async function commitChanges(message: string): Promise<void> {
  await execCommand('git', ['add', '-A']);
  await execCommand('git', ['commit', '-m', message]);
  logInfo(`Committed: ${message}`);
}

export async function pushToCurrentBranch(): Promise<void> {
  const { stdout } = await execCommand('git', [
    'rev-parse',
    '--abbrev-ref',
    'HEAD',
  ]);
  const branch = stdout.trim();
  await execCommand('git', ['push', 'origin', branch]);
  logInfo(`Pushed to ${branch}`);
}

export async function createFixBranch(sha: string): Promise<string> {
  const shortSha = sha.substring(0, 7);
  const branchName = `fix/tsc-errors-${shortSha}`;
  await execCommand('git', ['checkout', '-b', branchName]);
  logInfo(`Created branch: ${branchName}`);
  return branchName;
}

export async function pushNewBranch(branchName: string): Promise<void> {
  await execCommand('git', ['push', '-u', 'origin', branchName]);
  logInfo(`Pushed new branch: ${branchName}`);
}

export async function getCurrentSha(): Promise<string> {
  const { stdout } = await execCommand('git', [
    'rev-parse',
    'HEAD',
  ]);
  return stdout.trim();
}

export async function getCurrentBranch(): Promise<string> {
  const { stdout } = await execCommand('git', [
    'rev-parse',
    '--abbrev-ref',
    'HEAD',
  ]);
  return stdout.trim();
}

export async function getLastCommitMessage(): Promise<string> {
  const { stdout } = await execCommand('git', [
    'log',
    '-1',
    '--format=%s',
  ]);
  return stdout.trim();
}

export async function getLastCommitAuthor(): Promise<string> {
  const { stdout } = await execCommand('git', [
    'log',
    '-1',
    '--format=%an',
  ]);
  return stdout.trim();
}
