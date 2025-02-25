import { TModelCard } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface ICardView { 
  title: string;
  image: string;
  description: string;
  buttonDisebled: boolean;
  buttonText: boolean;
  category: string;
  // categoryClass: string;
  price: string;
  index: number;
  id: string;
}

export class Card extends Component<ICardView> {
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
        this.events.emit('card:addToBasket', {card: this.cardId})
      );
    } else {
      this.container.addEventListener('click', () =>
      this.events.emit('card:openClick', { card: this.cardId })
      );
    }
	}

  set title(value: string) {
      this.setText(this.cardTitle, value);
  }

  set image(value: string) {
    this.setImage(this.cardImage, value, this.title)
  }

  set description(value: string) {
    this.setText(this.cardDescription, value);
  }

  set buttonDisebled(value: boolean) {
    this.setDisabled(this.cardButton, value);
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
    Array.from(this.cardCategory.classList).forEach(className => {
      if (className.startsWith('card__category_')) {
        this.cardCategory.classList.remove(className);
      }
    });
    switch(value) {
      case 'софт-скил':
      this.cardCategory.classList.add('card__category_soft');
      break;
      case 'другое':
      this.cardCategory.classList.add('card__category_other');
      break;
      case 'дополнительное':
      this.cardCategory.classList.add('card__category_additional');
      break;
      case 'кнопка':
      this.cardCategory.classList.add('card__category_button');
      break;
      case 'хард-скил':
      this.cardCategory.classList.add('card__category_hard');
      break;
    }
  }

  // set categoryClass(value: string) {
  //   switch(value) {
  //     case 'софт-скил':
  //     this.cardCategory.classList.add('card__category_soft');
  //     break;
  //     case 'другое':
  //     this.cardCategory.classList.add('card__category_other');
  //     break;
  //     case 'дополнительное':
  //     this.cardCategory.classList.add('card__category_additional');
  //     break;
  //     case 'кнопка':
  //     this.cardCategory.classList.add('card__category_button');
  //     break;
  //     case 'хард-скил':
  //     this.cardCategory.classList.add('card__category_hard');
  //     break;
  //   }
  // }

  set price(value: string) {
    value === null ? this.cardPrice.textContent = 'Бесценно' : this.cardPrice.textContent = value + ' ' + 'синапсов';
  }

  set index(value: number) {
    this.itemIndex.textContent = `${value}`
  }

  set id(value: string) {
    this.cardId = value;
  }

  get _id() {
    return this.cardId;
  }
}
