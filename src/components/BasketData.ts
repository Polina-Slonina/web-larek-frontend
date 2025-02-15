import { IBasketData, ICard } from "../types";
import { IEvents } from "./base/events";

export class BasketData implements IBasketData {
  protected _cardsBasket: ICard[] = [];
  protected _preview: string | null;
  protected events: IEvents;

  constructor(events: IEvents) {
      this.events = events;
    }

    //  set cardBasket(card: ICard) {
    //   this._cardsBasket.push(card);
    //   this.events.emit('cards:basket');
    // }

    get cardsBasket() {
      return this._cardsBasket;
    }

    addCardBasket(card: ICard) {
        this._cardsBasket.push(card);
        this.events.emit('cards:basket');
    }

    checkcard(cardId: string) {
      return this._cardsBasket.some(card => card.id === cardId)
    }

    numbercards() {
      return this._cardsBasket.length;
    }
    get preview () {
      return this._preview;
    } 

    clearBasket(): ICard[] {
      return this._cardsBasket = []
    }
}