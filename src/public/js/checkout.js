var userLogin = {};
var emailLogin = localStorage.getItem("emailLogin");
var listBook = JSON.parse(localStorage.getItem("books"));

function getUserByMail(email) {
    $.ajax({
        url: "http://localhost:8080/api/user_s/search/findUser_ByUserEmail?email=" + email,
        dataType: "json",
        success: function (data) {
            userLogin.userName = data.userName;
            userLogin.userPassword = data.userPassword;
            userLogin.userFirstName = data.userFirstName;
            userLogin.userLastName = data.userLastName;
            userLogin.userPhoneNumber = data.userPhoneNumber;
            userLogin.userEmail = data.userEmail;
            userLogin.userCreatedDate = data.userCreatedDate;
            userLogin.userUpdatedDate = data.userUpdatedDate;
            userLogin.role = {
                roleId: "R006",
                roleName: "Guest"
            }
        }
    });
}


$(document).ready(function () {
    getUserByMail(emailLogin);
    loadBooks();

    function loadBooks() {
        let listBook = JSON.parse(localStorage.getItem("books"));
        let content = "";
        let totalPrice = 0;
        let flag = true;

        content += '<div class="row mb-4 mb-md-3 border-bottom border-dark pb-3 mt-5">';
        content += '    <div class="col-md-8 col-9 fw-bold font-table-header">List Book (' + listBook.length + ' books)</div>';
        content += '    <div class="col-md-2 d-none d-md-block text-center fw-bold font-table-header">Quantity</div>';
        content += '    <div class="col-md-2 col-3 text-center fw-bold font-table-header">Total</div>';
        content += '</div>';


        for (let i = 0; i < listBook.length; i++) {
            if (listBook[i].status) {
                totalPrice += parseFloat(listBook[i].price).toFixed(2) * listBook[i].quantity;
                content += ' <div class="row mb-4 mb-md-3">';
                content += '     <div class="col-md-8 col-9">';
                content += '         <div class="row">';
                content += '             <div class="col-md-2 col-3">';
                content += '                 <a href="/product/' + listBook[i].id + '" class=""><img src="' + listBook[i].image + '" alt="Image" style="height: 15vh; width: 90%;object-fit: cover;"></a>';
                content += '             </div>';
                content += '             <div class="col d-flex flex-column justify-content-md-between justify-content-around">';
                content += '                 <b class="h6"><a href="/product/' + listBook[i].id + '" class="text-decoration-none text-dark">' + listBook[i].title + '</a></b>';
                content += '                 <div class="d-md-none d-block">';
                content += '                     <span>Quantity: ' + listBook[i].quantity + '</span>';
                content += '                 </div>';
                content += '                 <div class="text-danger h6">' + listBook[i].price + ' $</div>';
                content += '             </div>';
                content += '         </div>';
                content += '     </div>';
                content += '     <div class="col-md-2 d-none d-md-block text-center align-self-center">';
                content += '         <div class="d-flex justify-content-center">';
                content += '             <span class="mx-md-3">' + listBook[i].quantity + '</span>';
                content += '         </div>';
                content += '     </div>';
                content += '     <div class="col-md-2 col-3 text-center align-self-center text-danger h6">' + (parseFloat(listBook[i].price).toFixed(2) * listBook[i].quantity) + ' $</div>';
                content += ' </div>';
            }
        }
        content += '<div class="d-flex justify-content-end"><div class="h5"><span>Total Price Selected Book: </span><span class="text-danger" id="total-price">' + totalPrice.toFixed(2) + '</span><span class="text-danger"> $</span></div></div>';
        localStorage.setItem("totalPriceInCart", totalPrice.toFixed(2));
        $("#list_product").append(content);
        if (flag) {
            $("#checkAllBook").prop('checked', true);
        }
    }

    const host = "https://provinces.open-api.vn/api/";

    function callAPI(api) {
        $.ajax({
            url: api,
            dataType: "json",
            method: 'get',
            success: function (data) {
                for (let i = 0; i < data.length; i++) {
                    $('#txtProvinceOrder').append($('<option>', { value: data[i].code, text: data[i].name }));
                }
            }
        })
    }

    callAPI(host);

    function callApiDistrict(api) {
        $.ajax({
            url: api,
            dataType: "json",
            method: 'get',
            success: function (data) {
                data = data.districts
                for (let i = 0; i < data.length; i++) {
                    $('#txtDistrictOrder').append($('<option>', { value: data[i].code, text: data[i].name }));
                }
            }
        })
    }

    function callApiWard(api) {
        $.ajax({
            url: api,
            dataType: "json",
            method: 'get',
            success: function (data) {
                data = data.wards
                for (let i = 0; i < data.length; i++) {
                    $('#txtWardOrder').append($('<option>', { value: data[i].code, text: data[i].name }));
                }
            }
        })
    }


    $("#txtProvinceOrder").on("change", function () {
        callApiDistrict(host + "p/" + $("#txtProvinceOrder").val() + "?depth=2");
    });

    $("#txtDistrictOrder").on("change", function () {
        callApiWard(host + "d/" + $("#txtDistrictOrder").val() + "?depth=2");
    });



    $("#btnConfirmPay").click(function () {
        let province = $("#txtProvinceOrder").find(":selected").text();
        let district = $("#txtDistrictOrder").find(":selected").text();
        let ward = $("#txtWardOrder").find(":selected").text();
        let address = $("#txtAddressOrder").val();
        let note = $("#txtNoteOrder").val();
        address = address + ", " + ward + ", " + district + ", " + province;

        console.log(province)
        console.log(district)
        console.log(ward)
        console.log(address)
        console.log(note);
        let orderId = "";

        var order = {
            orderDate: new Date(),
            shippingAddress: address,
            orderNote: note,
            orderDiscount: "0%",
            orderStatus: "Processing",
            user_: userLogin
        };
        localStorage.setItem("order", JSON.stringify(order));
        $.ajax({
            url: "http://localhost:8080/api/order_s/add",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(order),
            success: function (data) {
                console.log(data);
                orderId += data;
                localStorage.setItem("orderIdTemp", JSON.stringify(orderId));
            }
        });

        let listBook = JSON.parse(localStorage.getItem("books"));
        // save order details
        for (var i = 0; i < listBook.length; i++) {
            if (listBook[i].status) {
                console.log(typeof listBook[i].quantity)
                console.log(typeof parseFloat(listBook[i]))
                console.log(typeof listBook[i].title)
                console.log(localStorage.getItem("orderIdTemp"))
                $.ajax({
                    url: "http://localhost:8080/api/orderDetails/add?price=" + parseFloat(listBook[i].price)
                        + "&quantity=" + parseInt(listBook[i].quantity)
                        + "&orderId=" + localStorage.getItem("orderIdTemp")
                        + "&bookId=" + listBook[i].id,
                    method: "GET",
                    contentType: "application/json",
                    success: function (data) {
                        listBook.splice(i, 1);
                    },
                    error: function(error) {
                        console.log(error);
                    }
                });

                // Remove the book from the list of books
                
            }
        }

        localStorage.setItem("books", JSON.stringify(listBook));
        alert("Payment Success!");

        // send mail
        $.get("http://localhost:8080/api/user_s/mail?email=" + emailLogin + "&text=Thanks+for+buy+book!+You+can+check+your+order+at+Leaf+Book+page");
        window.location.href = '/cart';
    });
});
