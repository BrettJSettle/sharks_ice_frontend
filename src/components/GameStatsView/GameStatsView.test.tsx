import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GameStatsView from './GameStatsView';

describe('<GameStatsView />', () => {
  test('it should mount', () => {
    render(<GameStatsView />);
    
    const gameStatsView = screen.getByTestId('GameStatsView');

    expect(gameStatsView).toBeInTheDocument();
  });
});