import { IFormContact, IOrderForm, IUser, IUserData } from "../types";
import { IEvents } from "./base/events";


export class UserData implements IUserData {
  protected email: string;
  protected phone: string;
  protected payment: string;
  protected address: string;
  protected events: IEvents;

  constructor(events: IEvents) {
		this.events = events;
	}

  getUserInfo():IFormContact & IOrderForm {
    return { 
      email: this.email,
      phone: this.phone,
      payment: this.payment,
      address: this.address
    };
  }

	setUserInfo(userData: IUser) {
		this.email = userData.email;
		this.phone = userData.phone;
		this.payment = userData.payment;
		this.address = userData.address;
		this.events.emit('user:changed');
	}

	// checkUserValidation(data: Record<keyof IUser, string>) {
	// 	const isValid = !Boolean(validate(data, constraintsUser));
	// 	return isValid;
	// }

	// checkAvatarValidation(data: Record<keyof IUser, string>) {
	// 	const isValid = !Boolean(validate(data, constraintsAvatar));
	// 	return isValid;
	// }

	// checkField(data: { field: keyof TUserPublicInfo; value: string }) {
	// 	switch (data.field) {
	// 		case 'about':
	// 			return this.checkAbout(data.value);
	// 		case 'name':
	// 			return this.checkName(data.value);
	// 		case 'avatar':
	// 			return this.checkAvatar(data.value);
	// 	}
	// }

	// checkName(value: string) {
	// 	const result = validate.single(value, constraintsUser.name);
	// 	if (result) {
	// 		return result[0];
	// 	} else {
	// 		return '';
	// 	}
	// }

	// checkAbout(value: string) {
	// 	const result = validate.single(value, constraintsUser.about);
	// 	if (result) {
	// 		return result[0];
	// 	} else {
	// 		return '';
	// 	}
	// }

	// checkAvatar(value: string) {
	// 	const result = validate.single(value, constraintsAvatar.avatar);
	// 	if (result) {
	// 		return result[0];
	// 	} else {
	// 		return '';
	// 	}
	// }

	// get id() {
	// 	return this._id;
	// }
}