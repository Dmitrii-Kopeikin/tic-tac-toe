export type Player = {
  id: number;
  name: string;
  iconClass: string;
  colorClass: string;
};

export type Move = {
  squareId: number;
  player: Player;
};

export type GameStatus = {
  isComplete: boolean;
  winner: Player | null;
};

export type Game = {
  moves: Move[];
  status: GameStatus;
};

export type Stats = {
  playerWithStats: {
      wins: number;
      id: number;
      name: string;
      iconClass: string;
      colorClass: string;
  }[];
  ties: number;
}

export type GameState = {
  currentGameMoves: Move[];
  history: {
    currentRoundGames: Game[];
    allGames: Game[];
  };
};
