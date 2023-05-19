class AboutController{
    index(req, res, next)  {
        res.render('about')
    }
}

export default new AboutController; 
