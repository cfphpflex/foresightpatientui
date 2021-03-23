import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Medical Practice ABC Title', () => {
  const { getByText } = render(<App />);
  const titleElement = getByText(/Medical Practice ABC/i);
  expect(titleElement).toBeInTheDocument();

});


test('renders Patients & Appointments Subtitle', () => {
  const { getByText } = render(<App />);
  const subtitleElement = getByText(/Patients & Appointments/i);
  expect(subtitleElement).toBeInTheDocument();
});


