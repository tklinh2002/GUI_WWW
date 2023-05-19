class CheckoutController{
    index(req, res, next)  {
        res.render('checkout', {
            scripts: '<script src="../js/checkout.js"></script>'
        })
    }
}

export default new CheckoutController; 
