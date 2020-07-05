export interface DeliveryLocation {
    user_location_id?: number;
    address: {
        street_number: string;
        street_name: string;
        complement: string;
        district: string;
        city: string;
        uf: string;
        country: string;
        postal_code: string;
    };
    latLng: {
        lat: number;
        lng: number;
    };
}