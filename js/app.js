const App = {
  $: {
    turn: document.querySelector("[data-id='turn'"),

    menu: document.querySelector("[data-id='menu']"),
    menuItems: document.querySelector("[data-id='menu-items']"),
    resetBtn: document.querySelector("[data-id='reset-btn']"),
    newRoundBtn: document.querySelector("[data-id='new-round-btn']"),

    squares: document.querySelectorAll("[data-id='square']"),

    modal: document.querySelector("[data-id='modal']"),
    modalText: document.querySelector("[data-id='modal-text']"),
    modalBtn: document.querySelector("[data-id='modal-btn']"),

    winningPatterns: [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ],
  },

  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const player1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const player2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    let winner = null;

    App.$.winningPatterns.forEach((pattern) => {
      const player1Wins = pattern.every((v) => player1Moves.includes(v));
      const player2Wins = pattern.every((v) => player2Moves.includes(v));

      if (player1Wins) winner = 1;
      if (player2Wins) winner = 2;
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress", // in-progress | complete
      winner: winner, // 1 | 2 | null
    };
  },

  //   init: function() {},
  //   init: () => {},
  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });

    App.$.resetBtn.addEventListener("click", (event) => {});

    App.$.newRoundBtn.addEventListener("click", (event) => {});

    App.$.modalBtn.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren(""));
      App.$.modal.classList.add("hidden");
    });

    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };

        if (hasMove(+square.id)) {
          return;
        }

        const lastMove = App.state.moves.at(-1);
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);

        const turnLabel = document.createElement("p");
        const nextPlayer = getOppositePlayer(currentPlayer);
        turnLabel.innerText = `Player ${nextPlayer}, you're up!`;
        const icon = document.createElement("i");
        const nextIcon = document.createElement("i");

        if (currentPlayer === 1) {
          icon.classList.add("fa-solid", "fa-x", "yellow");
          nextIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnLabel.classList.add("turquoise");
        } else {
          icon.classList.add("fa-solid", "fa-o", "turquoise");
          nextIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnLabel.classList.add("yellow");
        }

        App.$.turn.replaceChildren(nextIcon, turnLabel);

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        square.replaceChildren(icon);

        const game = App.getGameStatus(App.state.moves);

        if (game.status === "complete") {
          App.$.modal.classList.remove("hidden");
          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} wins!`;
          } else {
            message = "Tie game!";
          }
          App.$.modalText.textContent = message;
        }
      });
    });
  },
};

window.addEventListener("load", App.init);
