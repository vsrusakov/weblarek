import { ApiService } from './components/ApiService';
import { Api } from './components/base/Api';
import './scss/styles.scss';
import { IApiBuyerPostData } from './types';
import { API_URL } from './utils/constants';


const api = new Api(API_URL);

const apiService = new ApiService(api);

const products = await apiService.getProductList();

products.items.forEach(item => {
  console.log(item.id, item.image);
})

const buyer: IApiBuyerPostData = {
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
  const postResp = await apiService.postBuyerData(buyer);
  console.log(postResp)
} catch (error) {
  console.log(error)
}