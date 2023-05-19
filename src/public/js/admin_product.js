async function loadProduct(page) {
    $.ajax({
        url: "http://localhost:8080/api/books/search/find10Books",
        data: {
            offset: page
        },
        success: function (data) {
            var books = data._embedded.books;
            // Render table
            for (var i = 0; i < books.length; i++) {
                var table = '';
                table += '<tr>';

                table += '<td>' + books[i].bookTitle + '</td>';
                $.ajax({
                    url: books[i]._links.category.href,
                    async: false,
                    success: function (data) {
                        table += '<td>' + data.categoryName + '</td>';
                    }
                });
                table += '<td><img src="' + books[i].bookImage + '" class="imgsp" alt=" "></td>';
                table += '<td>' + books[i].bookInventory + '</td>';
                var bookId = books[i]._links.book.href.substring(books[i]._links.book.href.lastIndexOf("/") + 1);
                $.ajax({
                    url: "http://localhost:8080/api/orderDetails/search/countBookSell",
                    data: {
                        bookId: bookId
                    },
                    async: false,
                    success: function (data) {
                        table += '<td>' + data + '</td>';
                    },
                    error: function (data) {
                        table += '<td>' + 0 + '</td>';
                    }
                })
                table += '<td><button type="button" class="btn btn-outline-warning" id="editBook" data-bs-toggle="modal" data-bs-target="#modalProduct""><i class="fas fa-edit"></i></button>';
                table += '<button type="button" class="btn btn-outline-danger" id="deleteBook"><i class="fas fa-trash-alt"></i></button></td>';
                table += '</tr>';
                $('#tableProduct').append(table);
            }
        }
    });
}

function searchBookByTitle(title) {
    $.ajax({
        url: "http://localhost:8080/api/books/search/searchBooksByBookTitle",
        data: {
            bookTitle: title
        },
        success: function (data) {
            var books = data._embedded.books;
            // Render table
            for (var i = 0; i < books.length; i++) {
                var table = '';
                table += '<tr>';

                table += '<td>' + books[i].bookTitle + '</td>';
                $.ajax({
                    url: books[i]._links.category.href,
                    async: false,
                    success: function (data) {
                        table += '<td>' + data.categoryName + '</td>';
                    }
                });
                table += '<td><img src="' + books[i].bookImage + '" class="imgsp" alt=" "></td>';
                table += '<td>' + books[i].bookInventory + '</td>';
                var bookId = books[i]._links.book.href.substring(books[i]._links.book.href.lastIndexOf("/") + 1);
                console.log(bookId)
                $.ajax({
                    url: "http://localhost:8080/api/orderDetails/search/countBookSell",
                    data: {
                        bookId: bookId
                    },
                    async: false,
                    success: function (data) {
                        table += '<td>' + data + '</td>';
                    },
                    error: function (data) {
                        table += '<td>' + 0 + '</td>';
                    }
                })
                table += '<td><button type="button" class="btn btn-outline-warning" id="editBook" data-bs-toggle="modal" data-bs-target="#modalProduct""><i class="fas fa-edit"></i></button>';
                table += '<button type="button" class="btn btn-outline-danger" id="deleteBook"><i class="fas fa-trash-alt"></i></button></td>';
                table += '</tr>';
                $('#tableProduct').append(table);
            }
        }
    });
}

function loadPaganition() {
    // Get the pagination element
    var pagination = $('.pagination');

    // Get the previous and next buttons
    var previous = pagination.find('a[aria-label="Previous"]');
    var next = pagination.find('a[aria-label="Next"]');

    // Get the page links
    var pages = pagination.find('a.page-link');
    var pagesNum;

    $.ajax({
        url: "http://localhost:8080/api/books/search/countBook",
        async: false,
        success: function (data) {
            pagesNum = data
        }
    });

    (pagesNum % 10 === 0) ? (pagesNum = pagesNum / 10) : (pagesNum = parseInt((pagesNum / 10)) + 1)

    // Set the initial page to 1
    var currentPage = 1

    // Define a function to load the page
    function loadPage(page) {
        // Your code to load the page here
        // You can use the `page` parameter to load the appropriate page
        $('#tableProduct').empty();
        loadProduct((page - 1) * 10)
    }

    // Load the initial page
    loadPage(currentPage);

    // Attach a click event to the previous button
    previous.click(function (e) {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            loadPage(currentPage);
        } else {
            currentPage = 1
            loadPage(currentPage)
        }
    });

    // Attach a click event to the next button
    next.click(function (e) {
        e.preventDefault();
        if (currentPage < pagesNum) {
            currentPage++;
            loadPage(currentPage);
        } else {
            currentPage = pagesNum
            loadPage(currentPage)
        }
    });

    // Attach a click event to each page link
    pages.click(function (e) {
        e.preventDefault();
        currentPage = parseInt($(this).text());
        loadPage(currentPage);
    });

}

function addProduct() {
    let bookTitle = $('#bookTitle').val()
    bookTitle = bookTitle.trim()
    let bookSlug = bookTitle.replace(/\s+/g, "-")
    let bookDescription = $('#bookDescription').val()
    let bookPrice = $('#bookPrice').val()
    let bookDiscount = $('#bookDiscount').val()
    let bookSize = $('.bookSize option:selected').text()
    let bookStatus = $('.bookStatus option:selected').text()
    let bookWeight = $('#bookWeight').val()
    let bookInventory = $('#bookInventory').val()
    let bookImage = $('#bookImage').val()
    bookImage = '../imgs/static/' + bookImage
    let categoryN = $('.category option:selected').text()
    let publisherN = $('.publisher option:selected').text()
    let authorN = $('.author option:selected').text()
    let supplierN = $('.supplier option:selected').text()

    var bookAdd = {
        bookPrice: bookPrice,
        bookTitle: bookTitle,
        bookDiscount: bookDiscount,
        bookDescription: bookDescription,
        bookSize: bookSize,
        bookWeight: bookWeight,
        bookType: categoryN,
        bookInventory: bookInventory,
        bookLanguage: 'English',
        bookStatus: bookStatus,
        bookSlug: bookSlug,
        bookImage: bookImage,
        category: {
            categoryName: categoryN
        },
        publisher: {
            publisherName: publisherN
        },
        author: {
            authorName: authorN
        },
        supplier: {
            supplierName: supplierN
        }
    }
    console.log(bookAdd)
    $.ajax({
        url: "http://localhost:8080/books/addBook",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(bookAdd),
        success: function (data) {
            alert(data);
            $('#modalProduct').modal('hide');
            $('#tableProduct').empty();
            loadProduct(0)
        },
        error: function (data) {
            alert(data);
        }
    });

}

async function loadDataModal() {
    // load catagories
    $('.category').empty()
    $.ajax({
        url: "http://localhost:8080/api/categories/search/findCategoriesBy",
        success: function (data) {
            var catagories = data._embedded.categories
            var category = ''
            for (var i = 0; i < catagories.length; i++) {
                if (i === 0)
                    category += '<option selected>' + catagories[i].categoryName + '</option>'
                else
                    category += '<option>' + catagories[i].categoryName + '</option>'

            }
            $('.category').append(category);
        }
    });
    $('.author').empty()
    //load author
    $.ajax({
        url: "http://localhost:8080/api/authors/search/findAuthorsBy",
        success: function (data) {
            var authors = data._embedded.authors
            var author = ''
            for (var i = 0; i < authors.length; i++) {
                if (i === 0)
                    author += '<option selected>' + authors[i].authorName + '</option>'
                else
                    author += '<option>' + authors[i].authorName + '</option>'

            }
            $('.author').append(author);
        }
    });
    //load publisher
    $('.publisher').empty()
    $.ajax({
        url: "http://localhost:8080/api/publishers/search/findPublishersBy",
        success: function (data) {
            var publishers = data._embedded.publishers
            var publisher = ''
            for (var i = 0; i < publishers.length; i++) {
                if (i === 0)
                    publisher += '<option selected>' + publishers[i].publisherName + '</option>'
                else
                    publisher += '<option>' + publishers[i].publisherName + '</option>'

            }
            $('.publisher').append(publisher);
        }
    });
    //load supplier
    $('.supplier').empty()
    $.ajax({
        url: "http://localhost:8080/api/suppliers/search/findSuppliersBy",
        success: function (data) {
            var suppliers = data._embedded.suppliers
            var supplier = ''
            for (var i = 0; i < suppliers.length; i++) {
                if (i === 0)
                    supplier += '<option selected>' + suppliers[i].supplierName + '</option>'
                else
                    supplier += '<option>' + suppliers[i].supplierName + '</option>'

            }
            $('.supplier').append(supplier);
        }
    });
}

function deleteBook(bookTitle) {
    $.ajax({
        url: "http://localhost:8080/books/deleteBook",
        data: {
            bookTitle: bookTitle
        },
        success: function (data) {
            alert(data);
            $('#tableProduct').empty();
            loadProduct(0)
        },
        error: function (data) {
            alert("title does't exist!!");
        }
    });
}

function loadValueModal(title) {
    $('.modal-title').html("Edit book");
    $('#submitModal').html('Edit')
    $('#bookTitle').prop('disabled', true);
    $.ajax({
        url: "http://localhost:8080/api/books/search/findBookByBookTitleIgnoreCase?bookTitle=" + title,
        async: false,
        success: function (data) {
            var bookTitle = $('#bookTitle').val(data.bookTitle)
            var bookDescription = $('#bookDescription').val(data.bookDescription)
            var bookPrice = $('#bookPrice').val(data.bookPrice)
            var bookDiscount = $('#bookDiscount').val(data.bookDiscount)

            var bookWeight = $('#bookWeight').val(data.bookWeight)
            var bookInventory = $('#bookInventory').val(data.bookInventory)
            var bookSize = data.bookSize
            console.log(bookSize)
            $('.bookSize option:contains("' + bookSize + '")').prop('selected', true);

            var bookStatus = data.bookStatus
            $('.bookStatus option:contains("' + bookStatus + '")').prop('selected', true);
            var categoryN = ''
            $.ajax({
                url: data._links.category.href,
                async: false,
                success: function (data) {
                    categoryN += data.categoryName
                    console.log(categoryN)
                }
            })
            $('.category option:contains("' + categoryN + '")').prop('selected', true);
            var publisherN = ''
            $.ajax({
                url: data._links.publisher.href,
                async: false,
                success: function (data) {
                    publisherN += data.publisherName
                }
            })
            $('.publisher option:contains("' + publisherN + '")').prop('selected', true);
            var authorN = ''
            $.ajax({
                url: data._links.author.href,
                async: false,
                success: function (data) {
                    authorN += data.authorName
                }
            })
            $('.author option:contains("' + authorN + '")').prop('selected', true);
            var supplierN = ''
            $.ajax({
                url: data._links.supplier.href,
                async: false,
                success: function (data) {
                    supplierN += data.supplierName
                }
            })
            $('.supplier option:contains("' + supplierN + '")').prop('selected', true);
        }
    });

}

function editProduct() {
    let bookTitle = $('#bookTitle').val()
    bookTitle = bookTitle.trim()
    let bookSlug = bookTitle.replace(/\s+/g, "-")
    let bookDescription = $('#bookDescription').val()
    let bookPrice = $('#bookPrice').val()
    let bookDiscount = $('#bookDiscount').val()
    let bookSize = $('.bookSize option:selected').text()
    let bookStatus = $('.bookStatus option:selected').text()
    let bookWeight = $('#bookWeight').val()
    let bookInventory = $('#bookInventory').val()
    let bookImage = $('#bookImage').val()
    bookImage = '../imgs/static/' + bookImage
    console.log(bookImage)
    let categoryN = $('.category option:selected').text()
    let publisherN = $('.publisher option:selected').text()
    let authorN = $('.author option:selected').text()
    let supplierN = $('.supplier option:selected').text()

    var bookAdd = {
        bookPrice: bookPrice,
        bookTitle: bookTitle,
        bookDiscount: bookDiscount,
        bookDescription: bookDescription,
        bookSize: bookSize,
        bookWeight: bookWeight,
        bookType: categoryN,
        bookInventory: bookInventory,
        bookLanguage: 'English',
        bookStatus: bookStatus,
        bookSlug: bookSlug,
        bookImage: bookImage,
        category: {
            categoryName: categoryN
        },
        publisher: {
            publisherName: publisherN
        },
        author: {
            authorName: authorN
        },
        supplier: {
            supplierName: supplierN
        }
    }
    console.log(bookAdd)
    $.ajax({
        url: "http://localhost:8080/books/updateBook",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(bookAdd),
        success: function (data) {
            alert(data);
            $('#modalProduct').modal('hide');
            $('#tableProduct').empty();
            loadProduct(0)
        },
        error: function (data) {
            alert(data);
        }
    });
}

function setModalAdd() {
    loadDataModal()
    $('#bookTitle').prop('disabled', false);
    $('#bookTitle').val('')
    $('#bookDescription').val('')
    $('#bookPrice').val('')
    $('#bookDiscount').val('')
    $('#bookWeight').val('')
    $('#bookInventory').val('')
}

function verifyRole() {
    let role = localStorage.getItem("roleN");
    if (role != 'Admin') {
        window.location.href = "/error"
    }
} 

$(document).ready(function () {
    verifyRole()

    $("#btnRefresh").click(function () {
        $("#txtSearch").val('')
        $('#tableProduct').empty();
        loadProduct(0)
    })

    $("#btnAdd").click(function () {
        setModalAdd()
    })

    $(".searchProduct").click(function () {
        var title = $("#txtSearch").val().trim()
        $('#tableProduct').empty();
        searchBookByTitle(title)
    })
    loadProduct(0)
    //paganition
    loadPaganition()
    // load dataModal
    loadDataModal()
    //addBook
    $("#submitModal").click(function () {
        if ($(this).text() === 'Add')
            addProduct()
        else {
            editProduct()
        }
    });
    $("#closeModal, .btn-close").click(function () {
        $('.modal-title').html("Add book")
        $('#submitModal').html('Add')
    });

    //deleteBook
    $('#tableProduct').on('click', '#deleteBook', function () {
        let row = $(this).closest('tr');
        // Lấy giá trị email trong ô thứ hai của hàng đó
        let bookTitle = row.find('td:eq(0)').text();
        // Hiển thị giá trị email
        deleteBook(bookTitle)
    });
    //editBook
    $('#tableProduct').on('click', '#editBook', function () {
        let row = $(this).closest('tr');
        // Lấy giá trị email trong ô thứ hai của hàng đó
        let bookTitle = row.find('td:eq(0)').text();
        // Hiển thị giá trị email
        loadValueModal(bookTitle)
    });
});
