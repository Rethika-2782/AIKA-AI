import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Logo from './components/Logo';
import { BrowserRouter } from 'react-router-dom';

describe('Logo Component', () => {
  it('renders the LEXORA logo text correctly', () => {
    render(<BrowserRouter><Logo /></BrowserRouter>);
    const logoText = screen.getByText(/LEXORA/i);
    expect(logoText).toBeDefined();
  });
});
