import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GameSelect from './GameSelect';

describe('<GameSelect />', () => {
  test('it should mount', () => {
    render(<GameSelect />);
    
    const gameSelect = screen.getByTestId('GameSelect');

    expect(gameSelect).toBeInTheDocument();
  });
});