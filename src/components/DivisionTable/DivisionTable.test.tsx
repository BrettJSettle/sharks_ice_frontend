import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Division } from '../../common/types';
import DivisionTable from './DivisionTable';

describe('<DivisionTable />', () => {
  test('it should mount', () => {
    render(<DivisionTable division={{
      conferenceId: '0',
      id: '0',
      name: "",
      seasonId: '0',
      teams: [],
    }}/>);
    
    const divisionTable = screen.getByTestId('DivisionTable');

    expect(divisionTable).toBeInTheDocument();
  });
});