import React from 'react';
import Board from './Board';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        pos: null,
        current: true,
      }],
      stepNumber: 0,
      xIsNext: true,
      sortIsAsc: true,
      winner: null,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    let winner;

    if (this.calculateWinner(squares).player) {
      winner = this.calculateWinner(squares);
    }

    if (this.calculateWinner(squares).player || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history
        .map((move) => {
          move.current = false;
          return move;
        })
        .concat([{
          squares: squares,
          pos: i,
          current: true,
        }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winner: winner,
    });
  }

  jumpTo(step) {
    const history = this.state.history.slice();

    this.setState({
      history: history
        .map((move, historyStep) => {
          move.current = (historyStep === step);
          return move;
        }),
      stepNumber: step,
      xIsNext: (step % 2 === 0)
    })
  }

  revert() {
    this.setState({
      sortIsAsc: !this.state.sortIsAsc
    })
  };

  calculateWinner(squares) {
    let player;
    let winSquares = [];
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        player = squares[a];
        winSquares = [a, b, c];
      }
    }
    return {
      player: player,
      squares: winSquares
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let winner = {
      player: null,
      squares: null,
    };
    if (this.calculateWinner(current.squares).player) {
      winner = {
        player: this.calculateWinner(current.squares).player,
        squares: this.calculateWinner(current.squares).squares,
      };
    }


    const moves = history.map((step, move) => {
      const posCol = parseInt(history[move].pos / 3) + 1;
      const posRow = history[move].pos % 3 + 1;
      const desc = move ?
        `Перейти к шагу # ${move} (${posRow}, ${posCol})` :
        'Перейти к началу игры';

      return (
        <li key={move} className={'history-item'}>
          <button
            type={'button'}
            className={`history-button ${history[move].current ? 'active' : null}`}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      )
    });

    let status;
    if (winner.player) {
      status = 'Выиграл ' + winner.player;
    } else if (!~current.squares.indexOf(null)) {
      status = 'Ничья';
    } else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winners={winner.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            type={'button'}
            onClick={() => this.revert()}
          >
            {this.state.sortIsAsc ? 'По убыванию' : 'По возрастанию'}
          </button>
          <ol>{this.state.sortIsAsc ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}
