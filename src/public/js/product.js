// function addToCart(id, event) {
//     event.preventDefault();
//     $.ajax({
//         url: "http://localhost:8080/api/books/" + id,
//         dataType: "json",
//         success: function (data) {
//             let quantity = 1;
//             let book = {
//                 id: id,
//                 title: data.bookTitle,
//                 price: data.bookPrice,
//                 image: data.bookImage,
//                 quantity: quantity,
//                 status: false
//             };
//             let listBook = [];
//             listBook.push(book);
//             if (localStorage.getItem('books') == null) {
//                 localStorage.setItem('books', JSON.stringify(listBook));
//             } else {
//                 let listBook = JSON.parse(localStorage.getItem('books'));
//                 let flag = false;
//                 for (let i = 0; i < listBook.length; i++) {
//                     if (listBook[i].title == data.bookTitle) {
//                         listBook[i].quantity += 1;
//                         flag = true;
//                     }
//                 }
//                 if (flag == false) {
//                     listBook.push(book);
//                 }
//                 localStorage.setItem('books', JSON.stringify(listBook));
//             }
//             window.location.href = '/cart'
//         }
//     });
// }
// function getURL(page) {
//     // console.log('Getting')
//     let url = new URL(window.location.toString());
//     let search_params = url.searchParams;
//     search_params.set('page', page);
//     url.search = search_params.toString();
//     let new_url = url.toString();
//     // console.log(new_url);       
//     // alert(new_url);
//     window.location.href = new_url;
// }
$(document).ready(function () {

    function getURL() {
        let url = window.location.toString();
        if (url.includes('product')) {
            if (url.includes('author')) {
                return 'http://localhost:8080/api/books/search/findBooksByBookTitleContainsIgnoreCaseAndAuthorAuthorIdContains' + window.location.search;
            }else {
                return 'http://localhost:8080/api/books/search/findBooksByBookTitleContainsIgnoreCase' + window.location.search;
            }
        }else{
            if (url.includes('author')) {
                return 'http://localhost:8080/api/books/search/findByCategoryCategoryIdAndAuthorAuthorIdContains' + window.location.search + '&category=' + window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
            }else {
                return 'http://localhost:8080/api/categories/' + url.substring(url.lastIndexOf('/')+1) + '/books';
            }
        }
        window.location.toString().includes('product') ? 'http://localhost:8080/api/books/search/findBooksByBookTitleContainsIgnoreCase' + window.location.search : 'http://localhost:8080/api/categories/' + window.location.toString().substring(window.location.toString().lastIndexOf('/')+1) + '/books'
    }

    $('#pagination').pagination({
        dataSource: function (done) {
            $.ajax({
                type: 'GET',
                // url: window.location.toString().includes('product') ? 'http://localhost:8080/api/books/search/findBooksByBookTitleContainsIgnoreCase' + window.location.search : 'http://localhost:8080/api/categories/' + window.location.toString().substring(window.location.toString().lastIndexOf('/')+1) + '/books',
                url: getURL(),
                dataType: 'json',
                success: function (response) {
                    done(response._embedded.books);
                }
            });
        },
        pageSize: 8,
        prevText:'Previous',
        nextText:'Next',
        showFirstOnEllipsisShow: true,
        showLastOnEllipsisShow: true,
        className: 'paginationjs-theme-blue paginationjs-big',
        inlineStyle:true,
        callback: function(data, pagination) {
            console.log(pagination)
            console.log(data)
            $("#render-products").empty();
            content = "";
            let books = data
            for (let i = 0; i < books.length; i++) {
                let url = books[i]._links.book.href;
                content += '<section class="col-md-3 p-2 col-6">';
                content += '    <div class="card">';
                content += '        <a href="/product/'+ url.substring(url.lastIndexOf('/')+1) +'"';
                content += '            class="text-decoration-none text-dark">';
                content += '            <img src="'+ books[i].bookImage +'" class="card-img-top px-2 py-1" alt="Image Product">';
                content += '            <div class="card-body pb-0">';
                content += '                <h5 class="card-title d-flex justify-content-center" style="font-size: 0.9rem; ">';
                content += '                    <p>'+ books[i].bookTitle +'</p>';
                content += '                </h5>';
                content += '                <div class="d-flex justify-content-between">';
                content += '                    <p class="fw-bold">'+ (books[i].bookPrice * (100 - books[i].bookDiscount)/100).toFixed(2) +'</p>';
                content += '                    <p class="text-muted"><s>'+ books[i].bookPrice +'</s></p>';
                content += '                </div>';
                content += '            </div>';
                content += '            <div class="card-body d-flex justify-content-center pt-0">';
                content += '                <button type="button" class="btn btn-danger"';
                content += '                    onclick="addToCart(\''+ url.substring(url.lastIndexOf('/')+1) +'\', event)">';
                content += '                    <i class="fas fa-cart-plus me-2"></i></i>Add to cart</button>';
                content += '            </div>';
                content += '        </a>';
                content += '    </div>';
                content += '</section>';
            }
            $("#render-products").append(content);
        }
    })

    function appendPublishers() {
        $.ajax({
            method: 'get',
            url: "http://localhost:8080/api/publishers",
            dataType: 'json',
            success: function (data) {
                $.each(data._embedded.publishers, function (i, item) {
                    let value = item._links.self.href;
                    $('#search-publisher').append($('<option>', {value: value.substring(value.lastIndexOf('/')+1), text: item.publisherName}));
                })
            },
            error: function (error) {
                console.error(error);
            },
        });
    }

    appendPublishers();

    function appendAuthors() {
        $.ajax({
            method: 'get',
            url: "http://localhost:8080/api/authors",
            dataType: 'json',
            success: function (data) {
                $.each(data._embedded.authors, function (i, item) {
                    let value = item._links.self.href;
                    value = value.substring(value.lastIndexOf('/')+1);
                    if (window.location.search.includes(value)) {
                        $('#search-author').append($('<option>', {value: value, text: item.authorName, selected: true}));
                    }else {
                        $('#search-author').append($('<option>', {value: value, text: item.authorName}));
                    }
                })
            },
            error: function (error) {
                console.error(error);
            },
        });
    }

    appendAuthors();
});
