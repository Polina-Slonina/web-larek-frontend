import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IModal {
  content: HTMLElement;
}
export class Modal extends Component<IModal> {
    protected modal: HTMLElement;
    protected events: IEvents;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
      super(container);
      this.events = events;
      const closeButtonElement = this.container.querySelector(".modal__close");
      this._content = ensureElement<HTMLElement>('.modal__content', container);
      closeButtonElement.addEventListener("click", this.close.bind(this));
      this.container.addEventListener("mousedown", (evt) => {
        if (evt.target === evt.currentTarget) {
          this.close();
        }
      });
      this._content.addEventListener('click', (event) => event.stopPropagation());
      this.handleEscUp = this.handleEscUp.bind(this);
    }

    set content(value: HTMLElement) {
      this._content.replaceChildren(value);
    }
  
    open() {
      this.container.classList.add("modal_active");
      this.events.emit('modal:open');
      document.addEventListener("keyup", this.handleEscUp);
        }
  
    close() {
      this.container.classList.remove("modal_active");
      this.content = null;
      this.events.emit('modal:close');
      document.removeEventListener("keyup", this.handleEscUp);
    }
  
    handleEscUp (evt: KeyboardEvent) {
        if (evt.key === "Escape") {
          this.close();
        }
      };
  }
  