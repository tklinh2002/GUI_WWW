class AdminController {
    author(req, res, next) {
        res.render('admin_author', { style: '<link rel="stylesheet" href="../css/manager.css">', scripts: '<script src="../js/admin_author.js"></script>' })
    }

    account(req, res, next) {
        res.render('admin_account', { style: '<link rel="stylesheet" href="../css/manager.css">', scripts: '<script src="../js/admin_account.js"></script>' })
    }

    category(req, res, next) {
        res.render('admin_category', { style: '<link rel="stylesheet" href="../css/manager.css">', scripts: '<script src="../js/admin_category.js"></script>' })
    }

    supplier(req, res, next) {
        res.render('admin_supplier', { style: '<link rel="stylesheet" href="../css/manager.css">', scripts: '<script src="../js/admin_supplier.js"></script>' })
    }

    publisher(req, res, next) {
        res.render('admin_publisher', { style: '<link rel="stylesheet" href="../css/manager.css">', scripts: '<script src="../js/admin_publisher.js"></script>' })
    }

    product(req, res, next) {
        res.render('admin_product', { style: '<link rel="stylesheet" href="../css/manager.css">', scripts: '<script src="../js/admin_product.js"></script>' })
    }

    order(req, res, next) {
        res.render('admin_order', { style: '<link rel="stylesheet" href="../css/manager.css">', scripts: '<script src="../js/admin_order.js"></script>' })
    }
}

export default new AdminController; 
