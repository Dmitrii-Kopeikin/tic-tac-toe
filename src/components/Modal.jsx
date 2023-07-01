import './Modal.css';

export default function Modal({ message, onClickHandler }) {
  return (
    <div className="modal">
      <div className="modal-contents">
        <p>{message}</p>
        <button onClick={onClickHandler}>Play again</button>
      </div>
    </div>
  );
}
