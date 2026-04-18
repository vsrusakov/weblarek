import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

/**
 * Класс для хранения товаров, доступных в магазине, и товара, который по клику выбрал пользователь для подробного отображения
*/
export class ProductCatalog {

  /**
   * Товар, выбранный пользователем (опционально).
   * @private
   */
  private _selectedItem?: IProduct;

  /**
   * Создает экземпляр каталога товаров на главной странице.
   * @param items - массив товаров
   */
  constructor(protected events: IEvents, private _items: IProduct[] = []) {}

  /**
   * Массив товаров в каталоге.
   */
  get items(): IProduct[] {
    return this._items;
  }

  set items(value: IProduct[]) {
    this._items = value;
    this.events.emit('gallery:initialized');
  }

  /**
   * Товар, выбранный пользователем (опционально).
   */
  get selectedItem(): IProduct | undefined {
    return this._selectedItem;
  }

  set selectedItem(value: IProduct) {
    this._selectedItem = value;
    this.events.emit('gallery:itemSelected');
  }
}