import { describe, it, expect } from 'vitest';
import { buildPrompt } from '../src/fixer';
import { TscError } from '../src/types';

describe('buildPrompt', () => {
  it('includes file path', () => {
    const errors: TscError[] = [
      { file: 'src/app.ts', line: 5, col: 3, code: 'TS2322', message: 'Type error' },
    ];
    const prompt = buildPrompt('src/app.ts', 'const x = 1;', errors);
    expect(prompt).toContain('src/app.ts');
  });

  it('includes line-numbered file content', () => {
    const content = 'line1\nline2\nline3';
    const errors: TscError[] = [
      { file: 'test.ts', line: 1, col: 1, code: 'TS2322', message: 'err' },
    ];
    const prompt = buildPrompt('test.ts', content, errors);
    expect(prompt).toContain('   1 | line1');
    expect(prompt).toContain('   2 | line2');
    expect(prompt).toContain('   3 | line3');
  });

  it('includes all errors in the prompt', () => {
    const errors: TscError[] = [
      { file: 'test.ts', line: 1, col: 1, code: 'TS2322', message: 'Type mismatch' },
      { file: 'test.ts', line: 5, col: 10, code: 'TS2345', message: 'Arg type wrong' },
    ];
    const prompt = buildPrompt('test.ts', 'code', errors);
    expect(prompt).toContain('TS2322');
    expect(prompt).toContain('Type mismatch');
    expect(prompt).toContain('TS2345');
    expect(prompt).toContain('Arg type wrong');
    expect(prompt).toContain('Line 1, Col 1');
    expect(prompt).toContain('Line 5, Col 10');
  });

  it('includes instructions to not refactor', () => {
    const errors: TscError[] = [
      { file: 'test.ts', line: 1, col: 1, code: 'TS2322', message: 'err' },
    ];
    const prompt = buildPrompt('test.ts', 'code', errors);
    expect(prompt).toContain('Do NOT refactor');
  });
});
