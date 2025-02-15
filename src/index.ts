import { AppApi } from './components/AppApi';
import { BasketData } from './components/BasketData';
import { EventEmitter, IEvents } from './components/base/events';
import { Card } from './components/Card';
import { CardsContainer } from './components/CardsContainer';
import { CardsData } from './components/CardsData';
import { Modal } from './components/Modal';
import { Page } from './components/Page';
import { UserData } from './components/UserData';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Basket } from './components/Basket';
import { ICard, TModelCard } from './types';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

const cardsData = new CardsData(events);
const userData = new UserData(events);
const basketData = new BasketData(events);


const cardTemplateCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardTemplatePreview = ensureElement<HTMLTemplateElement>('#card-preview');
const cardTemplateBasket = ensureElement<HTMLTemplateElement>('#card-basket')
const modalTemplatebasket = ensureElement<HTMLTemplateElement>('#basket')




const page = new Page(document.body, events);
const cardPreview = new Card(cloneTemplate(cardTemplatePreview), events)
const cardsContainer = new CardsContainer(document.querySelector('.gallery'));
const modalContainer = new Modal(document.querySelector('#modal-container'), events);
const basket = new Basket(cloneTemplate(modalTemplatebasket), events);
const modalBasketElement = new Card(cloneTemplate(cardTemplateBasket), events)
// const modalContent = new Card(document.querySelector('.modal__content'), events) 

events.onAll((event) => {
  console.log(event.eventName, event.data)
})

// const item = [
//   {
//     "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
//     "description": "Если планируете решать задачи в тренажёре, берите два.",
//     "image": "/5_Dots.svg",
//     "title": "+1 час в сутках",
//     "category": "софт-скил",
//     "price": 750
// }
// ]
// const card = {
//     id: "854cef69-976d-4c2a-a18c-2aa45046c391",
//     description: "моя карточка.",
//     image: "/5_Dots.svg",
//     title: "+1 час",
//     category: "софт-скил",
//     price: 800
// }

// const user = {
//   email: 'net@net.ru',
//   phone: '89629016665',
//   payment: 'онлайн',
//   address: 'москва'
// }

// userData.setUserInfo(user);
// console.log(userData.getUserInfo());

// cardsData.cards = item;
// console.log(cardsData.getCard('854cef69-976d-4c2a-a18c-2aa45046c390'))

// cardsData.addCard(card);
// console.log(cardsData.cards)
// cardsData.deleteCard('854cef69-976d-4c2a-a18c-2aa45046c390')
// console.log(cardsData.cards)


// получаем карточки с сервера
api.getCardList()
.then(card => {
  cardsData.cards = card;
  events.emit('initialData:loaded');
  console.log(cardsData.cards)
})
.catch(err => {
    console.error(err);
});

// const order = {
//   payment: "online",
//   email: "test@test.ru",
//   phone: "+71234567890",
//   address: "Spb Vosstania 1",
//   total: 2200,
//   items: [
//         "854cef69-976d-4c2a-a18c-2aa45046c390",
//         "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
//     ]
// }

// api.order(order).then(order => console.log(order))
// .catch(err => {
//   console.error(err);
// });

events.on('initialData:loaded', () => {
	const cardsArray = cardsData.cards.map((card) => {
		const cardCatalog = new Card(cloneTemplate(cardTemplateCatalog), events);
		return cardCatalog.render(card);
	});

	cardsContainer.render({ catalog: cardsArray });
});

events.on('cards:changed', () => {
  
})

events.on('card:click', ( data: {card: string}) => {
	modalContainer.open();
  const cardId = data.card;
  const cardContent = cardsData.getCard(cardId);
  cardPreview.buttonText = cardContent.selected 
  modalContainer.content = cardPreview.render(cardContent)
})

events.on('mousedown', () => {
	modalContainer.close();
})

events.on('card:basket', (data: {card: string}) => {
	const cardId = data.card;
   cardsData.updateCardId(cardId)
    console.log(cardsData.addCardBasket())
  modalContainer.close();
  page.basketCounter = cardsData.getLengthBasket()
  console.log(cardsData.bidPrise())
})

// events.on('cards:basket', () => {
//   const basket = cardsData.addCardBasket()
  
// })


//?????
events.on('basket:click', () => {
  modalContainer.open();
  modalContainer.content = basket.render();
  const cardContent = cardsData.addCardBasket();
  const cardsArray = cardContent.map((card) => {
		const cardCatalog = new Card(cloneTemplate(cardTemplateBasket), events);
		return cardCatalog.render(card);
	});
  basket.price = cardsData.bidPrise();

	basket.render({ items: cardsArray });

})

events.on('card:delete', (data: {card: string}) => {
  const cardId = data.card;
  console.log(cardId)
  const cardContent = cardsData.updateCardId(cardId)
  page.basketCounter = cardsData.getLengthBasket()
  basket.price = cardsData.bidPrise();
  const cardsArray = cardsData.addCardBasket().map((card) => {
		const cardCatalog = new Card(cloneTemplate(cardTemplateBasket), events);
		return cardCatalog.render(card);
	});
  basket.render ({items: cardsArray})
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});
