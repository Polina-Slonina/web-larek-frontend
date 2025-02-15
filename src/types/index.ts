
export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
  // selected: boolean;
}

export interface IUser {
  email: string;
  phone: string;
  payment: string;
  address: string;
}

export interface IBasketData {
  cardsBasket: ICard[];
  preview: string | null;
  addCardBasket(card: ICard): void;
  checkcard(cardId: string): boolean;
  numbercards(): number;
  clearBasket(): ICard[];
}

export interface ICardData {
  cards: ICard[];
  preview: string | null;
  addCard(card: ICard): void;
  deleteCard(cardId: string, payload: Function | null): void;
  // updateCard(card: ICard, payload: Function | null): void;
  getCard(cardId: string): ICard
}

export interface IUserData {
  getUserInfo():IFormContact & IOrderForm;
  setUserInfo(userData: IUser): void;
  // chackUserValidation(data: Record<keyof IUser, string>): boolean
}

export type TModelCard = ICard & {selected: boolean}

export type ICardBascet = Pick<ICard, 'id' >

export type IFormContact = Pick<IUser, 'email' | 'phone'>

export type IOrderForm = Pick<IUser, 'payment' | 'address'>

export interface IOrder extends IFormContact, IOrderForm, IBidprice {
  items: string[]
}

export interface IBidprice {
  total: number
}

export interface IOrderResult {
  id: string;
  total: number
}