export default class View {
  $ = {};
  $$ = {};
  constructor() {
    this.$.turn = this.#selectByDataId('turn');

    this.$.menu = this.#selectByDataId('menu');
    this.$.menuBtn = this.#selectByDataId('menu-btn');
    this.$.menuItems = this.#selectByDataId('menu-items');
    this.$.resetBtn = this.#selectByDataId('reset-btn');
    this.$.newRoundBtn = this.#selectByDataId('new-round-btn');

    this.$$.squares = this.#selectByDataIdAll('square');

    this.$.modal = this.#selectByDataId('modal');
    this.$.modalText = this.#selectByDataId('modal-text');
    this.$.modalBtn = this.#selectByDataId('modal-btn');

    this.$.player1Score = this.#selectByDataId('player1-stats');
    this.$.player2Score = this.#selectByDataId('player2-stats');
    this.$.tiesScore = this.#selectByDataId('ties');

    this.$.menuBtn.addEventListener('click', (event) => {
      this.#toggleMenu();
    });
  }

  // Register all the event listeners

  bindGameResetEvent(handler) {
    this.$.resetBtn.addEventListener('click', handler);
    this.$.modalBtn.addEventListener('click', handler);
  }

  bindNewRoundEvent(handler) {
    this.$.newRoundBtn.addEventListener('click', handler);
  }

  bindPlayerMoveEvent(handler) {
    this.$$.squares.forEach((square) => {
      square.addEventListener('click', () => handler(square));
    });
  }

  // DOM helper methods

  updatScoreBoard(player1Wins, player2Wins, ties) {
    this.$.player1Score.innerText = `${player1Wins} wins`;
    this.$.player2Score.innerText = `${player2Wins} wins`;
    this.$.tiesScore.innerText = `${ties} ties`;
  }

  openModal(message) {
    this.$.modal.classList.remove('hidden');
    this.$.modalText.innerText = message;
  }

  #closeModal() {
    this.$.modal.classList.add('hidden');
  }

  closeAll() {
    this.#closeModal();
    this.#closeMenu();
  }

  clearMoves() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }

  initiallizeMoves(moves) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId == +square.id);

      if (existingMove) {
        this.handlePlayerMove(square, existingMove.player)
      }
    });
  }

  #closeMenu() {
    this.$.menuItems.classList.add('hidden');
    this.$.menuBtn.classList.remove('border');

    const icon = this.$.menuBtn.querySelector('i');

    icon.classList.add('fa-chevron-dow');
    icon.classList.remove('fa-chevron-up');
  }

  #toggleMenu() {
    this.$.menuItems.classList.toggle('hidden');
    this.$.menuBtn.classList.toggle('border');

    const icon = this.$.menuBtn.querySelector('i');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
  }

  handlePlayerMove(squere, player) {
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', player.iconClass, player.colorClass);
    squere.replaceChildren(icon);
  }

  setTurnIndicator(player) {
    const icon = document.createElement('i');
    const label = document.createElement('p');

    icon.classList.add('fa-solid', player.colorClass, player.iconClass);

    label.innerText = `${player.name}, you're up!`;
    label.classList.add(player.colorClass);

    this.$.turn.replaceChildren(icon, label);
  }

  #qs(selector, parent = document) {
    const element = parent.querySelector(selector);
    if (!element)
      throw new Error(`Could not find elements. Selector: '${selector}'.`);
    return element;
  }

  #qsAll(selector, parent = document) {
    const elements = parent.querySelectorAll(selector);
    if (!elements)
      throw new Error(`Could not find elements. Selector: '${selector}'.`);
    return elements;
  }

  #selectByDataId(selector, parent = document) {
    return this.#qs(`[data-id='${selector}']`, parent);
  }

  #selectByDataIdAll(selector, parent = document) {
    return this.#qsAll(`[data-id='${selector}']`, parent);
  }
}
