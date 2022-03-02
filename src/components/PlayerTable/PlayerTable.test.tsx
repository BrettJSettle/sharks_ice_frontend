import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PlayerTable from './PlayerTable';

describe('<PlayerTable />', () => {
  test('it should mount', () => {
    render(<PlayerTable />);
    
    const playerTable = screen.getByTestId('PlayerTable');

    expect(playerTable).toBeInTheDocument();
  });
});