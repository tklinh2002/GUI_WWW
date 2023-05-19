import axios from 'axios';

class ProductController {

    // Show the product detail
    async detail(req, res, next) {
        const data = await axios({ method: 'get', url: 'http://localhost:8080/api/books/' + req.params.id, responseType: 'json', headers: { 'Content-Type': 'application/json' } });
        const author = await axios({ method: 'get', url: 'http://localhost:8080/api/books/' + req.params.id + '/author', responseType: 'json', headers: { 'Content-Type': 'application/json' } });
        const publisher = await axios({ method: 'get', url: 'http://localhost:8080/api/books/' + req.params.id + '/publisher', responseType: 'json', headers: { 'Content-Type': 'application/json' } });
        const supplier = await axios({ method: 'get', url: 'http://localhost:8080/api/books/' + req.params.id + '/supplier', responseType: 'json', headers: { 'Content-Type': 'application/json' } });
        res.render('product_detail', {
            style: '<link rel="stylesheet" href="../css/product_detail.css">' +
                '<link rel="stylesheet" href="../css/all.min.css">',
            product: data.data,
            author: author.data,
            publisher: publisher.data,
            supplier: supplier.data
        })
    }

    async search(req, res, next) {
        // let page = req.query.page;
        // if (page) {
        //     page = '&page=' + page;
        // }else{
        //     page = '&page=0';
        // }
        // let size = req.query.size;
        // if (size) {
        //     size = '&size=' + size;
        // }else{
        //     size = '&size=8';
        // }
        // const data = await axios({ method: 'get', url: 'http://localhost:8080/api/books/search/findBooksByBookTitleContainsIgnoreCase?bookTitle=' + req.query.title + page + size, responseType: 'json', headers: { 'Content-Type': 'application/json' } });
        res.render('product', {
            style: '<link rel="stylesheet" href="../css/pagination.css"><link rel="stylesheet" href="../css/product.css">',
            scripts: '<script src="../js/pagination.min.js"></script><script src="../js/product.js"></script>',
            // data: data.data
            bookTitle: req.query.bookTitle
        })
    }
}

export default new ProductController; 
