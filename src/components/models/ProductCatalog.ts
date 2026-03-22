import { IProduct } from "../../types";

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
  constructor(items: IProduct[]) {
    this._items = items;
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
  get selectedItem(): IProduct | undefined{
    return this._selectedItem;
  }

  set selectedItem(value: IProduct) {
    this._selectedItem = value;
  }
}