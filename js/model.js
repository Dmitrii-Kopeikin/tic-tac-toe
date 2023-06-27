const initialValue = {
  moves: [],
};

export default class Model {
  #state = initialValue;
  #winningPatterns = [
    [1, 2, 3],
    [1, 5, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 5, 7],
    [3, 6, 9],
    [4, 5, 6],
    [7, 8, 9],
  ];

  constructor(players) {
    this.players = players;
  }

  get game() {
    const state = this.#getState();
    const currentPlayer = this.players[state.moves.length % 2];

    let winner = null;

    for (const player of this.players) {
      const selectedSquareIds = state.moves
        .filter((move) => move.player.id === player.id)
        .map((move) => move.squareId);

      for (const pattern of this.#winningPatterns) {
        if (pattern.every((v) => selectedSquareIds.includes(v))) {
          winner = player;
        }
      }
    }

    return {
      moves: state.moves,
      currentPlayer,
      status: {
        isComplete: winner != null || state.moves.length === 9,
        winner,
      },
    };
  }

  playerMove(squareId) {
    const state = this.#getState();
    const stateClone = structuredClone(state);

    stateClone.moves.push({
      squareId,
      player: this.game.currentPlayer,
    });

    this.#saveState(stateClone);
  }

  #getState() {
    return this.#state;
  }

  #saveState(stateOrFunction) {
    const prevState = this.#getState();

    let newState;

    switch (typeof stateOrFunction) {
      case 'function':
        newState = stateOrFunction();
        break;
      case 'object':
        newState = stateOrFunction;
        break;
      default:
        throw new Error('Invalid argument passed to saveState.');
    }

    this.#state = newState;
  }
}
