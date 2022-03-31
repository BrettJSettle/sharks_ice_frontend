import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DivisionsView from './DivisionsView';

describe('<DivisionsView />', () => {
  test('it should mount', () => {
    render(<DivisionsView />);
    
    const divisionsView = screen.getByTestId('DivisionsView');

    expect(divisionsView).toBeInTheDocument();
  });
});