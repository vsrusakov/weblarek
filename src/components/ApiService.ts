import {
  IApi,
  IApiBuyerPostData,
  IApiPostResponseError,
  IApiPostResponseSuccess,
  IApiProductList,
} from "../types";

/**
 * Класс для получения данных о товарах с сервера и отправки на сервер данных о покупателе и выбранных товарах.
 */
export class ApiService {
  /**
   * Объект, соответсвующий интерфейсу `IApi`, для взаимодействия с сервером
   * @private
   */
  private api: IApi;

  /**
   * Эндпоинт для получения описания товаров от сервера 
   * @private
   */
  private productUri: string = "/product/";

  /**
   * Эндпоинт для отправки данных о покупателе на сервер
   * @private
   */
  private postOrderUri: string = "/order/";

  /**
   * Создает экземпляр класса для отправки запросов на сервер
   * @param api - объект, соответсвующий `IApi`, для взаимодействия с сервером
   */
  constructor(api: IApi) {
    this.api = api;
  }

  /**
   * Получение данных о товарах от сервера
   * @returns количество товаров в поле `total`, массив с описанием товаров в поле `items`
   */
  async getProductList(): Promise<IApiProductList> {
    let products: IApiProductList | void;

    products = await this.api.get<IApiProductList>(this.productUri);

    return products || [];
  }

  /**
   * Отправка данных пользователя на сервер
   * @param data - поля `IBuyer`, поле `total` со стоимостью корзины и поле `items` с массивом идентификаторов товаров из корзины
   * @returns объект с суммой заказа в поле `total` и идентификатором заказа в поле `id` в случае успешного запроса. 
   * иначе - объект с описанием ошибки в поле `error`
   */
  async postBuyerData(
    data: IApiBuyerPostData,
  ): Promise<IApiPostResponseSuccess | IApiPostResponseError> {
    let response: IApiPostResponseSuccess | IApiPostResponseError;

    response = await this.api.post<IApiPostResponseSuccess | IApiPostResponseError>(this.postOrderUri, data);

    return response;
  }
}
