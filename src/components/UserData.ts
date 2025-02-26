import { FormErrors, IUser, IUserData } from "../types";
import { IEvents } from "./base/events";


export class UserData implements IUserData {
  protected events: IEvents;
	protected order: IUser = {
		email: '',
		phone: '',
		address: '',
    payment: '',
};
	// protected formErrors: FormErrors = {};

  constructor(events: IEvents) {
		this.events = events;
		this.order = {
			email: '',
			phone: '',
			address: '',
			payment: '',
		}
	}

  getUserInfo() {
		return this.order;
  }

	setInputField(field: keyof IUser, value: string) {
		this.order[field] = value;
		this.events.emit('user:change');
  }

	validateError() {
			const errors: FormErrors = {};

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
			 return  errors;
	}

	clearUser() {
    this.order = {
        email: '',
        phone: '',
        address: '',
        payment: '',
    }
  }
}