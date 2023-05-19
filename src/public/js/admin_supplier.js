async function loadSupplier(page) {
    $.ajax({
        url: "http://localhost:8080/api/suppliers/search/find10Suppliers",
        data: {
            offset: page
        },
        success: function (data) {
            var suppliers = data._embedded.suppliers;
            // Render table
            for (var i = 0; i < suppliers.length; i++) {
                var table = '';
                table += '<tr>'

                table += '<td>' + suppliers[i].supplierName + '</td>'
                var supplierId = suppliers[i]._links.self.href.substring(suppliers[i]._links.self.href.lastIndexOf("/") + 1);
                $.ajax({
                    url: "http://localhost:8080/api/books/search/countSupplierBook",
                    data: {
                        supplierId: supplierId
                    },
                    async: false,
                    success: function (data) {
                        table += '<td>' + data + '</td>'
                    }
                });
                table += '<td><button type="button " class="btn btn-outline-warning" id ="editSupplier" data-bs-toggle="modal" data-bs-target="#modalSupplier"><i class="fas fa-edit"></i></button>'
                table += '<button type="button " class="btn btn-outline-danger " id ="deleteSupplier"><i class="fas fa-trash-alt"></i></button>'
                table += '</td>'
                table += ' </tr>'
                $('#tableSupplier').append(table);
            }
        }
    });
}

function searchSupplierByName(name, offset) {
    $.ajax({
        url: "http://localhost:8080/api/suppliers/search/search10SupplierByName",
        data: {
            supplierName: name,
            offset: offset
        },
        success: function (data) {
            var suppliers = data._embedded.suppliers;
            // Render table
            for (var i = 0; i < suppliers.length; i++) {
                var table = '';
                table += '<tr>'

                table += '<td>' + suppliers[i].supplierName + '</td>'
                var supplierId = suppliers[i]._links.self.href.substring(suppliers[i]._links.self.href.lastIndexOf("/") + 1);
                $.ajax({
                    url: "http://localhost:8080/api/books/search/countSupplierBook",
                    data: {
                        supplierId: supplierId
                    },
                    async: false,
                    success: function (data) {
                        table += '<td>' + data + '</td>'
                    }
                });
                table += '<td><button type="button " class="btn btn-outline-warning" id ="editSupplier" data-bs-toggle="modal" data-bs-target="#modalSupplier"><i class="fas fa-edit"></i></button>'
                table += '<button type="button " class="btn btn-outline-danger " id ="deleteSupplier"><i class="fas fa-trash-alt"></i></button>'
                table += '</td>'
                table += ' </tr>'
                $('#tableSupplier').append(table);
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
        url: "http://localhost:8080/api/suppliers/search/countSuppliersBy",
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
        $('#tableSupplier').empty();
        loadSupplier((page - 1) * 10)
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

function addSupplier() {
    var supplierName = $('#supplierName').val()

    var supplierAdd = {
        supplierName: supplierName
    }
    $.ajax({
        url: "http://localhost:8080/suppliers/addSupplier",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(supplierAdd),
        success: function (data) {
            alert(data);
            $('#modalSupplier').modal('hide');
            $('#tableSupplier').empty();
            loadSupplier(0)
        },
        error: function (data) {
            alert(data);
        }
    });

}

function deleteSupplier(name) {
    $.ajax({
        url: "http://localhost:8080/suppliers/deleteSupplier",
        data: {
            supplierName: name
        },
        success: function (data) {
            alert(data);
            $('#tableSupplier').empty();
            loadSupplier(0)
        },
        error: function (data) {
            alert(name + " does't exist!!");
        }
    });
}

function loadValueModal(name) {
    $('.modal-title').html("Edit supplier");
    $('#submitModal').html('Edit')
    $('#supplierName').val(name)
}

function editSupplier(name) {
    var supplierName = $('#supplierName').val()
    supplierName = supplierName.trim()
    var supplierId = ''
    console.log(name)
    $.ajax({
        url: "http://localhost:8080/api/suppliers/search/findSupplierBySupplierNameIgnoreCase?supplierName=" + name,
        async: false,
        success: function (data) {
            supplierId += data._links.self.href.substring(data._links.self.href.lastIndexOf("/") + 1);
            console.log(data._links.self.href)
            console.log(supplierId)
        },
        error: function (data) {
            console.log(data)
        }
    });
    var supplier = {
        supplierId: supplierId,
        supplierName: supplierName
    }
    $.ajax({
        url: "http://localhost:8080/suppliers/updateSupplier",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(supplier),
        success: function (data) {
            alert(data);
            $('#modalSupplier').modal('hide');
            $('#tableSupplier').empty();
            loadSupplier(0)
        },
        error: function (data) {
            alert(data);
        }
    });
}

function setModalAdd() {
    $("#supplierName").val('')
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
        $('#tableSupplier').empty();
        loadSupplier(0)
    })

    $("#btnAdd").click(function () {
        setModalAdd()
    })

    $(".searchSupplier").click(function () {
        var name = $("#txtSearch").val().trim()
        $('#tableSupplier').empty();
        searchSupplierByName(name, 0)
    })
    loadSupplier(0)
    //paganition
    loadPaganition()
    //add
    $("#submitModal").click(function () {
        if ($(this).text() === 'Add')
            addSupplier()
        else {
            var name = localStorage.getItem('name')
            editSupplier(name)
        }
    });
    $("#closeModal, .btn-close").click(function () {
        $('.modal-title').html("Add supplier")
        $('#submitModal').html('Add')
    });

    //delete
    $('#tableSupplier').on('click', '#deleteSupplier', function () {
        let row = $(this).closest('tr');
        // Lấy giá trị email trong ô thứ hai của hàng đó
        let name = row.find('td:eq(0)').text();
        // Hiển thị giá trị email
        deleteSupplier(name)
    });
    //edit
    $('#tableSupplier').on('click', '#editSupplier', function () {
        $('.modal-title').html("Edit supplier")
        $('#submitModal').html('Edit')
        let row = $(this).closest('tr');
        // Lấy giá trị email trong ô thứ hai của hàng đó
        let name = row.find('td:eq(0)').text();
        // Hiển thị giá trị email
        $("#supplierName").val(name)
        localStorage.setItem('name', name)
    });

});
