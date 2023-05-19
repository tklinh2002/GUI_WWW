function loadOrder(page) {
    $.ajax({
        url: "http://localhost:8080/api/order_s/search/find10Order",
        data: {
            offset: page
        },
        async: false,
        success: function (data) {
            var orders = data._embedded.order_s;
            // Render table
            for (var i = 0; i < orders.length; i++) {
                var table = '';
                table += '<tr>'
                var orderId = orders[i]._links.self.href.substring(orders[i]._links.self.href.lastIndexOf("/") + 1);
                table += '<td>' + orderId + '</td>'
                $.ajax({
                    url: orders[i]._links.user_.href,
                    async: false,
                    success: function (data) {
                        table += '<td>' + data.userPhoneNumber + '</td>'
                    }
                })
                let dateString = orders[i].orderDate;
                let date = new Date(dateString);
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                let formattedDate = (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + '/' + year;
                table += '<td>' + formattedDate + '</td>'
                table += '<td>' + orders[i].orderStatus + '</td>'
                table += '<td><button type="button " class="btn btn-outline-warning btnDetail" data-bs-toggle="modal" data-bs-target="#modalOrder">Detail</button>'
                table += '</td>'
                table += '</tr>'
                $('#tableOrder').append(table);
            }
        }
    });
}

function searchOrderByPhone(phoneNumbers) {
    var regex = new RegExp('.*' + phoneNumbers + '.*');
    var orderList = [];
    $('#tableOrder tr').each(function (row, tr) {
        var phoneNumber = $(tr).find('td:eq(1)').text();
        var orderId = $(tr).find('td:eq(0)').text();
        if (regex.test(phoneNumber) == true)
            orderList.push({ 'phoneNumber': phoneNumber, 'orderId': orderId });
    });
    //delete table
    $('#tableOrder').empty()
    //add table
    for (var i = 0; i < orderList.length; i++) {
        $.ajax({
            url: "http://localhost:8080/api/order_s/search/findOrder_ByOrderId",
            data: {
                orderId: orderList[i].orderId
            },
            async: false,
            success: function (data) {
                var table = '';
                table += '<tr>'
                table += '<td>' + orderList[i].orderId + '</td>'
                table += '<td>' + orderList[i].phoneNumber + '</td>'
                let dateString = data.orderDate;
                let date = new Date(dateString);
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                let formattedDate = (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + '/' + year;
                table += '<td>' + formattedDate + '</td>'
                table += '<td>' + data.orderStatus + '</td>'
                table += '<td><button type="button " class="btn btn-outline-warning btnDetail" data-bs-toggle="modal" data-bs-target="#modalOrder">Detail</button>'
                table += '</td>'
                table += '</tr>'
                $('#tableOrder').append(table);
            }
        })
    }

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
        url: "http://localhost:8080/api/order_s/search/countOrder_By",
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
        $('#tableOrder').empty();
        loadOrder((page - 1) * 10)
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


function loadValueModal(order) {
    $('#tableOrderDetail').empty()
    console.log(order)
    $('.modal-title').html('Order detail ' + order.orderId);
    $.ajax({
        url: "http://localhost:8080/api/user_s/search/findUser_ByUserPhoneNumber?phoneNumber=" + order.phoneNumber,
        async: false,
        success: function (date) {
            $('.userCustomer').html(data.userName);
        }
    })

    $('.dateCreate').html('Date: ' + order.date);
    $.ajax({
        url: "http://localhost:8080/api/orderDetails/search/findOrderDetailsByOrderId?orderId=" + order.orderId,
        async: false,
        success: function (data) {
            var orderDetails = data._embedded.orderDetails
            for (var i = 0; i < orderDetails.length; i++) {
                var table = ''

                table += '<tr>'
                const url = orderDetails[i]._links.self.href;
                const regex = /bookId=(\w+)/;
                const match = url.match(regex);
                const bookId = match[1];
                $.ajax({
                    url: "http://localhost:8080/api/books/search/findBookByBookId?bookId=" + bookId,
                    async: false,
                    success: function (data) {
                        table += '<td>' + data.bookTitle + '</td>'
                    }
                })
                table += ' <td>' + orderDetails[i].price + '</td>'
                table += '<td>' + orderDetails[i].quantity + '</td>'
                table += '<td>' + orderDetails[i].price * orderDetails[i].quantity + '</td>'
                table += ' </tr>'
                $('#tableOrderDetail').append(table)
            }
        }
    });


    var total = 0
    $('#tableOrderDetail tr').each(function (row, tr) {
        var value = $(tr).find('td:eq(3)').text();
        total += parseFloat(value)
    });
    $('#totalOrder').html('Total Order: ' + total.toFixed(2))

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
        $('#tableOrder').empty();
        loadOrder(0)
    })

    $(".searchOrder").click(function () {
        var phone = $("#txtSearch").val().trim()
        if (phone === '') {
            $('#tableOrder').empty()
            loadOrder(0)
        } else {
            $('#tableOrder').empty()
            loadOrder(0)
            searchOrderByPhone(phone)
        }

    })
    loadOrder(0)
    //paganition
    loadPaganition()
    // load dataModal
    // loadDataModal()

    $('#tableOrder').on('click', '.btnDetail', function () {
        console.log("toi day")
        let row = $(this).closest('tr');
        var phoneNumber = row.find('td:eq(1)').text();
        var orderId = row.find('td:eq(0)').text();
        var date = row.find('td:eq(2)').text();
        var order = { 'orderId': orderId, 'phoneNumber': phoneNumber, 'date': date }
        // Hiển thị giá trị email
        console.log("toi day")
        loadValueModal(order)
        
    });
});
