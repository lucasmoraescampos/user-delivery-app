export interface CompanyOrder {
    id: number;
    name: string;
    slug: string;
    open: boolean;
    min_order_value: number;
    delivery_price: number;
    radius: number;
    evaluation: number;
    waiting_time: number;
    street_name: string;
    street_number: string;
    complement: string;
    district: string;
    allow_payment_delivery: boolean;
    allow_payment_online: boolean;
    allow_withdrawal_local: boolean;
    payment_methods: Array<{
        id: number;
        name: string;
        icon: string;
    }>;
}