import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ListSelect from './ListSelect';

describe('<ListSelect />', () => {
  test('it should mount', () => {
    render(<ListSelect options={["one"]}/>);
    
    const listSelect = screen.getByTestId('ListSelect');

    expect(listSelect).toBeInTheDocument();
  });
});