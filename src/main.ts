import './scss/styles.scss';
import { ApiService } from './components/ApiService';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils.ts';

import { Basket as BasketModel } from './components/models/Basket.ts';
import { ProductCatalog } from './components/models/ProductCatalog.ts';
import { Buyer } from './components/models/Buyer.ts';

import { Header } from './components/views/Header.ts'
import { Gallery } from './components/views/Gallery.ts'
import { Modal } from './components/views/Modal.ts'
import { Basket } from './components/views/Basket.ts'
import { OrderSuccess } from './components/views/OrderSuccess.ts'
import { GalleryCard } from './components/views/Card/GalleryCard.ts'
import { PreviewCard } from './components/views/Card/PreviewCard.ts'
import { BasketCard } from './components/views/Card/BasketCard.ts'
import { OrderForm } from './components/views/Form/OrderForm.ts'
import { ContactsForm } from './components/views/Form/ContactsForm.ts'



const eventEmitter = new EventEmitter();

// получение данных о товарах от сервера
const api = new Api(API_URL);
const apiService = new ApiService(api);
const products = await apiService.getProductList();

// инициализация моделей
const catalogModel = new ProductCatalog(eventEmitter);
const buyerModel = new Buyer(eventEmitter);
const basketModel = new BasketModel(eventEmitter);

// инициализация views
const headerView = new Header(ensureElement<HTMLElement>('.header'), eventEmitter);
const galleryView = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modalView = new Modal(ensureElement<HTMLElement>('#modal-container'), eventEmitter);
const basketView = new Basket(cloneTemplate('#basket'), eventEmitter);
const orderSuccessView = new OrderSuccess(cloneTemplate('#success'), eventEmitter);
const orderFormView = new OrderForm(cloneTemplate('#order'), eventEmitter);
const contactsFormView = new ContactsForm(cloneTemplate('#contacts'), eventEmitter);
let previewCardView: PreviewCard;

// Презентер 

eventEmitter.on('gallery:initialized', () => {
  const cards = catalogModel.items.map(item => {

    const onClick = (event: MouseEvent) => {
      event.stopPropagation();
      eventEmitter.emit('gallery:itemSelected', item);
    };

    const card = new GalleryCard(cloneTemplate('#card-catalog'), { onClick });
    item.image = `${CDN_URL}/${item.image}`;
    return card.render(item);
  });

  galleryView.render({catalog: cards});
});

eventEmitter.on('gallery:itemSelected', (item: IProduct) => {
 
  const onClick = (event: MouseEvent) => {
    event.stopPropagation();
    eventEmitter.emit('previewCard:buy', item);
  }
  previewCardView = new PreviewCard(cloneTemplate('#card-preview'), { onClick });

  const buttonText = basketModel.has(item.id) ? 'remove' : 'buy';
  const card = previewCardView.render({ ...item, buttonText });

  modalView.render({content: card});
  modalView.open();
});

eventEmitter.on('previewCard:buy', (item: IProduct) => {
  if (basketModel.has(item.id)) {
    basketModel.delete(item.id);
    previewCardView.render({ buttonText: 'buy' });
    return;
  }
  basketModel.add(item);
  previewCardView.render({ buttonText: 'remove' });
});

eventEmitter.on('modal:close', () => {
  modalView.hide();
});

eventEmitter.on('basket:open', () => {
  const basketContent = basketView.render();
  modalView.render({content: basketContent});
  modalView.open();
});

eventEmitter.on('basket:changed', () => {
  headerView.render({counter: basketModel.size});

  const basketItems = basketModel.items.map((item, index) => {
    const onClick = (event: MouseEvent) => {
      event.stopPropagation();
      eventEmitter.emit('basket:itemDeleted', item);
    };

    const card = new BasketCard(cloneTemplate('#card-basket'), { onClick });
    return card.render({ ...item, index: index + 1 }) as HTMLLIElement;
  });

  basketView.render({
    items: basketItems,
    totalPrice: basketModel.getTotalCost()
  });
});

eventEmitter.on('basket:itemDeleted', (item: IProduct) => {
  basketModel.delete(item.id);
});

eventEmitter.on('basket:makeOrder', () => {
  const orderForm = orderFormView.render();
  modalView.render({content: orderForm});
});

eventEmitter.on('orderForm:submit', (data: { formElement: HTMLFormElement, orderButtons: HTMLButtonElement[] }) => {
  const formData = new FormData(data.formElement);
  const paymentButton = data.orderButtons.find(btn => btn.classList.contains('button_alt-active'));
  
  const buyerData = {
    payment: paymentButton ? paymentButton.name : '',
    address: formData.get('address') as string,
  }
  buyerModel.saveData(buyerData);
  const errors = buyerModel.validateData();
  const errorMessage = errors?.payment || errors?.address || '';

  if (errorMessage) {
    orderFormView.render({ errors: errorMessage });
    return;
  }

  orderFormView.reset();
  const contactsForm = contactsFormView.render();
  modalView.render({content: contactsForm});
});

eventEmitter.on('contactsForm:submit', async (formElement: HTMLFormElement) => {
  const formData = new FormData(formElement);

  const buyerData = {
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
  }
  buyerModel.saveData(buyerData);
  const errors = buyerModel.validateData();
  const errorMessage = errors?.email || errors?.phone || '';

  if (errorMessage) {
    contactsFormView.render({ errors: errorMessage });
    return;
  }

  const response = await apiService.postBuyerData({
    ...buyerModel.getData(),
    total: basketModel.getTotalCost(),
    items: basketModel.items.map(item => item.id)
  });

  if ('error' in response) {
    contactsFormView.render({ errors: 'Ошибка создания заказа' });
    console.error('Ошибка создания заказа', response.error);
    return;
  }
  contactsFormView.reset();

  const orderSuccessWindow = orderSuccessView.render({ totalCost: response.total });
  modalView.render({content: orderSuccessWindow});

  basketModel.clearData();
  buyerModel.clearData();
});

eventEmitter.on('orderSuccess:close', () => {
  modalView.hide();
});

catalogModel.items = products.items;