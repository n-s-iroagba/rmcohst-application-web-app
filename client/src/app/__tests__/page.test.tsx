
import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home Page', () => {
  it('renders main elements', () => {
    render(<Home />);
    expect(screen.getByText(/Get started/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Next.js logo/i)).toBeInTheDocument();
  });
});
