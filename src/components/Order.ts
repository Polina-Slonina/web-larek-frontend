import { IUser } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./Form";

export class Order extends Form<IUser> {
  constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
  }

  set address(value: string) {
      (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}