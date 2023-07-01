import './Score.css';

export default function Score({ stats }) {
  return (
    <>
      <div
        className="score shadow"
        style={{ backgroundColor: 'var(--turquoise)' }}
      >
        <p>Player 1</p>
        <span>{stats.playerWithStats[0].wins} Wins</span>
      </div>
      <div
        className="score shadow"
        style={{ backgroundColor: 'var(--light-gray)' }}
      >
        <p>Ties</p>
        <span>{stats.ties}</span>
      </div>
      <div
        className="score shadow"
        style={{ backgroundColor: 'var(--yellow)' }}
      >
        <p>Player 2</p>
        <span>{stats.playerWithStats[1].wins} Wins</span>
      </div>
    </>
  );
}
