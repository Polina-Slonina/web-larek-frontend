import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected _close: HTMLElement;
  protected description: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container)
    this.description = ensureElement<HTMLElement>('.order-success__description', this.container)

    this._close.addEventListener('click', () => {
      events.emit('success:close', this._close);
    })
  }

  set total(total: number) {
    this.description.textContent =`Списано ${total} синапсов`;
}

}