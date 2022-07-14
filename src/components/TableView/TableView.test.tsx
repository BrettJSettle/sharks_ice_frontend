import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TableView from './TableView';

describe('<TableView />', () => {
  test('it should mount', () => {
    render(<TableView columns={[{name: 'Name', key: 'name'}]} rows={[{name: 'Red'}]}/>);
    
    const tableView = screen.getByTestId('TableView');

    expect(tableView).toBeInTheDocument();
  });
});