import axios from "axios";
import {LocalStorage} from 'node-localstorage';
class CartController {
    index(req, res, next) {
        res.render('cart', {
            scripts: '<script src="../js/cart.js"></script>'
        });
    }

}

export default new CartController; 
