import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FooterLinks from './FooterLinks';

describe('<FooterLinks />', () => {
  test('it should mount', () => {
    render(<FooterLinks />);
    
    const footerLinks = screen.getByTestId('FooterLinks');

    expect(footerLinks).toBeInTheDocument();
  });
});