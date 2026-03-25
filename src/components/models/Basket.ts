import { IProduct } from "../../types";

/**
 * Класс для управления корзиной товаров полязователя.
 */
export class Basket {
  /**
   * Массив товаров
   * @private
   */
  private _items: IProduct[] = [];

  /**
   * Метод для добавления нового товара в корзину
   * @param value - новый товар
   */
  add(value: IProduct) {
    this._items.push(value);
  }

  /**
   * Метод для удаления товара из корзины
   * @param id - идентификатор товара
   */
  delete(id: string) {
    this._items = this._items.filter(item => item.id !== id);
  }

  /**
   * Количество товаров в корзине
   * @returns количество товаров в корзине
   */
  get size(): number {
    return this._items.length;
  }

  /**
   * Массив товаров, добавленных пользователем в корзину
   */
  get items(): IProduct[] {
    return this._items;
  }

  /**
   * Метод возвращает общую стоимость всех товаров в корзине 
   * @returns стоимость корзины
   */
  getTotalCost(): number {
    return this._items.reduce((total, item) => total + (item?.price || 0), 0);
  }

  /**
   * Проверяет наличие товара в корзине по идентификатору
   * @param id - идентификатор товара
   * @returns true, если товар есть в корзине, иначе false
   */
  has(id: string): boolean {
    return this._items.some(item => item.id === id)
  }
}