import axios from 'axios';

class OrderController{
    index(req, res, next)  {
        res.render('order', {scripts: '<script src="../js/order.js"></script>'})
    }

    async history(req, res, next)  {
        let orderId = req.query.id;
        const orderDetails = await axios({ method: 'get', url: 'http://localhost:8080/api/order_s/' + orderId + '/orderDetails', responseType: 'json', headers: { 'Content-Type': 'application/json' } });
        res.render('order_history', {scripts: '<script src="../js/order.js"></script>', orderDetails: orderDetails})
    }
}

export default new OrderController; 

