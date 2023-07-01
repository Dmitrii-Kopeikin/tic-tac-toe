import { useState } from 'react';
import './Menu.css';

export default function Menu({ onAction }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="menu">
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        Actions
        <i
          className={
            'fa-solid' + (menuOpen ? ' fa-chevron-up' : ' fa-chevron-down')
          }
        ></i>
      </button>

      {menuOpen && (
        <div className="items border">
          <button onClick={() => onAction('reset')}>Reset</button>
          <button onClick={() => onAction('new-round')}>New Round</button>
        </div>
      )}
    </div>
  );
}
