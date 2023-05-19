$(document).ready(function () {
    var ordersOfUser = [];
    var user = {};

    async function getUserInfo() {
        var userEmail = localStorage.getItem("emailLogin");
        await $.ajax({
            url: "http://localhost:8080/api/user_s/search/findUser_ByUserEmail?email=" + userEmail,
            type: "GET",
            dataType: "json",
            success: function (data) {
                console.log(data);
                user.name = data.userFirstName + " " + data.userLastName;
                user.phone = data.userPhoneNumber;
            },
            error: function (err) {
                // alert("Error: " + err.responseText);
                alert("Please login to view order history")
            }
        });
    }

    async function getOrders() {
        var userEmail = localStorage.getItem("emailLogin");
        await $.ajax({
            url: "http://localhost:8080/api/order_s/search/findOrdersByUserEmail?userEmail=" + userEmail,
            type: "GET",
            dataType: "json",
            success: function (data) {
                ordersOfUser = data._embedded.order_s;
                // sort orders by order date
                ordersOfUser.sort(function (a, b) {
                    return new Date(b.orderDate) - new Date(a.orderDate);
                });
                var html = "";
                var count = 1;
                if (ordersOfUser.length == 0) {
                    $("#notifyEmpty").append('<h4 class="text-center">History empty</h4><div class="d-flex justify-content-center"><a class="btn btn-success" href="/">Go home</a></div>');
                    return;
                }
                $.each(ordersOfUser, function (key, item) {
                    console.log(key)
                    console.log(item)
                    let id = item._links.self.href;
                    html += "<tr>";
                    html += "<td>" + count + "</td>";
                    html += "<td>" + user.phone + "</td>";
                    html += "<td>" + user.name + "</td>";
                    var orderDate = new Date(item.orderDate);
                    html += "<td>" + orderDate.toString().substr(0, 24) + "</td>";
                    html += "<td>" + "Paid" + "</td>";
                    html += "<td>" + item.orderStatus + "</td>";
                    html +=
                        "<td><a href='/order/history?id=" + id.substring(id.lastIndexOf('/')+1) + "'=><img src='../imgs/static/address-icon.png' height='50px'></a></td>";
                    html += "</tr>";
                    count++;
                });
                $("tbody").append(html);
            },
            error: function (err) {
                alert("Error: " + err.responseText);
            }
        });
    }

    getUserInfo();
    setTimeout(function(){
        getOrders();
    }, 1000); 
});
