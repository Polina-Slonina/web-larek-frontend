import { IUser } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./Form";

export class Order extends Form<IUser> {
  protected buttonsAlt: NodeListOf<HTMLButtonElement>;

  constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
      this.buttonsAlt = this.container.querySelectorAll('.button_alt');

      this.buttonsAlt.forEach((button) => {
        button.addEventListener('click', (e: Event)=> {
          const target = e.target as HTMLButtonElement;
          const field = 'payment' as keyof IUser
          const value: string = target.name;
          this.buttonPayment(value)
          this.onInputChange(field, value);
        })
      })
  }

  set address(value: string) {
      (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }

  buttonPayment(value: string) {
    this.buttonsAlt.forEach((button) => {
      button.name === value ? button.classList.add('button_alt-active') : button.classList.remove('button_alt-active');
    })
  }
}