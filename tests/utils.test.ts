import { describe, it, expect } from 'vitest';
import { addLineNumbers, diffPercentage, diffLineCount } from '../src/utils';

describe('addLineNumbers', () => {
  it('adds line numbers to content', () => {
    const content = 'first\nsecond\nthird';
    const result = addLineNumbers(content);
    expect(result).toContain('   1 | first');
    expect(result).toContain('   2 | second');
    expect(result).toContain('   3 | third');
  });

  it('handles empty string', () => {
    const result = addLineNumbers('');
    expect(result).toBe('   1 | ');
  });

  it('handles single line', () => {
    const result = addLineNumbers('hello');
    expect(result).toBe('   1 | hello');
  });
});

describe('diffLineCount', () => {
  it('counts zero for identical content', () => {
    expect(diffLineCount('a\nb\nc', 'a\nb\nc')).toBe(0);
  });

  it('counts changed lines', () => {
    expect(diffLineCount('a\nb\nc', 'a\nX\nc')).toBe(1);
  });

  it('counts added lines', () => {
    expect(diffLineCount('a\nb', 'a\nb\nc')).toBe(1);
  });
});

describe('diffPercentage', () => {
  it('returns 0 for identical content', () => {
    expect(diffPercentage('a\nb\nc', 'a\nb\nc')).toBe(0);
  });

  it('returns 100 for completely different content', () => {
    expect(diffPercentage('a\nb\nc', 'x\ny\nz')).toBe(100);
  });

  it('returns correct percentage for partial diff', () => {
    const pct = diffPercentage('a\nb\nc\nd', 'a\nX\nc\nd');
    expect(pct).toBe(25);
  });

  it('handles empty original with new content', () => {
    expect(diffPercentage('', 'new content')).toBe(100);
  });
});
