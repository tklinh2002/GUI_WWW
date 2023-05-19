async function loadAuthor(page) {
    $.ajax({
        url: "http://localhost:8080/api/authors/search/find10Authors",
        data: {
            offset: page
        },
        success: function (data) {
            var authors = data._embedded.authors;
            // Render table
            for (var i = 0; i < authors.length; i++) {
                var table = '';
                table += '<tr>'

                table += '<td>' + authors[i].authorName + '</td>'
                var authorId = authors[i]._links.self.href.substring(authors[i]._links.self.href.lastIndexOf("/") + 1);
                $.ajax({
                    url: "http://localhost:8080/api/books/search/countAuthorBook",
                    data: {
                        authorId: authorId
                    },
                    async: false,
                    success: function (data) {
                        table += '<td>' + data + '</td>'
                    }
                });
                table += '<td><button type="button " class="btn btn-outline-warning" id ="editAuthor" data-bs-toggle="modal" data-bs-target="#modalAuthor"><i class="fas fa-edit"></i></button>'
                table += '<button type="button " class="btn btn-outline-danger " id ="deleteAuthor"><i class="fas fa-trash-alt"></i></button>'
                table += '</td>'
                table += ' </tr>'
                $('#tableAuthor').append(table);
            }
        }
    });
}

function searchAuthorByName(name, offset) {
    $.ajax({
        url: "http://localhost:8080/api/authors/search/search10AuthorByName",
        data: {
            authorName: name,
            offset: offset
        },
        success: function (data) {
            var authors = data._embedded.authors;
            // Render table
            for (var i = 0; i < authors.length; i++) {
                var table = '';
                table += '<tr>'

                table += '<td>' + authors[i].authorName + '</td>'
                var authorId = authors[i]._links.self.href.substring(authors[i]._links.self.href.lastIndexOf("/") + 1);
                $.ajax({
                    url: "http://localhost:8080/api/books/search/countAuthorBook",
                    data: {
                        authorId: authorId
                    },
                    async: false,
                    success: function (data) {
                        table += '<td>' + data + '</td>'
                    }
                });
                table += '<td><button type="button " class="btn btn-outline-warning" id ="editAuthor" data-bs-toggle="modal" data-bs-target="#modalAuthor"><i class="fas fa-edit"></i></button>'
                table += '<button type="button " class="btn btn-outline-danger " id ="deleteAuthor"><i class="fas fa-trash-alt"></i></button>'
                table += '</td>'
                table += ' </tr>'
                $('#tableAuthor').append(table);
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
        url: "http://localhost:8080/api/authors/search/countAuthorsBy",
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
        $('#tableAuthor').empty();
        loadAuthor((page - 1) * 10)
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

function addAuthor() {
    var authorName = $('#authorName').val()

    var authorAdd = {
        authorName: authorName
    }
    $.ajax({
        url: "http://localhost:8080/authors/addAuthor",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(authorAdd),
        success: function (data) {
            alert(data);
            $('#modalAuthor').modal('hide');
            $('#tableAuthor').empty();
            loadAuthor(0);
        },
        error: function (data) {
            alert(data);
        }
    });

}

function deleteAuthor(name) {
    $.ajax({
        url: "http://localhost:8080/authors/deleteAuthor",
        data: {
            authorName: name
        },
        success: function (data) {
            alert(data);
            $('#tableAuthor').empty();
            loadAuthor(0);
        },
        error: function (data) {
            alert(name + " does't exist!!");
        }
    });
}

function loadValueModal(name) {
    $('.modal-title').html("Edit author");
    $('#submitModal').html('Edit')
    $('#authorName').val(name)
}

function editAuthor(name) {
    var authorName = $('#authorName').val()
    authorName = authorName.trim()
    var authorId = ''
    console.log(name)
    $.ajax({
        url: "http://localhost:8080/api/authors/search/findAuthorByAuthorNameIgnoreCase?authorName=" + name,
        async: false,
        success: function (data) {
            authorId += data._links.self.href.substring(data._links.self.href.lastIndexOf("/") + 1);
            console.log(data._links.self.href)
            console.log(authorId)
        },
        error: function (data) {
            console.log(data)
        }
    });
    var author = {
        authorId: authorId,
        authorName: authorName
    }
    $.ajax({
        url: "http://localhost:8080/authors/updateAuthor",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(author),
        success: function (data) {
            alert(data);
            $('#modalAuthor').modal('hide');
            $('#tableAuthor').empty();
            loadAuthor(0);
        },
        error: function (data) {
            alert(data);
        }
    });
}

function setModalAdd() {

    $("#authorName").val('')
}

function verifyRole() {
    let role = localStorage.getItem("roleN");
    if (role != 'Admin') {
        window.location.href = "/error"
    }
} 

$(document).ready(function () {
    verifyRole();

    $("#btnRefresh").click(function () {
        $("#txtSearch").val('')
        $('#tableAuthor').empty();
        loadAuthor(0)
    })

    $("#btnAdd").click(function () {
        setModalAdd()
    })

    $(".searchAuthor").click(function () {
        var name = $("#txtSearch").val().trim()
        $('#tableAuthor').empty();
        searchAuthorByName(name, 0)
    })
    loadAuthor(0)
    //paganition
    loadPaganition()
    //add
    $("#submitModal").click(function () {
        if ($(this).text() === 'Add')
            addAuthor()
        else {
            var name = localStorage.getItem('name')
            editAuthor(name)
        }
    });
    $("#closeModal, .btn-close").click(function () {
        $('.modal-title').html("Add author")
        $('#submitModal').html('Add')
    });

    //delete
    $('#tableAuthor').on('click', '#deleteAuthor', function () {
        let row = $(this).closest('tr');
        // Lấy giá trị email trong ô thứ hai của hàng đó
        let name = row.find('td:eq(0)').text();
        // Hiển thị giá trị email
        deleteAuthor(name)
    });
    //edit
    $('#tableAuthor').on('click', '#editAuthor', function () {
        $('.modal-title').html("Edit author")
        $('#submitModal').html('Edit')
        let row = $(this).closest('tr');
        // Lấy giá trị email trong ô thứ hai của hàng đó
        let name = row.find('td:eq(0)').text();
        // Hiển thị giá trị email
        $("#authorName").val(name)
        localStorage.setItem('name', name)
    });

});
