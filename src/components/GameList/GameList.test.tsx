import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GameList from './GameList';

describe('<GameList />', () => {
  test('it should mount', () => {
    render(<GameList />);
    
    const gameList = screen.getByTestId('GameList');

    expect(gameList).toBeInTheDocument();
  });
});