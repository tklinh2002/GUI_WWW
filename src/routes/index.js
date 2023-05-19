import productRouter from './product.route.js';
import homeRouter from './home.route.js';
import aboutRouter from './about.route.js';
import categoryRouter from './category.route.js';
import cartRouter from './cart.route.js';
import orderRouter from './order.route.js';
import checkoutRouter from './checkout.route.js'
import adminRouter from './admin.route.js'


function route(app){
    app.use('/categories', categoryRouter)
    app.use('/product', productRouter)
    app.use('/about', aboutRouter)
    app.use('/cart', cartRouter)
    app.use('/order', orderRouter)
    app.use('/checkout', checkoutRouter);
    app.use('/admin', adminRouter);
    app.use('/', homeRouter)
    app.use('*', homeRouter)
}

export default route;

