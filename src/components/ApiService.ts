import {
  IApi,
  IApiBuyerPostData,
  IApiPostResponseError,
  IApiPostResponseSuccess,
  IApiProductList,
} from "../types";

export class ApiService {
  private api: IApi;
  private productUri: string = "/product/";
  private postOrderUri: string = "/order/";

  constructor(api: IApi) {
    this.api = api;
  }

  async getProductList(): Promise<IApiProductList> {
    let products: IApiProductList | void;

    products = await this.api.get<IApiProductList>(this.productUri);

    return products || [];
  }

  async postBuyerData(
    data: IApiBuyerPostData,
  ): Promise<IApiPostResponseSuccess | IApiPostResponseError> {
    let response: IApiPostResponseSuccess | IApiPostResponseError;

    response = await this.api.post<IApiPostResponseSuccess | IApiPostResponseError>(this.postOrderUri, data);

    return response;
  }
}
