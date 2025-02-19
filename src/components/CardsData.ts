import { ICard, ICardData, TModelCard } from "../types";
import { IEvents } from "./base/events";

export class CardsData  implements ICardData {
  protected _cards: TModelCard[];
  protected _preview: string | null;
  protected events: IEvents;  

    constructor(events: IEvents) {
      this.events = events;
    }

    set cards(cards:ICard[]) {
      this._cards = cards.map(item => ({...item, selected: false}));
      this.events.emit('cards:changed')
    }

    get cards () {
      return this._cards;
    }

    addCard(card: TModelCard) {
      this._cards = [card, ...this._cards]
      this.events.emit('cards:changed')
      this.events.emit('card:openClick')
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

    deleteCard() {
      return this.getBasketItems();
    }

    updateCard(card: TModelCard, value: boolean) {
       card.selected = value
       this.events.emit('card:selected');
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

    clearBasket(cardId: string[]) {
      cardId.forEach((id) => {
        const updateCard = this.getCard(id);
        this.updateCard(updateCard, !updateCard.selected);
      })
    }

    get preview () {
      return this._preview;
    } 
}