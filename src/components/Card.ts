import { ICard, IUser, TModelCard } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Card extends Component<TModelCard> {
	protected events: IEvents;
	protected cardButton?: HTMLButtonElement;
	protected cardDeleteButton?: HTMLButtonElement;
	protected cardImage?: HTMLImageElement;
	protected cardTitle: HTMLElement;
  protected cardDescription?: HTMLElement;
  protected cardCategory?: HTMLElement;
  protected cardPrice: HTMLElement;
	protected itemIndex?: HTMLElement;
	protected cardId: string;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.cardButton = this.container.querySelector('.button');
		this.cardDeleteButton = this.container.querySelector('.basket__item-delete');
		this.cardImage = this.container.querySelector('.card__image');
		this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
		this.cardDescription = this.container.querySelector('.card__text');
		this.cardCategory = this.container.querySelector('.card__category');
		this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    this.itemIndex = this.container.querySelector('.basket__item-index');
    
    if(this.cardDeleteButton) {
      this.cardDeleteButton.addEventListener('click', () =>
        this.events.emit('card:delete', { card: this.cardId })
      );
    } else if(this.cardButton) {
      this.cardButton.addEventListener('click', () =>
        this.events.emit('card:basket', { card: this.cardId, cardButton: this.cardButton })
      );
    } else {
      this.container.addEventListener('click', () =>
        this.events.emit('card:click', { card: this.cardId })
      );
    }
	}

// set id(value: string) {
//         this.container.dataset.id = value;
//     }

//     get id(): string {
//         return this.container.dataset.id || '';
//     }

    set title(value: string) {
        this.setText(this.cardTitle, value);
    }

    // get title(): string {
    //     return this._title.textContent || '';
    // }

    
    set image(value: string) {
      this.setImage(this.cardImage, value, this.title)
    }

    set description(value: string) {
      this.setText(this.cardDescription, value);
    }

    set buttonText(value: boolean) {
      if (!value) {
        this.cardButton.textContent = 'В корзину';
      } else {
        this.cardButton.textContent = 'Удалить из корзины';
      }
    }

    set category(value: string) {
      this.setText(this.cardCategory, value);
    }

    set price(value: string) {
      this.cardPrice.textContent = value + ' ' + 'синапсов';
    }

    set index(value: string) {
       this.itemIndex.textContent = value
    }

    // set _id(id) {
    //   this.cardId = id;
    // }

    set id(value: string) {
      this.cardId = value;
    }

    get _id() {
      return this.cardId;
    }

    // get id(): string {
    //   return this.container.dataset.id || '';
    // }
    
    deleteCard() {
      this.container.remove();
      this.container = null;
    }
}
