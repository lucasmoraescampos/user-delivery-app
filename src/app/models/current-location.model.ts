export interface CurrentLocation {
    id?: number;
    street_name: string;
    street_number: string;
    complement?: string;
    district: string;
    city: string;
    uf: string;
    postal_code: string;
    country: string;
    latitude: string;
    longitude: string;
    type?: 1 | 2;
}