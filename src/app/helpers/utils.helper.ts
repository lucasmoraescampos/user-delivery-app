export class UtilsHelper {

    public static validateEmail(email: string) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        }
        return false;
    }

    public static validatePhone(phone: string) {
        phone = phone.replace(/[^0-9]/g, '');
        return phone.length == 11 && !isNaN(Number(phone));
    }
}