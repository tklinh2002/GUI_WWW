import axios from 'axios';

class CategoryController{
    async index(req, res, next)  {
        // const data = await axios({method: 'get', url: 'http://localhost:8080/api/categories/' + req.params.id +'/books?page=0&size=8', responseType: 'json', headers: {'Content-Type': 'application/json'}});
        res.render('product', {
            style: '<link rel="stylesheet" href="../css/pagination.css"><link rel="stylesheet" href="../css/product.css">',
            scripts: '<script src="../js/handlebars-v4.7.7.js"></script><script src="../js/pagination.min.js"></script><script src="../js/product.js"></script>',
        })
    }
}

export default new CategoryController; 
