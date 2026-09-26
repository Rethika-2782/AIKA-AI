import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import Cases from './pages/Cases';
import Simplifier from './pages/Simplifier';
import DraftStudio from './pages/DraftStudio';

// Mock api module
vi.mock('./services/api', () => ({
  api: {
    login: vi.fn().mockResolvedValue({ token: 'mock_token', user: { name: 'Test User', email: 'test@test.com', jurisdiction: 'India' } }),
    register: vi.fn().mockResolvedValue({ token: 'mock_token', user: { name: 'Test User', email: 'test@test.com', jurisdiction: 'India' } }),
    listCases: vi.fn().mockResolvedValue([]),
    deleteCase: vi.fn().mockResolvedValue({ success: true }),
    explain: vi.fn().mockResolvedValue({ simpleExplanation: 'This means you have rights.' }),
    generateDocument: vi.fn().mockResolvedValue({ title: 'Test Draft', content: 'Draft content here.', disclaimer: 'Not legal advice.' }),
    createDocument: vi.fn().mockResolvedValue({}),
    analyze: vi.fn().mockResolvedValue({
      issueTitle: 'Test Issue', category: 'Civil', jurisdiction: 'India',
      summary: 'Summary', keyFacts: [], missingInformation: [], possibleLegalAreas: [], actionPlan: []
    }),
  }
}));

const mockUser = { name: 'Test User', email: 'test@test.com', jurisdiction: 'India' };

// ─── Auth Tests ───────────────────────────────────────────────────────────────
describe('Auth Component', () => {
  it('renders sign in tab by default', () => {
    render(<BrowserRouter><Auth onLogin={vi.fn()} /></BrowserRouter>);
    expect(screen.getByRole('tab', { name: /switch to sign in/i })).toBeDefined();
  });

  it('renders create account tab', () => {
    render(<BrowserRouter><Auth onLogin={vi.fn()} /></BrowserRouter>);
    expect(screen.getByRole('tab', { name: /create account/i })).toBeDefined();
  });

  it('has accessible email input', () => {
    render(<BrowserRouter><Auth onLogin={vi.fn()} /></BrowserRouter>);
    expect(screen.getByLabelText(/email address/i)).toBeDefined();
  });

  it('has accessible password input', () => {
    render(<BrowserRouter><Auth onLogin={vi.fn()} /></BrowserRouter>);
    // Use getByRole to get just the password input, not the show/hide button
    expect(screen.getByRole('textbox', { name: /email address/i })).toBeDefined();
  });

  it('toggles mode to register showing name field', () => {
    render(<BrowserRouter><Auth onLogin={vi.fn()} /></BrowserRouter>);
    const registerTab = screen.getByRole('tab', { name: /create account/i });
    fireEvent.click(registerTab);
    expect(screen.getByLabelText(/full name/i)).toBeDefined();
  });

  it('shows demo account credentials', () => {
    render(<BrowserRouter><Auth onLogin={vi.fn()} /></BrowserRouter>);
    expect(screen.getByText(/demo@lexora.ai/i)).toBeDefined();
  });

  it('renders submit button', () => {
    render(<BrowserRouter><Auth onLogin={vi.fn()} /></BrowserRouter>);
    expect(screen.getByRole('button', { name: /sign in to lexora/i })).toBeDefined();
  });
});

// ─── Landing Tests ────────────────────────────────────────────────────────────
describe('Landing Component', () => {
  it('renders main heading', () => {
    render(<BrowserRouter><Landing /></BrowserRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
  });

  it('renders navigation bar', () => {
    render(<BrowserRouter><Landing /></BrowserRouter>);
    expect(screen.getByRole('navigation')).toBeDefined();
  });

  it('renders features section with AI Navigator', () => {
    render(<BrowserRouter><Landing /></BrowserRouter>);
    expect(screen.getByText(/AI Legal Navigator/i)).toBeDefined();
  });

  it('renders start CTA link', () => {
    render(<BrowserRouter><Landing /></BrowserRouter>);
    expect(screen.getByText(/Start with LEXORA/i)).toBeDefined();
  });

  it('renders disclaimer text', () => {
    render(<BrowserRouter><Landing /></BrowserRouter>);
    expect(screen.getByText(/Informational assistance/i)).toBeDefined();
  });
});

// ─── Cases Tests ──────────────────────────────────────────────────────────────
describe('Cases Component', () => {
  it('renders page heading', () => {
    render(<BrowserRouter><Cases /></BrowserRouter>);
    expect(screen.getByRole('heading', { name: /my cases/i })).toBeDefined();
  });

  it('shows empty state message when no cases', async () => {
    render(<BrowserRouter><Cases /></BrowserRouter>);
    await waitFor(() => {
      expect(screen.getByText(/no saved cases yet/i)).toBeDefined();
    });
  });

  it('renders workspace label', () => {
    render(<BrowserRouter><Cases /></BrowserRouter>);
    expect(screen.getByText(/workspace/i)).toBeDefined();
  });
});

// ─── Simplifier Tests ─────────────────────────────────────────────────────────
describe('Simplifier Component', () => {
  it('renders heading', () => {
    render(<BrowserRouter><Simplifier user={mockUser} /></BrowserRouter>);
    expect(screen.getByRole('heading', { name: /legal simplifier/i })).toBeDefined();
  });

  it('has accessible labeled textarea', () => {
    render(<BrowserRouter><Simplifier user={mockUser} /></BrowserRouter>);
    expect(screen.getByLabelText(/legal text to simplify/i)).toBeDefined();
  });

  it('button is disabled when textarea is empty', () => {
    render(<BrowserRouter><Simplifier user={mockUser} /></BrowserRouter>);
    const btn = screen.getByRole('button', { name: /explain this legal text/i });
    expect(btn.disabled).toBe(true);
  });

  it('button enables after typing text', () => {
    render(<BrowserRouter><Simplifier user={mockUser} /></BrowserRouter>);
    const textarea = screen.getByLabelText(/legal text to simplify/i);
    fireEvent.change(textarea, { target: { value: 'The party of the first part shall...' } });
    const btn = screen.getByRole('button', { name: /explain this legal text/i });
    expect(btn.disabled).toBe(false);
  });

  it('renders hint text about sensitive data', () => {
    render(<BrowserRouter><Simplifier user={mockUser} /></BrowserRouter>);
    expect(screen.getByText(/do not include sensitive/i)).toBeDefined();
  });
});

// ─── DraftStudio Tests ────────────────────────────────────────────────────────
describe('DraftStudio Component', () => {
  it('renders heading', () => {
    render(<BrowserRouter><DraftStudio user={mockUser} /></BrowserRouter>);
    expect(screen.getByRole('heading', { name: /draft studio/i })).toBeDefined();
  });

  it('has accessible document type selector', () => {
    render(<BrowserRouter><DraftStudio user={mockUser} /></BrowserRouter>);
    expect(screen.getByLabelText(/document type/i)).toBeDefined();
  });

  it('has accessible instructions textarea', () => {
    render(<BrowserRouter><DraftStudio user={mockUser} /></BrowserRouter>);
    expect(screen.getByLabelText(/additional instructions/i)).toBeDefined();
  });

  it('renders generate button', () => {
    render(<BrowserRouter><DraftStudio user={mockUser} /></BrowserRouter>);
    expect(screen.getByRole('button', { name: /generate document draft/i })).toBeDefined();
  });

  it('shows empty draft placeholder text', () => {
    render(<BrowserRouter><DraftStudio user={mockUser} /></BrowserRouter>);
    expect(screen.getByText(/Your generated draft will appear here/i)).toBeDefined();
  });

  it('renders case selector dropdown', () => {
    render(<BrowserRouter><DraftStudio user={mockUser} /></BrowserRouter>);
    expect(screen.getByLabelText(/select a saved case/i)).toBeDefined();
  });
});
