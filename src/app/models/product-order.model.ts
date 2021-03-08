export interface ProductOrder {
    id: number;
    name: string;
    description: string;
    price: number;
    rebate: number;
    qty: number;
    note: string;
    image: string;
    complements?: Array<{
        id: number;
        subcomplements: Array<{
            id: number;
            description: string;
            qty: number;
            price: number;
        }>;
    }>;
}