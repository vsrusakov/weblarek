import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

/**
 * Класс для хранения товаров, доступных в магазине, и товара, который по клику выбрал пользователь для подробного отображения
*/
export class ProductCatalog {
  /**
   * Массив товаров в каталоге.
   * @private
   */
  private _items: IProduct[];

  /**
   * Товар, выбранный пользователем (опционально).
   * @private
   */
  private _selectedItem?: IProduct;

  /**
   * Создает экземпляр каталога товаров на главной странице.
   * @param items - массив товаров
   */
  constructor(items: IProduct[], protected events: IEvents) {
    this._items = items;
    this.events.emit("gallery:initialized");
  }

  /**
   * Массив товаров в каталоге.
   */
  get items(): IProduct[] {
    return this._items;
  }

  /**
   * Товар, выбранный пользователем (опционально).
   */
  get selectedItem(): IProduct | undefined {
    return this._selectedItem;
  }

  set selectedItem(value: IProduct) {
    this._selectedItem = value;
    this.events.emit("gallery:itemSelected");
  }
}