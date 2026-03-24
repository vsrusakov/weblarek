import { ApiService } from './components/ApiService';
import { Api } from './components/base/Api';
import './scss/styles.scss';
import { IApiBuyerPostData } from './types';
import { API_URL } from './utils/constants';
import { Basket } from './components/models/Basket.ts';
import { ProductCatalog } from './components/models/ProductCatalog.ts';
import { Buyer } from './components/models/Buyer.ts';
import './scss/styles.scss';



const api = new Api(API_URL);

const apiService = new ApiService(api);

const products = await apiService.getProductList();

products.items.forEach(item => {
  console.log(item.id, item.image);
})

const buyerData: IApiBuyerPostData = {
    "payment": "cash",
    "email": "test@test.ru",
    "phone": "+71234567890",
    "address": "egerer",
    "total": 2200,
    "items": [
        "854cef69-976d-4c2a-a18c-2aa45046c390",
        "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
    ]
}

try {
  const postResp = await apiService.postBuyerData(buyerData);
  console.log(postResp)
} catch (error) {
  console.log(error)
}


// код ниже - тест модеоей данных из коммита d7dfdff77836b3d4116f665830beb4fa5181b288 ветки dev


const productsModel = new ProductCatalog(products.items);

productsModel.items.forEach(item => {
  console.log(`Товар из каталога: ${item.id}`);
})

console.log(`selectedItem до выбора: ${productsModel.selectedItem}`);

productsModel.selectedItem = products.items[0];

console.log(`selectedItem после выбора: ${productsModel.selectedItem.id}`);

const basket = new Basket();

console.log(`пустая корзина: ${basket.items}`);

basket.add(products.items[1]);
basket.add(products.items[2]);

console.log(`непустая корзина: ${basket.items}`);
basket.items.forEach(item => {
  console.log(`Товар из корзины: ${item.id}`);
})

basket.delete(products.items[3].id);
basket.delete(products.items[2].id);

console.log(`непустая корзина: ${basket.items}`);
basket.items.forEach(item => {
  console.log(`Товар из корзины: ${item.id}`);
})

basket.add(products.items[0]);
basket.add(products.items[2]);
basket.add(products.items[3]);
basket.add(products.items[4]);
basket.add(products.items[44]);

console.log(`Товар из корзины: ${products.items[44]}`);

console.log(`цена корзины: ${basket.getTotalCost()}`);

basket.delete(products.items[3].id);

console.log(`наличие товара (существующего): ${basket.has(products.items[0].id)}`);
console.log(`наличие товара (существующего): ${basket.has(products.items[1].id)}`);
console.log(`наличие товара (существующего): ${basket.has(products.items[2].id)}`);
console.log(`наличие товара (несуществующего): ${basket.has(products.items[3].id)}`);
console.log(`наличие товара (несуществующего): ${basket.has('')}`);
console.log(`наличие товара (несуществующего): ${basket.has('abc')}`);


const buyer = new Buyer();

console.log(`покупатель без данных: ${Object.entries(buyer.getData())}`);

buyer.clearData();

console.log(`покупатель без данных после очистки данных: ${Object.entries(buyer.getData())}`);

console.log(`валидация покупателя без данных: ${Object.entries(buyer.validateData())}`);

buyer.saveData({'payment': 'cash'});

console.log(`покупатель с данными payment: ${Object.entries(buyer.getData())}`);

console.log(`валидация покупателя с данными payment: ${Object.entries(buyer.validateData())}`);

buyer.saveData({'address': '5 ave, NY'});

console.log(`покупатель с данными address: ${Object.entries(buyer.getData())}`);

console.log(`валидация покупателя с данными address: ${Object.entries(buyer.validateData())}`);

buyer.saveData({'email': 'a@a.a'});

console.log(`покупатель с данными email: ${Object.entries(buyer.getData())}`);

console.log(`валидация покупателя с данными email: ${Object.entries(buyer.validateData())}`);

buyer.saveData({'phone': '123'});

console.log(`покупатель с данными phone: ${Object.entries(buyer.getData())}`);

console.log(`валидация покупателя с данными phone: ${Object.entries(buyer.validateData())}`);

buyer.clearData();

console.log(`покупатель после очистки данных: ${Object.entries(buyer.getData())}`);

buyer.saveData({'payment': 'card'});
buyer.saveData({'address': '5 ave, NY'});
buyer.saveData({'email': 'a@a.a'});
buyer.saveData({'phone': '123'});

console.log(buyer.payment, buyer.address , buyer.email , buyer.phone );
