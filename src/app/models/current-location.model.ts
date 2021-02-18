export interface CurrentLocation {
    id?: number;
    postal_code: string;
    street_name: string;
    street_number: string;
    district: string;
    complement?: string;
    city: string;
    uf: string;
    country?: string;
}