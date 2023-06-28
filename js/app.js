import View from './view.js';
import Model from './model.js';

const players = [
  {
    id: 1,
    name: 'Player 1',
    iconClass: 'fa-x',
    colorClass: 'turquoise',
  },
  {
    id: 2,
    name: 'Player 2',
    iconClass: 'fa-o',
    colorClass: 'yellow',
  },
];

function init() {
  const view = new View();
  const model = new Model('live-t3-key', players);

  function initView() {
    view.closeAll();
    view.clearMoves();
    view.setTurnIndicator(model.game.currentPlayer);

    view.updatScoreBoard(
      model.stats.playerWithStats[0].wins,
      model.stats.playerWithStats[1].wins,
      model.stats.ties
    );
    view.initiallizeMoves(model.game.moves);
  }

  window.addEventListener('storage', (event) => {
    initView();
  });

  initView();

  view.bindGameResetEvent((event) => {
    model.reset();

    initView();
  });

  view.bindNewRoundEvent((event) => {
    model.newRound();

    initView();
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = model.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }

    view.handlePlayerMove(square, model.game.currentPlayer);

    model.playerMove(+square.id);

    const game = model.game;

    if (game.status.isComplete) {
      view.openModal(
        game.status.winner ? `${game.status.winner.name} wins!` : 'Tie!'
      );
      return;
    }

    view.setTurnIndicator(model.game.currentPlayer);
  });
}

window.addEventListener('load', init);
