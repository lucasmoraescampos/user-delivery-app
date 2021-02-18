import { CurrentLocation } from "./current-location.model";
import { ProductOrder } from "./product-order.model";

export interface CurrentOrder {
    user_id: number;
    company_id: number,
    location: CurrentLocation;
    products: ProductOrder[]
}