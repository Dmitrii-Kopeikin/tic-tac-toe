import Model from './model';
import { Game, Move, Player, Stats } from './types';

export default class View {
  $: Record<string, Element> = {};
  $$: Record<string, NodeListOf<Element>> = {};

  constructor() {
    this.$.grid = this.#selectByDataId('grid');

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

  render(game: Model['game'], stats: Stats) {
    const { playerWithStats, ties } = stats;
    const {
      moves,
      currentPlayer,
      status: { isComplete, winner },
    } = game;

    this.#closeAll();
    this.#clearMoves();

    this.#updatScoreBoard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );

    this.#initiallizeMoves(moves);

    if (isComplete) {
      this.#openModal(winner ? `${winner.name} wins!` : 'Tie!');
      return;
    }

    this.#setTurnIndicator(currentPlayer);
  }

  // Register all the event listeners

  bindGameResetEvent(handler: EventListener) {
    this.$.resetBtn.addEventListener('click', handler);
    this.$.modalBtn.addEventListener('click', handler);
  }

  bindNewRoundEvent(handler: EventListener) {
    this.$.newRoundBtn.addEventListener('click', handler);
  }

  bindPlayerMoveEvent(handler: (element: Element) => void) {
    this.#delegate(this.$.grid, '[data-id="square"]', 'click', handler);
  }

  // DOM helper methods

  #updatScoreBoard(player1Wins: number, player2Wins: number, ties: number) {
    this.$.player1Score.textContent = `${player1Wins} wins`;
    this.$.player2Score.textContent = `${player2Wins} wins`;
    this.$.tiesScore.textContent = `${ties} ties`;
  }

  #openModal(message: string) {
    this.$.modal.classList.remove('hidden');
    this.$.modalText.textContent = message;
  }

  #closeModal() {
    this.$.modal.classList.add('hidden');
  }

  #closeAll() {
    this.#closeModal();
    this.#closeMenu();
  }

  #clearMoves() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }

  #initiallizeMoves(moves: Move[]) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId == +square.id);

      if (existingMove) {
        this.#handlePlayerMove(square, existingMove.player);
      }
    });
  }

  #closeMenu() {
    this.$.menuItems.classList.add('hidden');
    this.$.menuBtn.classList.remove('border');

    const icon = this.#qs('i', this.$.menuBtn);

    icon.classList.add('fa-chevron-dow');
    icon.classList.remove('fa-chevron-up');
  }

  #toggleMenu() {
    this.$.menuItems.classList.toggle('hidden');
    this.$.menuBtn.classList.toggle('border');

    const icon = this.#qs('i', this.$.menuBtn);

    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
  }

  #handlePlayerMove(squere: Element, player: Player) {
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', player.iconClass, player.colorClass);
    squere.replaceChildren(icon);
  }

  #setTurnIndicator(player: Player) {
    const icon = document.createElement('i');
    const label = document.createElement('p');

    icon.classList.add('fa-solid', player.colorClass, player.iconClass);

    label.innerText = `${player.name}, you're up!`;
    label.classList.add(player.colorClass);

    this.$.turn.replaceChildren(icon, label);
  }

  #qs(selector: string, parent: Element | Document): Element {
    const element: Element | null = parent.querySelector(selector);
    if (!element)
      throw new Error(`Could not find elements. Selector: '${selector}'.`);
    return element;
  }

  #qsAll(selector: string, parent: Element | Document) {
    const elements = parent.querySelectorAll(selector);
    if (!elements)
      throw new Error(`Could not find elements. Selector: '${selector}'.`);
    return elements;
  }

  #selectByDataId(selector: string, parent: Document | Element = document) {
    return this.#qs(`[data-id='${selector}']`, parent);
  }

  #selectByDataIdAll(selector: string, parent: Document | Element = document) {
    return this.#qsAll(`[data-id='${selector}']`, parent);
  }

  #delegate(
    element: Element,
    selector: string,
    eventKey: string,
    handler: (element: Element) => void
  ) {
    element.addEventListener(eventKey, (event) => {
      if (!(event.target instanceof Element)) {
        throw new Error('Event target not found.');
      }

      if (event.target.matches(selector)) {
        handler(event.target);
      }
    });
  }
}
