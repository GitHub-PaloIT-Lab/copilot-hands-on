import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

test('renders app header', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { level: 1 });
  expect(headerElement).toHaveTextContent(/E-commerce Cart System/i);
});

test('renders cart button', () => {
  render(<App />);
  const cartButton = screen.getByText(/ตะกร้า/i);
  expect(cartButton).toBeInTheDocument();
});

test('shows loading state initially', () => {
  render(<App />);
  const loading = screen.getByText(/กำลังโหลดสินค้า/i);
  expect(loading).toBeInTheDocument();
});

test('shows empty cart message', () => {
  render(<App />);
  const cartButton = screen.getByText(/ตะกร้า/i);
  fireEvent.click(cartButton);
  const emptyMessage = screen.getByText(/ตะกร้าว่างเปล่า/i);
  expect(emptyMessage).toBeInTheDocument();
});
