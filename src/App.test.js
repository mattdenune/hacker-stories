import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});


describe('somthing truthy', () => {
  it('true to be true', () => {
    expect(true).toBe(true);
  })
})