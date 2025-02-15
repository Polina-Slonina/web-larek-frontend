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
      this.events.emit('card:click')
    }

    addCardBasket() {
     return this._cards.filter((card) => card.selected === true);
    }

    getLengthBasket(): number {
      return this.addCardBasket().length;
    }

    bidPrise() {
      return this.addCardBasket().reduce((a, c) => a + c.price, 0)
    }

    checkingPurchasedItems() {
      return this._cards
    }

    deleteCard(cardId: string, payload: Function | null = null) {
      return this.addCardBasket();
      // this._cards = this._cards.filter(card => card.id !== cardId);

      // if(payload) {
      //    payload();
      // } else {
      //    this.events.emit('cards:changed')
      //    this.events.emit('card:click')
      //   }
    }

    updateCard(card: TModelCard, value: boolean) {
       card.selected = value
    }

    updateCardId(cardId: string) {
      const updateCard = this.getCard(cardId);
      this.updateCard(updateCard, !updateCard.selected);
    }

 // updateCard(card: ICard, payload: Function | null = null) {
//     const findedCard = this._cards.find((item) => item.id === card.id)
//     if (!findedCard) this.addCard(card);

//     Object.assign(findedCard, card);

//     if(payload) {
//         payload();
//     } else {
//         this.events.emit('cards:changed')
//         this.events.emit('card:click')
//     }
 // }

    getCard(cardId: string) {
      return this._cards.find((item) => item.id === cardId)
    }

    set preview(cardId: string | null) {
      if (!cardId) {
          this._preview = null;
          return;
        }
      const selectedCard = this.getCard(cardId);
      if (selectedCard) {
          this._preview = cardId;
          this.events.emit('card:selected')
        }
    }

    // checkValidation(data: Record<keyof TCardInfo, string>) {
    //     const isValid = !Boolean(validate(data, constraintsCard ));
    //     return isValid;
    // }

    // checkField(data: { field: keyof TCardInfo; value: string }) {
    // switch (data.field) {
    //   case 'name':
    //     return this.checkName(data.value);
    //   case 'link':
    //     return this.checkLink(data.value);
    // }
    // }

    // checkName(value: string) {
    //    const result = validate.single(value, constraintsCard.name, );
    //    if (result) {
    //     return result[0]
    //    } else {
    //     return '';
    //    }
                
    // }

    // checkLink(value: string) {
    //     const result = validate.single(value, constraintsCard.link, );
    //     if (result) {
    //      return result[0]
    //     } else {
    //      return '';
    //     }
    //  }

    get preview () {
      return this._preview;
    } 

}