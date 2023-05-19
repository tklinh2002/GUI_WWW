import axios from 'axios';
import { response } from 'express';

class HomeController{
    async index(req, res, next)  {
        await axios({method: 'get', url: 'http://localhost:8080/api/books/search/findBooksByBookIdBetween?low=B001&high=B008', responseType: 'json', headers: {'Content-Type': 'application/json'}}).then(
            response => {
                res.render('home', {
                    style: '<link rel="stylesheet" href="../css/product.css">',
                    products: response.data._embedded.books
                })
            }
        ).catch(next => res.render('404'))
        
    }

    error(req, res, next)  {
        res.render('404')
    }
}

export default new HomeController; 
