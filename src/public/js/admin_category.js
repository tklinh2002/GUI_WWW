async function loadCategory(page) {
    $.ajax({
        url: "http://localhost:8080/api/categories/search/find10Categories",
        data: {
            offset: page
        },
        success: function (data) {
            var categories = data._embedded.categories;
            // Render table
            for (var i = 0; i < categories.length; i++) {
                var table = '';
                table += '<tr>'

                table += '<td>' + categories[i].categoryName + '</td>'
                var categoryId = categories[i]._links.self.href.substring(categories[i]._links.self.href.lastIndexOf("/") + 1);
                $.ajax({
                    url: "http://localhost:8080/api/books/search/countBookInCategory",
                    data: {
                        categoryId: categoryId
                    },
                    async: false,
                    success: function (data) {
                        table += '<td>' + data + '</td>'
                    }
                });
                table += '<td><button type="button " class="btn btn-outline-secondary" id ="editCategory" data-bs-toggle="modal" data-bs-target="#modalCategory"><i class="fas fa-edit"></i></button>'
                table += '<button type="button " class="btn btn-outline-danger " id ="deleteCategory"><i class="fas fa-trash-alt"></i></button>'
                table += '</td>'
                table += ' </tr>'
                $('#tableCategory').append(table);
            }
        }
    });
}

function searchCategoryByName(name, offset) {
    $.ajax({
        url: "http://localhost:8080/api/categories/search/searchCategoriesByCategoryName",
        data: {
            categoryName: name,
            offset: offset
        },
        success: function (data) {
            var categories = data._embedded.categories;
            // Render table
            for (var i = 0; i < categories.length; i++) {
                var table = '';
                table += '<tr>'

                table += '<td>' + categories[i].categoryName + '</td>'
                var categoryId = categories[i]._links.self.href.substring(categories[i]._links.self.href.lastIndexOf("/") + 1);
                $.ajax({
                    url: "http://localhost:8080/api/books/search/countBookInCategory",
                    data: {
                        categoryId: categoryId
                    },
                    async: false,
                    success: function (data) {
                        table += '<td>' + data + '</td>'
                    }
                });
                table += '<td><button type="button " class="btn btn-outline-secondary" id ="editCategory" data-bs-toggle="modal" data-bs-target="#modalCategory"><i class="fas fa-edit"></i></button>'
                table += '<button type="button " class="btn btn-outline-danger " id ="deleteCategory"><i class="fas fa-trash-alt"></i></button>'
                table += '</td>'
                table += ' </tr>'
                $('#tableCategory').append(table);
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
        url: "http://localhost:8080/api/categories/search/countCategoriesBy",
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
        $('#tableCategory').empty();
        loadCategory((page - 1) * 10)
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

function addCategory() {
    var categoryName = $('#categoryName').val()

    var categoryAdd = {
        categoryName: categoryName
    }
    $.ajax({
        url: "http://localhost:8080/categories/addCategory",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(categoryAdd),
        success: function (data) {
            alert(data);
            $('#modalCategory').modal('hide');
            $('#tableCategory').empty();
            loadCategory(0)
        },
        error: function (data) {
            alert(data);
        }
    });

}

function deleteCategory(name) {
    $.ajax({
        url: "http://localhost:8080/categories/deleteCategory",
        data: {
            categoryName: name
        },
        success: function (data) {
            alert(data);
            $('#tableCategory').empty();
            loadCategory(0)
        },
        error: function (data) {
            alert(name + " does't exist!!");
        }
    });
}

function loadValueModal(name) {
    $('.modal-title').html("Edit category");
    $('#submitModal').html('Edit')
    $('#categoryName').val(name)
}

function editCategory(name) {
    var categoryName = $('#categoryName').val()
    categoryName = categoryName.trim()
    var categoryId = ''
    console.log(name)
    $.ajax({
        url: "http://localhost:8080/api/categories/search/findCategoryByCategoryNameIgnoreCase?name=" + name,
        async: false,
        success: function (data) {
            categoryId += data._links.self.href.substring(data._links.self.href.lastIndexOf("/") + 1);
            console.log(data._links.self.href)
            console.log(categoryId)
        },
        error: function (data) {
            console.log(data)
        }
    });
    var category = {
        categoryId: categoryId,
        categoryName: categoryName
    }
    $.ajax({
        url: "http://localhost:8080/categories/updateCategory",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(category),
        success: function (data) {
            alert(data);
            $('#modalCategory').modal('hide');
            $('#tableCategory').empty();
            loadCategory(0)
        },
        error: function (data) {
            alert(data);
        }
    });
}

function setModalAdd() {

    $("#categoryName").val('')
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
        $('#tableCategory').empty();
        loadCategory(0)
    })

    $("#btnAdd").click(function () {
        setModalAdd()
    })

    $(".searchCategory").click(function () {
        var name = $("#txtSearch").val().trim()
        $('#tableCategory').empty();
        searchCategoryByName(name, 0)
    })
    loadCategory(0)
    //paganition
    loadPaganition()
    //add
    $("#submitModal").click(function () {
        if ($(this).text() === 'Add') {
            addCategory()
        } else {
            var name = localStorage.getItem('name')
            editCategory(name)
        }
    });
    $("#closeModal, .btn-close").click(function () {
        $('.modal-title').html("Add catagory")
        $('#submitModal').html('Add')
    });

    //delete
    $('#tableCategory').on('click', '#deleteCategory', function () {
        let row = $(this).closest('tr');
        // Lấy giá trị email trong ô thứ hai của hàng đó
        let name = row.find('td:eq(0)').text();
        // Hiển thị giá trị email
        deleteCategory(name)
    });
    //edit
    $('#tableCategory').on('click', '#editCategory', function () {
        $('.modal-title').html("Edit catagory")
        $('#submitModal').html('Edit')
        let row = $(this).closest('tr');
        // Lấy giá trị email trong ô thứ hai của hàng đó
        let name = row.find('td:eq(0)').text();
        // Hiển thị giá trị email
        $("#categoryName").val(name)
        localStorage.setItem('name', name)
    });
});
