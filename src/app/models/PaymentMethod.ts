export interface PaymentMethod {
    type: number;
    id: number;
    icon: string;
    name?: string;
    number?: string;
    expiration_month?: string;
    expiration_year?: string;
    security_code?: string;
    holder_name?: string;
    holder_document_type?: string;
    holder_document_number?: string;
    payment_method?: string;
    token?: string;
    cashback?: number;
}