import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
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
import { IUser } from './types';
import { Form } from './components/Form';
import { Success } from './components/Success';


const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// Модель данных приложения
const cardsData = new CardsData(events);
const userData = new UserData(events);

//  темплейты
const cardTemplateCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardTemplatePreview = ensureElement<HTMLTemplateElement>('#card-preview');
const cardTemplateBasket = ensureElement<HTMLTemplateElement>('#card-basket')
const modalTemplatebasket = ensureElement<HTMLTemplateElement>('#basket')
const formOrder = ensureElement<HTMLTemplateElement>('#order');
const formContacts = ensureElement<HTMLTemplateElement>('#contacts');
const successContainer = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modalContainer = new Modal(document.querySelector('#modal-container'), events);
const cardsContainer = new CardsContainer(document.querySelector('.gallery'));

// Переиспользуемые части интерфейса

const basket = new Basket(cloneTemplate(modalTemplatebasket), events);
const order = new Form<IUser>(cloneTemplate(formOrder), events)
const contacts = new Form<IUser>(cloneTemplate(formContacts), events)

// Чтобы мониторить все события, для отладки
events.onAll((event) => {
  console.log(event.eventName, event.data)
})

// получаем карточки с сервера
api.getCardList()
.then(card => {
  cardsData.cards = card;
  events.emit('initialData:loaded');
})
.catch(err => {
    console.error(err);
});

//после загрузки данных карточек с сервера выводим на страницу
events.on('initialData:loaded', () => {
	const cardsArray = cardsData.cards.map((card) => {
		const cardCatalog = new Card(cloneTemplate(cardTemplateCatalog), events);
    cardCatalog.categoryClass = card.category;
		return cardCatalog.render(card);
	});

	cardsContainer.render({ catalog: cardsArray });
});

//открытие превью карточки
events.on('card:openClick', ( data: {card: string}) => {
	modalContainer.open();
  const cardId = data.card;
  const cardContent = cardsData.getCard(cardId);
  const cardPreview = new Card(cloneTemplate(cardTemplatePreview), events)
  cardContent.price === null ? cardPreview.buttonDisebled = true : cardPreview.buttonDisebled = false;
  cardPreview.buttonText = cardContent.selected;
  cardPreview.categoryClass = cardContent.category;
  modalContainer.content = cardPreview.render(cardContent);
})

// клик для закрытия модального окна
events.on('mousedown', () => {
	modalContainer.close();
})

// отрисовыем отображение после клика на удалить/положить в корзину и обновляем данные карточки
events.on('card:addToBasket', (data: {card: string}) => {
	const cardId = data.card;
  cardsData.updateCardId(cardId);
  modalContainer.close();
  
})

// при изменнении данных карточки работаем с отображением
events.on('card:selected', () => {
  page.basketCounter = cardsData.getLengthBasket()
  basket.price = cardsData.getBasketTotal();
  const cardsArray = cardsData.getBasketItems().map((card) => {
		const cardCatalog = new Card(cloneTemplate(cardTemplateBasket), events);
    cardCatalog.index = cardsData.indexCard(card);
		return cardCatalog.render(card);
	});

  basket.render ({items: cardsArray})
  cardsData.getIdSelectedCard()
})

//открываем модальное окно и отрисовываем корзину
events.on('basket:open', () => {
  modalContainer.open();
  modalContainer.content = basket.render();
})

//обновляем данные при нажатии на иконку удалить карточку из корзины
events.on('card:delete', (data: {card: string}) => {
  const cardId = data.card;
  cardsData.updateCardId(cardId);
  
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});

// Открыть форму заказа
events.on('order:open', () => {
  // if(order.valid) order.valid = true
  modalContainer.render({
      content: order.render()
  });
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IUser>) => {
  const { address, payment, phone, email } = errors;
  order.valid = !address && !payment;
  order.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
  contacts.valid = !phone && !email;
  contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей формы ордер
events.on(/^order\..*:change/, (data: { field: keyof IUser, value: string }) => {
  userData.setInputField(data.field, data.value);
});

// меняем отображение при выборе способа оплаты
events.on('button:paymentChanged', (button: HTMLButtonElement) => {
  order.buttonPayment = button.name;
})

// Открыть форму заказа
events.on('order:submit', () => {
  contacts.errors = '';
  modalContainer.render({
      content: contacts.render()
  });
});

// Изменилось одно из полей формы контакт
events.on(/^contacts..*:change/, (data: { field: keyof IUser, value: string }) => {
  userData.setInputField(data.field, data.value);
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
  const orders = {
    payment: userData.getUserInfo('payment'),
    email: userData.getUserInfo('email'),
    phone: userData.getUserInfo('phone'),
    address: userData.getUserInfo('address'),
    total: cardsData.getBasketTotal(),
    items: cardsData.getIdSelectedCard()
  };
  api.order(orders)
      .then((res) => {
          const success = new Success(cloneTemplate(successContainer), events);
          success.price = orders.total;
          modalContainer.render({
              content: success.render({})
          });
          cardsData.clearBasket(orders.items);
      })
      .catch(err => {
          console.error(err);
      });
});

//закрытие окна успешной покупки на кнопку за новыми покупками
events.on('success:close', () => modalContainer.close());