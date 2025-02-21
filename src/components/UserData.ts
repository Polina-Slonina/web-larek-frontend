import { FormErrors, IForms, IUser, IUserData } from "../types";
import { IEvents } from "./base/events";


export class UserData implements IUserData {
  protected events: IEvents;
	protected order: IForms = {
		email: '',
		phone: '',
		address: '',
    payment: '',
		items: []
};
	protected formErrors: FormErrors = {};

  constructor(events: IEvents) {
		this.events = events;
		this.order = {
			email: '',
			phone: '',
			address: '',
			payment: '',
			items: []
		}
	}

  getUserInfo(field: keyof IUser) {
		return this.order[field];
  }

	setUserOrder() {
	   this.order.payment = '';
		 this.order.address = '';
	}

	setUserContact() {
		this.order.phone = '';
		this.order.email = '';
 }


	setInputField(field: keyof IUser, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
				this.events.emit('order:ready', this.order);
		}
  }

	validateOrder() {
			const errors: typeof this.formErrors = {};
			if (!this.order.email) {
					errors.email = 'Необходимо указать email';
			}
			if (!this.order.phone) {
					errors.phone = 'Необходимо указать телефон';
			}
			if (!this.order.address) {
				errors.address = 'Необходимо указать адресс';
		  }
			if (!this.order.payment) {
				errors.address = 'Необходимо выбрать способ оплаты';
		  }
			this.formErrors = errors;
			this.events.emit('formErrors:change', this.formErrors);
			return Object.keys(errors).length === 0;
	}
}