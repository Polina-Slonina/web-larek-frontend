import { ICard, ICardData, TModelCard } from "../types";
import { IEvents } from "./base/events";

//константы для слушателей
export const event = {
  'initialData: loaded': 'initialData: loaded'
  }

export class CardsData  implements ICardData {
  protected _cards: TModelCard[];
  protected _preview: string | null;
  protected events: IEvents;  

    constructor(events: IEvents) {
      this.events = events;
    }

    set cards(cards:ICard[]) {
      this._cards = cards.map(item => ({...item, selected: false}));
      this.events.emit('cards:changed');
      this.events.emit(event['initialData: loaded']);
    }

    get cards () {
      return this._cards;
    }

    getBasketItems() {
     return this._cards.filter((card) => card.selected === true);
    }

    getLengthBasket() {
      return this.getBasketItems().length;
    }

    getBasketTotal() {
      return this.getBasketItems().reduce((a, c) => a + c.price, 0)
    }

    updateCard(card: TModelCard, value: boolean) {
       card.selected = value
       this.events.emit('basket:changes');
    }

    updateCardId(cardId: string) {
      const updateCard = this.getCard(cardId);
      this.updateCard(updateCard, !updateCard.selected);
    }
 
    getCard(cardId: string) {
      return this._cards.find((item) => item.id === cardId)
    }

    indexCard(card: TModelCard) {
      return `${this.getBasketItems().indexOf(card) + 1}`;
    }

    getIdSelectedCard() {
      const selectedCard = this.getBasketItems()
      return selectedCard.map((card) => card.id)
    }

    clearBasket() {
      return this._cards.forEach((card) => this.updateCard(card, false))
    }

    get preview () {
      return this._preview;
    } 
}