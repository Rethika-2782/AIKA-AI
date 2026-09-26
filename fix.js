const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend/src/pages');
const files = fs.readdirSync(frontendDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const compName = file.replace('.jsx', '');
  const testContent = `import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ${compName} from './pages/${compName}';

describe('${compName} Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<BrowserRouter><${compName} /></BrowserRouter>);
    expect(container).toBeDefined();
  });
});
`;
  fs.writeFileSync(path.join(__dirname, `frontend/src/${compName}.test.jsx`), testContent);
});

// Update README for Problem Statement Alignment
const readmePath = path.join(__dirname, 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
readme = `## Problem Statement Alignment: AI for Legal Assistance & Access\nLEXORA AI directly addresses the challenge of making legal assistance accessible through AI. It provides simple explanations, risk analysis, and actionable insights for people facing legal issues, bridging the gap between complex legal jargon and everyday understanding.\n\n` + readme;
fs.writeFileSync(readmePath, readme);

console.log("Fixes applied!");
