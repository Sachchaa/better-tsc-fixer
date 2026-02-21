import { describe, it, expect } from 'vitest';
import { parseTscErrors, groupErrorsByFile } from '../src/tsc';

describe('parseTscErrors', () => {
  it('parses a single error', () => {
    const output =
      'src/components/Button.tsx(12,5): error TS2322: Type \'string\' is not assignable to type \'number\'.';
    const errors = parseTscErrors(output);

    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({
      file: 'src/components/Button.tsx',
      line: 12,
      col: 5,
      code: 'TS2322',
      message: "Type 'string' is not assignable to type 'number'.",
    });
  });

  it('parses multiple errors', () => {
    const output = [
      "src/App.tsx(3,1): error TS2307: Cannot find module './missing'.",
      "src/App.tsx(10,15): error TS2339: Property 'foo' does not exist on type 'Bar'.",
      "src/utils/helper.ts(5,10): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.",
    ].join('\n');

    const errors = parseTscErrors(output);
    expect(errors).toHaveLength(3);
    expect(errors[0].file).toBe('src/App.tsx');
    expect(errors[0].code).toBe('TS2307');
    expect(errors[1].line).toBe(10);
    expect(errors[2].file).toBe('src/utils/helper.ts');
  });

  it('returns empty array for clean output', () => {
    const output = '';
    expect(parseTscErrors(output)).toHaveLength(0);
  });

  it('ignores non-error lines', () => {
    const output = [
      'Some random text',
      "src/App.tsx(3,1): error TS2307: Cannot find module './missing'.",
      'Another random line',
    ].join('\n');

    const errors = parseTscErrors(output);
    expect(errors).toHaveLength(1);
  });

  it('handles Windows-style paths', () => {
    const output =
      "src\\components\\Button.tsx(12,5): error TS2322: Type 'string' is not assignable to type 'number'.";
    const errors = parseTscErrors(output);

    expect(errors).toHaveLength(1);
    expect(errors[0].file).toBe('src\\components\\Button.tsx');
  });
});

describe('groupErrorsByFile', () => {
  it('groups errors by file path', () => {
    const errors = [
      { file: 'a.ts', line: 1, col: 1, code: 'TS2322', message: 'err1' },
      { file: 'b.ts', line: 2, col: 1, code: 'TS2322', message: 'err2' },
      { file: 'a.ts', line: 5, col: 3, code: 'TS2345', message: 'err3' },
    ];

    const grouped = groupErrorsByFile(errors);
    expect(grouped.size).toBe(2);
    expect(grouped.get('a.ts')).toHaveLength(2);
    expect(grouped.get('b.ts')).toHaveLength(1);
  });

  it('returns empty map for no errors', () => {
    const grouped = groupErrorsByFile([]);
    expect(grouped.size).toBe(0);
  });
});
