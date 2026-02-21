import { describe, it, expect } from 'vitest';
import { extractCodeFromResponse } from '../src/llm';

describe('extractCodeFromResponse', () => {
  it('extracts code from typescript fence', () => {
    const response = `Here's the fix:

\`\`\`typescript
const x: number = 42;
export default x;
\`\`\`

That should resolve the error.`;

    const code = extractCodeFromResponse(response);
    expect(code).toBe('const x: number = 42;\nexport default x;');
  });

  it('extracts code from tsx fence', () => {
    const response = `\`\`\`tsx
import React from 'react';
const App = () => <div>Hello</div>;
export default App;
\`\`\``;

    const code = extractCodeFromResponse(response);
    expect(code).toBe(
      "import React from 'react';\nconst App = () => <div>Hello</div>;\nexport default App;",
    );
  });

  it('extracts code from ts fence', () => {
    const response = `\`\`\`ts
type Foo = string;
\`\`\``;

    const code = extractCodeFromResponse(response);
    expect(code).toBe('type Foo = string;');
  });

  it('extracts code from plain fence', () => {
    const response = `\`\`\`
const y = 10;
\`\`\``;

    const code = extractCodeFromResponse(response);
    expect(code).toBe('const y = 10;');
  });

  it('returns null when no code fence found', () => {
    const response = 'No code block here, just text.';
    expect(extractCodeFromResponse(response)).toBeNull();
  });

  it('extracts only the first code block', () => {
    const response = `\`\`\`typescript
const first = true;
\`\`\`

\`\`\`typescript
const second = true;
\`\`\``;

    const code = extractCodeFromResponse(response);
    expect(code).toBe('const first = true;');
  });
});
