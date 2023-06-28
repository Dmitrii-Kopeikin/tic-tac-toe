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

  model.addEventListener('statechange', () => {
    view.render(model.game, model.stats);
  });

  window.addEventListener('storage', (event) => {
    view.render(model.game, model.stats);
  });

  view.render(model.game, model.stats);

  view.bindGameResetEvent((event) => {
    model.reset();
  });

  view.bindNewRoundEvent((event) => {
    model.newRound();
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = model.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }

    model.playerMove(+square.id);
  });
}

window.addEventListener('load', init);
