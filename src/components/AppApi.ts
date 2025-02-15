import { IBidprice, ICard, ICardBascet, IOrder, IOrderResult } from '../types';
import { Api, ApiListResponse} from './base/api';

export interface ICardAPI {
    getCardList: () => Promise<ICard[]>;
    getCardItem: (id: string) => Promise<ICard>;
    // getCardUpdate: (id: string) => Promise<ICardBascet>;
    // placeBid(id: string, bid: number): Promise<IBidprice>;
    order: (order: IOrder) => Promise<IOrderResult>;
}

export class AppApi extends Api implements ICardAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
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

	// 	getCardUpdate(id: string): Promise<ICardBascet> {
	// 		return this.get(`/product/${id}`).then(
	// 				(data: ICardBascet) => data
	// 		);
	// }

    // placeBid(id: string, bid: IBidprice): Promise<ICardBascet> {
    //     return this.post(`/product/${id}`, bid).then(
    //         (data: ICard) => data
    //     );
    // }

    order(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}