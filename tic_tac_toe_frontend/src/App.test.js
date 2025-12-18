import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title, initial status, and restart button', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent(/Next player: X/i);
  expect(screen.getByRole('button', { name: /Restart/i })).toBeInTheDocument();
});
