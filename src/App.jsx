import './App.css';

import Footer from './components/Footer.jsx';
import Modal from './components/Modal.jsx';
import Menu from './components/Menu.jsx';
import Score from './components/Score.jsx';
import { useLocalStorage } from './useLocalStorage';

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

const winningPatterns = [
  [1, 2, 3],
  [1, 5, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 5, 7],
  [3, 6, 9],
  [4, 5, 6],
  [7, 8, 9],
];

function deriveGame(state) {
  const currentPlayer = players[state.currentGameMoves.length % 2];

  let winner = null;

  for (const player of players) {
    const selectedSquareIds = state.currentGameMoves
      .filter((move) => move.player.id === player.id)
      .map((move) => move.squareId);

    for (const pattern of winningPatterns) {
      if (pattern.every((v) => selectedSquareIds.includes(v))) {
        winner = player;
      }
    }
  }

  return {
    moves: state.currentGameMoves,
    currentPlayer,
    status: {
      isComplete: winner != null || state.currentGameMoves.length === 9,
      winner,
    },
  };
}

function deriveStats(state) {
  return {
    playerWithStats: players.map((player) => {
      const wins = state.history.currentRoundGames.filter(
        (game) => game.status.winner?.id === player.id
      ).length;

      return {
        ...player,
        wins,
      };
    }),
    ties: state.history.currentRoundGames.filter(
      (game) => game.status.winner === null
    ).length,
  };
}

export default function App() {
  // const [state, setState] = useState({
  //   currentGameMoves: [],
  //   history: {
  //     currentRoundGames: [],
  //     allGames: [],
  //   },
  // });

  const [state, setState] = useLocalStorage('game-state-key', {
    currentGameMoves: [],
    history: {
      currentRoundGames: [],
      allGames: [],
    },
  });

  const game = deriveGame(state);
  const stats = deriveStats(state);

  function handlePlayerMove(squareId, player) {
    console.log(state);

    const stateClone = structuredClone(state);

    stateClone.currentGameMoves.push({
      squareId,
      player,
    });

    setState(stateClone);
  }

  function resetGame(isNewRound) {
    setState((prevState) => {
      const stateClone = structuredClone(prevState);
      const { status, moves } = game;

      if (status.isComplete) {
        stateClone.history.currentRoundGames.push({
          moves,
          status,
        });
      }

      stateClone.currentGameMoves = [];

      if (isNewRound) {
        stateClone.history.allGames.push(
          ...stateClone.history.currentRoundGames
        );
        stateClone.history.currentRoundGames = [];
      }

      return stateClone;
    });
  }

  return (
    <>
      <main>
        <div className="grid">
          <div className={`turn ${game.currentPlayer.colorClass}`}>
            <i className={`fa-solid ${game.currentPlayer.iconClass}`}></i>
            <p>{game.currentPlayer.name}, you're up!</p>
          </div>

          <Menu
            onAction={(action) => {
              resetGame(action === 'new-round');
            }}
          />

          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((squareId) => {
            const existingMove = game.moves.find(
              (move) => move.squareId === squareId
            );

            return (
              <div
                key={squareId}
                className="square shadow"
                onClick={() => {
                  if (existingMove) return;
                  handlePlayerMove(squareId, game.currentPlayer);
                }}
              >
                {existingMove && (
                  <i
                    className={`fa-solid ${existingMove.player.colorClass} ${existingMove.player.iconClass}`}
                  ></i>
                )}
              </div>
            );
          })}

          <Score stats={stats} />
        </div>
      </main>

      <Footer />

      {game.status.isComplete && (
        <Modal
          message={
            game.status.winner ? `${game.status.winner.name} wins!` : 'Tie!'
          }
          onClickHandler={() => resetGame(false)}
        />
      )}
    </>
  );
}
