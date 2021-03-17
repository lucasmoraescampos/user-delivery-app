import { CompanyOrder } from "./company-order.model";
import { CurrentLocation } from "./current-location.model";
import { ProductOrder } from "./product-order.model";

export interface CurrentOrder {

    type: 1 | 2; // 1 to delivery or 2 to withdrawal local

    payment_type: 1 | 2; // 1 to online payment or 2 to delivery payment

    location: CurrentLocation;

    company: CompanyOrder,

    products: ProductOrder[];

    payment_method?: {
        id: number;
        name: string;
        icon: string;
        allow_change_money: boolean;
        change_money?: number;
    };

    card?: {
        id: number;
        number: string;
        icon: string;
        holder_name: string;
    };
    
}