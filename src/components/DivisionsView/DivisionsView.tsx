import React from 'react';

import ListSelect from '../ListSelect/ListSelect';
import DivisionTable from '../DivisionTable/DivisionTable';

import { getSeason } from '../../common/util';
import { BACKEND_API, Division } from '../../common/types';
import styles from './DivisionsView.module.css';

interface DivisionsViewProps { 
}

interface DivisionsViewState {
  divisions: Division[],
  currentDivision?: Division
};

class DivisionsView extends React.Component<DivisionsViewProps> {

  state: DivisionsViewState = {
    divisions: [],
    currentDivision: undefined
  };

  componentDidMount() {
    this.loadDivisions();
  }

  loadDivisions = () => {
    let season = getSeason();
    fetch(BACKEND_API + `/seasons/${season}/divisions`)
      .then(data => {
        return data.json();
      }).then(({ divisions }) => {
        this.setState({
          divisions,
          currentDivision: divisions[0]
        });
      }).catch(error => {
        console.log(error);
        // setTimeout(this.loadDivisions, 3000)
      });
  }

  setDivision = (name: string) => {
    const currentDivision = this.state.divisions.find((div: Division) => div.name === name);
    this.setState({ currentDivision })
  }

  render() {
    const {
      divisions,
      currentDivision
    } = this.state;

    let divOptions = divisions.map((div: Division) => div.name);
    return (
      <div className={styles.DivisionsView} data-testid="DivisionsView">
        <ListSelect options={divOptions} onChange={this.setDivision} />
        {!!currentDivision && <DivisionTable division={currentDivision} />}
      </div>);
  }
}

export default DivisionsView;