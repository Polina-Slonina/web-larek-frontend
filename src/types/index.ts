
export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface IUser {
  email: string;
  phone: string;
  payment: string;
  address: string;
}

export interface ICardData {
  cards: ICard[];
  preview: string | null;
  addCard(card: TModelCard): void;
  getBasketItems(): void;
  getLengthBasket(): number;
  getBasketTotal(): number;
  deleteCard(): TModelCard[];
  updateCard(card: TModelCard, value: boolean): void;
  updateCardId(cardId: string): void;
  getCard(cardId: string): TModelCard;
  indexCard(card: TModelCard): string;
  getIdSelectedCard(): void;
  clearBasket(cardId: string[]): void;
}

export interface IUserData {
  getUserInfo(field: keyof IUser): void;
  setUserOrder(): void;
  setUserContact(): void;
  setInputField(field: keyof IUser, value: string): void;
  validateOrder(): boolean;
}

export type TModelCard = ICard & {selected: boolean}

export type ICardId = Pick<ICard, 'id' >

export type IFormContact = Pick<IUser, 'email' | 'phone'>

export interface IOrder extends IFormContact, IUser, IBasketTotal {
  items: string[];
}
export interface IForms extends IUser {
  items: string[];
}
export type FormErrors = Partial<Record<keyof IForms, string>>;

export interface IBasketTotal {
  total: number
}

export interface IOrderResult {
  id: string;
  total: number
}