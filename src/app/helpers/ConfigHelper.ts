export class ConfigHelper {
    public static Url = 'https://api.meupedido.org';
    // public static Url = 'http://localhost:8000';
    public static Socket = 'ws://localhost:3000';
    public static Storage = {
        AccessToken: 'access_token',
        CurrentUser: 'current_user',
        DeliveryLocation: 'delivery_location',
        CurrentOrder: 'current_order',
        ProductsDetails: 'products_details',
        PaymentMethod: 'payment_method',
        Searches: 'searches'
    };
}