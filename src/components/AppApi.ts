import { ICard, IOrder, IOrderResult } from '../types';
import { Api, ApiListResponse} from './base/api';
import { IEvents } from './base/events';

export interface ICardAPI {
    getCardList: () => Promise<ICard[]>;
    getCardItem: (id: string) => Promise<ICard>;
    order: (order: IOrder) => Promise<IOrderResult>;
}

export class AppApi extends Api implements ICardAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string,  options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardItem(id: string): Promise<ICard> {
        return this.get(`/product/${id}`).then(
            (card: ICard) => ({
                ...card,
                image: this.cdn + card.image,
            })
        );
    }

    getCardList(): Promise<ICard[]> {
        return this.get('/product').then((data: ApiListResponse<ICard>) =>
					data.items.map((item) => ({
							...item,
							image: this.cdn + item.image
					}))
                    
				);
    }

    order(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}