export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'card' | 'cash' | '';

export function isPayment(value: string): value is TPayment {
    return ['card', 'cash', ''].includes(value);
}

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IApiProductList {
  total: number;
  items: IProduct[];
}

export interface IApiPostResponseError {
  error: string;
}

export interface IApiPostResponseSuccess {
  id: string;
  total: number;
}

export interface IApiBuyerPostData extends IBuyer {
  total: number;
  items: string[];
}