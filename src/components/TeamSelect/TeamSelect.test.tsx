import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TeamSelect from './TeamSelect';

describe('<TeamSelect />', () => {
  test('it should mount', () => {
    render(<TeamSelect />);
    
    const teamSelect = screen.getByTestId('TeamSelect');

    expect(teamSelect).toBeInTheDocument();
  });
});