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
	protected formErrors: FormErrors = {};

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
		return this.order = {
			email: this.order.email,
		  phone: this.order.phone,
		  address: this.order.address,
		  payment: this.order.payment,
		}
  }

	setInputField(field: keyof IUser, value: string) {
		this.order[field] = value;
		this.validateError()
		this.events.emit('user:changed', this.formErrors);
  }

	validForm(data: string[]): boolean {
	 return data.some((i) => i === ''	)
	}

	validateError() {
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
			 return this.formErrors = errors;
			// this.events.emit('formErrors:change', this.formErrors);
			console.log(errors)
			// return Object.keys(errors).length === 0;
	}
}