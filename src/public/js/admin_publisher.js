async function loadPublisher(page) {
    $.ajax({
        url: "http://localhost:8080/api/publishers/search/find10Publishers",
        data: {
            offset: page
        },
        success: function (data) {
            var publishers = data._embedded.publishers;
            // Render table
            for (var i = 0; i < publishers.length; i++) {
                var table = '';
                table += '<tr>'

                table += '<td>' + publishers[i].publisherName + '</td>'
                var publisherId = publishers[i]._links.self.href.substring(publishers[i]._links.self.href.lastIndexOf("/") + 1);
                $.ajax({
                    url: "http://localhost:8080/api/books/search/countPublisherBook",
                    data: {
                        publisherId: publisherId
                    },
                    async: false,
                    success: function (data) {
                        table += '<td>' + data + '</td>'
                    }
                });
                table += '<td><button type="button " class="btn btn-outline-warning" id ="editPublisher" data-bs-toggle="modal" data-bs-target="#modalPublisher"><i class="fas fa-edit"></i></button>'
                table += '<button type="button " class="btn btn-outline-danger " id ="deletePublisher"><i class="fas fa-trash-alt"></i></button>'
                table += '</td>'
                table += ' </tr>'
                $('#tablePublisher').append(table);
            }
        }
    });
}

function searchPublisherByName(name, offset) {
    $.ajax({
        url: "http://localhost:8080/api/publishers/search/search10PublisherByName",
        data: {
            publisherName: name,
            offset: offset
        },
        success: function (data) {
            var publishers = data._embedded.publishers;
            // Render table
            for (var i = 0; i < publishers.length; i++) {
                var table = '';
                table += '<tr>'

                table += '<td>' + publishers[i].publisherName + '</td>'
                var publisherId = publishers[i]._links.self.href.substring(publishers[i]._links.self.href.lastIndexOf("/") + 1);
                $.ajax({
                    url: "http://localhost:8080/api/books/search/countPublisherBook",
                    data: {
                        publisherId: publisherId
                    },
                    async: false,
                    success: function (data) {
                        table += '<td>' + data + '</td>'
                    }
                });
                table += '<td><button type="button " class="btn btn-outline-warning" id ="editPublisher" data-bs-toggle="modal" data-bs-target="#modalPublisher"><i class="fas fa-edit"></i></button>'
                table += '<button type="button " class="btn btn-outline-danger " id ="deletePublisher"><i class="fas fa-trash-alt"></i></button>'
                table += '</td>'
                table += ' </tr>'
                $('#tablePublisher').append(table);
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
        url: "http://localhost:8080/api/publishers/search/countPublishersBy",
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
        $('#tablePublisher').empty();
        loadPublisher((page - 1) * 10)
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

function addPublisher() {
    var publisherName = $('#publisherName').val()

    var publisherAdd = {
        publisherName: publisherName
    }
    $.ajax({
        url: "http://localhost:8080/publishers/addPublisher",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(publisherAdd),
        success: function (data) {
            alert(data);
            $('#modalPublisher').modal('hide');
            $('#tablePublisher').empty();
            loadPublisher(0)
        },
        error: function (data) {
            alert(data);
        }
    });

}

function deletePublisher(name) {
    $.ajax({
        url: "http://localhost:8080/publishers/deletePublisher",
        data: {
            publisherName: name
        },
        success: function (data) {
            alert(data);
            $('#tablePublisher').empty();
            loadPublisher(0)
        },
        error: function (data) {
            alert(name + " does't exist!!");
        }
    });
}

function loadValueModal(name) {
    $('.modal-title').html("Edit publisher");
    $('#submitModal').html('Edit')
    $('#publisherName').val(name)
}

function editPublisher(name) {
    var publisherName = $('#publisherName').val()
    publisherName = publisherName.trim()
    var publisherId = ''
    console.log(name)
    $.ajax({
        url: "http://localhost:8080/api/publishers/search/findPublisherByPublisherNameIgnoreCase?publisherName=" + name,
        async: false,
        success: function (data) {
            publisherId += data._links.self.href.substring(data._links.self.href.lastIndexOf("/") + 1);
            console.log(data._links.self.href)
            console.log(publisherId)
        },
        error: function (data) {
            console.log(data)
        }
    });
    var publisher = {
        publisherId: publisherId,
        publisherName: publisherName
    }
    $.ajax({
        url: "http://localhost:8080/publishers/updatePublisher",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(publisher),
        success: function (data) {
            alert(data);
            $('#modalPublisher').modal('hide');
            $('#tablePublisher').empty();
            loadPublisher(0)
        },
        error: function (data) {
            alert(data);
        }
    });
}

function setModalAdd() {

    $("#publisherName").val('')
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
        $('#tablePublisher').empty();
        loadPublisher(0)
    })

    $("#btnAdd").click(function () {
        setModalAdd()
    })

    $(".searchPublisher").click(function () {
        var name = $("#txtSearch").val().trim()
        $('#tablePublisher').empty();
        searchPublisherByName(name, 0)
    })
    loadPublisher(0)
    //paganition
    loadPaganition()
    //add
    $("#submitModal").click(function () {
        if ($(this).text() === 'Add')
            addPublisher()
        else {
            var name = localStorage.getItem('name')
            editPublisher(name)
        }
    });
    $("#closeModal, .btn-close").click(function () {
        $('.modal-title').html("Add publisher")
        $('#submitModal').html('Add')
    });

    //delete
    $('#tablePublisher').on('click', '#deletePublisher', function () {
        let row = $(this).closest('tr');
        // Lấy giá trị email trong ô thứ hai của hàng đó
        let name = row.find('td:eq(0)').text();
        // Hiển thị giá trị email
        deletePublisher(name)
    });
    //edit
    $('#tablePublisher').on('click', '#editPublisher', function () {
        $('.modal-title').html("Edit publisher")
        $('#submitModal').html('Edit')
        let row = $(this).closest('tr');
        // Lấy giá trị email trong ô thứ hai của hàng đó
        let name = row.find('td:eq(0)').text();
        // Hiển thị giá trị email
        $("#publisherName").val(name)
        localStorage.setItem('name', name)
    });

});
