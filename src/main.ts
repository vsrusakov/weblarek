import { Basket } from './components/models/Basket.ts';
import { ProductCatalog } from './components/models/ProductCatalog.ts';
import { Buyer } from './components/models/Buyer.ts';
import './scss/styles.scss';
import {apiProducts} from './utils/data.ts'

const productsModel = new ProductCatalog(apiProducts.items);

productsModel.items.forEach(item => {
  console.log(`Товар из каталога: ${item.id}`);
})

console.log(`selectedItem до выбора: ${productsModel.selectedItem}`);

productsModel.selectedItem = apiProducts.items[0];

console.log(`selectedItem после выбора: ${productsModel.selectedItem.id}`);

const basket = new Basket();

console.log(`пустая корзина: ${basket.items}`);

basket.add(apiProducts.items[1]);
basket.add(apiProducts.items[2]);

console.log(`непустая корзина: ${basket.items}`);
basket.items.forEach(item => {
  console.log(`Товар из корзины: ${item.id}`);
})

basket.delete(apiProducts.items[3].id);
basket.delete(apiProducts.items[2].id);

console.log(`непустая корзина: ${basket.items}`);
basket.items.forEach(item => {
  console.log(`Товар из корзины: ${item.id}`);
})

basket.add(apiProducts.items[0]);
basket.add(apiProducts.items[2]);
basket.add(apiProducts.items[3]);
basket.add(apiProducts.items[4]);
basket.add(apiProducts.items[44]);

console.log(`Товар из корзины: ${apiProducts.items[44]}`);

console.log(`цена корзины: ${basket.getTotalCost()}`);

basket.delete(apiProducts.items[3].id);

console.log(`наличие товара (существующего): ${basket.has(apiProducts.items[0].id)}`);
console.log(`наличие товара (существующего): ${basket.has(apiProducts.items[1].id)}`);
console.log(`наличие товара (существующего): ${basket.has(apiProducts.items[2].id)}`);
console.log(`наличие товара (несуществующего): ${basket.has(apiProducts.items[3].id)}`);
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
