import React from 'react';
import Square from './Square';

export default class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        className={(this.props.winners && ~this.props.winners.indexOf(i)) ? 'square--win' : ''}
        onClick={() => this.props.onClick(i)}
        key={`item${i}`}
      />
    );
  }

  render() {
    const size = 3;
    let grid = [];
    let count = 0;
    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        row.push(count++);
      }
      grid.push(row);
    }

    return (
      <div>
        {grid.map((row, i) =>
          <div className="board-row" key={`row${i}`}>
            {row.map(item => this.renderSquare(item))}
          </div>
        )}
      </div>
    );
  }
}
