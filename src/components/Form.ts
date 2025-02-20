import { IUser } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IForm {
  valid: boolean;
  errors: string[];
}

export class Form<T> extends Component<IForm> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected buttonsAlt: NodeListOf<HTMLButtonElement>;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
      super(container);

      this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
      this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
      this.buttonsAlt = this.container.querySelectorAll('.button_alt')

      this.container.addEventListener('input', (e: Event) => {
          const target = e.target as HTMLInputElement;
          const field = target.name as keyof T;
          const value = target.value;
          this.onInputChange(field, value);
      });

      this.buttonsAlt.forEach((button) => {
        button.addEventListener('click', (e: Event)=> {
          const target = e.target as HTMLButtonElement;
          const field = 'payment' as keyof T
          const value: string = target.name ;
          this.onInputChange(field, value);
          this.events.emit(`button:paymentChanged`, button)
        })
      })

      this.container.addEventListener('submit', (e: Event) => {
          e.preventDefault();
          this.events.emit(`${this.container.name}:submit`);
      });
  }

  protected onInputChange(field: keyof T, value: string) {
      this.events.emit(`${this.container.name}.${String(field)}:change`, {
          field,
          value
      });
  }

  set buttonPayment(value: string) {
    this.buttonsAlt.forEach((button) => {
     if ((button.name === value)) {
      button.classList.toggle('button_alt-active')
     } else {
      button.classList.remove('button_alt-active')
     }
    })
  }

  set valid(value: boolean) {
      this._submit.disabled = !value;
  }

  set errors(value: string) {
      this.setText(this._errors, value);
  }
}