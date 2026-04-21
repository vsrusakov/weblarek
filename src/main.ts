import './scss/styles.scss';
import { ApiService } from './components/ApiService';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { IBuyer, IProduct, TPayment } from './types';
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
import { Form } from './components/views/Form/Form.ts';



const eventEmitter = new EventEmitter();

// получение данных о товарах от сервера
const api = new Api(API_URL);
const apiService = new ApiService(api);

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
const previewCardView = new PreviewCard(cloneTemplate('#card-preview'), eventEmitter);

// Презентер 

eventEmitter.on('gallery:initialized', () => {
  const cards = catalogModel.items.map(item => {

    const onClick = (event: MouseEvent) => {
      event.stopPropagation();
      eventEmitter.emit('galleryCard:selected', item);
    };

    const card = new GalleryCard(cloneTemplate('#card-catalog'), { onClick });
    item.image = `${CDN_URL}/${item.image}`;
    return card.render(item);
  });

  galleryView.render({catalog: cards});
});

eventEmitter.on('gallery:itemSelected', () => {
  const selectedItem = catalogModel.selectedItem;

  if (selectedItem) {
    const buttonText = basketModel.has(selectedItem.id) ? 'remove' : 'buy';
    const card = previewCardView.render({ ...selectedItem, buttonText });

    modalView.render({content: card});
    modalView.open();
  }
});

eventEmitter.on('galleryCard:selected', (item: IProduct) => {
  catalogModel.selectedItem = item;
});

eventEmitter.on('previewCard:buy', () => {

  const selectedItem = catalogModel.selectedItem;
  
  if (selectedItem) {
    if (basketModel.has(selectedItem.id)) {
      basketModel.delete(selectedItem.id);
    } else {
      basketModel.add(selectedItem);
    }
    modalView.hide();
  }
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
  orderFormView.reset();
  contactsFormView.reset();

  const orderForm = orderFormView.render();
  modalView.render({content: orderForm});
});

eventEmitter.on('orderForm:submit', () => {

  const errors = buyerModel.validateData();
  const errorMessage = errors.payment || errors.address || '';

  if (errorMessage) {
    orderFormView.render({ errors: errorMessage });
    return;
  }

  orderFormView.reset();
  const contactsForm = contactsFormView.render();
  modalView.render({content: contactsForm});
});

eventEmitter.on('form:changed', (data: {payment: string}) => {
  buyerModel.saveData(data);
});

eventEmitter.on('contactsForm:submit', () => {

  const errors = buyerModel.validateData();
  const errorMessage = errors.email || errors.phone || '';

  if (errorMessage) {
    contactsFormView.render({ errors: errorMessage });
    return;
  }

  apiService.postBuyerData({
    ...buyerModel.getData(),
    total: basketModel.getTotalCost(),
    items: basketModel.items.map(item => item.id)
  })
    .then(response => {
      if ('error' in response) {
        contactsFormView.render({ errors: 'Ошибка создания заказа' });
        console.error('Ошибка в данных заказа:', response.error);
        return;
      }

      contactsFormView.reset();
      const orderSuccessWindow = orderSuccessView.render({ totalCost: response.total });
      modalView.render({content: orderSuccessWindow});

      basketModel.clearData();
      buyerModel.clearData();
    })
    .catch(error => {
      contactsFormView.render({ errors: 'Ошибка создания заказа' });
      console.error('Ошибка запроса к серверу при создании заказа:', error);
    })
});

eventEmitter.on('orderSuccess:close', () => {
  modalView.hide();
});

eventEmitter.on('buyer:dataChanged', (data: Partial<Record<keyof IBuyer, string>>) => {
  const errors = buyerModel.validateData();
  let errorMessage: string | undefined;
  let activeForm: Form;

  if ('payment' in data || 'address' in data) {
    if ('payment' in data) {
      orderFormView.setActivePaymentButton(data.payment as TPayment);
    }
    errorMessage = errors.payment || errors.address || '';
    activeForm = orderFormView;
  } else {
    errorMessage = errors.email || errors.phone || '';
    activeForm = contactsFormView;
  }

  activeForm.submitDisabled = Boolean(errorMessage);
  activeForm.render({ errors: errorMessage });
});

apiService.getProductList()
  .then(products => {
    catalogModel.items = products.items;
  })
  .catch(error => {
    console.error('Ошибка получения данных о товарах от сервера:', error);
    catalogModel.items = [];
  });
