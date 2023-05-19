function addToCart(id, event) {
    event.preventDefault();
    $.ajax({
        url: "http://localhost:8080/api/books/" + id,
        dataType: "json",
        success: function (data) {
            let quantity = 1;
            let book = {
                id: id,
                title: data.bookTitle,
                price: (data.bookPrice * ((100 - data.bookDiscount) / 100 )).toFixed(2),
                image: data.bookImage,
                quantity: quantity,
                status: false
            };
            let listBook = [];
            listBook.push(book);
            if (localStorage.getItem('books') == null) {
                localStorage.setItem('books', JSON.stringify(listBook));
            } else {
                let listBook = JSON.parse(localStorage.getItem('books'));
                let flag = false;
                for (let i = 0; i < listBook.length; i++) {
                    if (listBook[i].title == data.bookTitle) {
                        listBook[i].quantity += 1;
                        flag = true;
                    }
                }
                if (flag == false) {
                    listBook.push(book);
                }
                localStorage.setItem('books', JSON.stringify(listBook));
            }
            window.location.href = '/cart'
        }
    });
}

function addToCartWithQuantity(id, event) {
    event.preventDefault();
    $.ajax({
        url: "http://localhost:8080/api/books/" + id,
        dataType: "json",
        success: function (data) {
            let quantity = $("#quantity").val();
            quantity = parseInt(quantity);
            let book = {
                id: id,
                title: data.bookTitle,
                price: (data.bookPrice * ((100 - data.bookDiscount) / 100 )).toFixed(2),
                image: data.bookImage,
                quantity: quantity,
                status: false
            };
            let listBook = [];
            listBook.push(book);
            if (localStorage.getItem('books') == null) {
                localStorage.setItem('books', JSON.stringify(listBook));
            } else {
                let listBook = JSON.parse(localStorage.getItem('books'));
                let flag = false;
                for (let i = 0; i < listBook.length; i++) {
                    if (listBook[i].title == data.bookTitle) {
                        listBook[i].quantity += quantity;
                        flag = true;
                    }
                }
                if (flag == false) {
                    listBook.push(book);
                }
                localStorage.setItem('books', JSON.stringify(listBook));
            }
            window.location.href = '/cart'
        }
    });
}

function cartQuantity() {
    $('#cart-quantity').text(JSON.parse(localStorage.getItem('books')).length);
}

function checkRole() {
    let role = localStorage.getItem('roleN');
    if (role == 'Admin') {
        $("#admin").removeAttr("hidden");
    }
}

$(document).ready(function () {
    cartQuantity();
    checkRole();

    function checkLogin() {
        if (localStorage.getItem("emailLogin") != null) {
            $("#btnLogin").hide();
            $("#btnLogout").removeAttr("hidden");
            $("#hiUser").removeAttr("hidden");
            $.ajax({
                url: "http://localhost:8080/api/user_s/search/findUser_ByUserEmail?email=" + localStorage.getItem("emailLogin"),
                success: function (data) {
                    $("#hiUser").text("Hi, " + data.userFirstName + " " + data.userLastName);
                }
            });
            return true;
        }
        return false;
    }

    checkLogin();

    $("#btnLogout").click(function () {
        localStorage.removeItem("emailLogin");
        localStorage.removeItem('roleN')
        $("#btnLogout").hide();
        $("#btnLogin").removeAttr("hidden");
        $("#hiUser").hide();
    });


    $("#btnSubmitLogin").click(function () {
        var email = $("#txtEmailLogin").val();
        var pass = $("#txtPassLogin").val();
        var regexEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        console.log(email)

        if (regexEmail.test(email) == false) {
            $("#errLogin").text("Invalid Email");
            return false;
        } else if (pass.length < 8) {
            $("#errLogin").text("Invalid Password");
            return false;
        } else {
            $.ajax({
                url: "http://localhost:8080/api/user_s/search/findUser_ByUserEmail?email=" + email,
                error: function () {
                    $("#errLogin").text("Email Not Found");
                },
                success: function (data) {

                    let pwd = data.userPassword.slice(0, -10);
                    let salt = data.userPassword.slice(-10, data.userPassword.length)
                    console.log(salt)
                    console.log(pwd)
                    console.log(pass)

                    // split hash
                    $.ajax({
                        url: "http://localhost:8080/api/user_s/verifyPassword?hash=" + pwd + "&password=" + pass.trim() + "&salt=" + salt,
                        error: function () {
                            $("#errLogin").text("Email Not Found");
                        },
                        success: function (result) {
                            if (result) {
                                $("#errLogin").text("");
                                $("#btnLogin").hide();
                                // $("#btnSubmitLoginClose").click();
                                $("#btnLogin").attr("hidden");
                                $("#btnLogout").removeAttr("hidden");
                                $("#hiUser").removeAttr("hidden");
                                // $.ajax({
                                //     url: "http://localhost:8080/api/user_s/search/findUser_ByUserEmail?email=" + email,
                                //     success: function (data) {
                                $("#hiUser").text("Hi, " + data.userFirstName + " " + data.userLastName);
                                $.ajax({
                                    url: data._links.role.href + "",
                                    success: function(_role) {
                                        localStorage.setItem('roleN', _role.roleName)
                                        if (_role.roleName == 'Admin') {
                                            // console.log(localStorage.getItem('roleN'))
                                            // $("#admin").css("display", "block");
                                            $("#admin").removeAttr("hidden");
                                        }else{
                                            $("#admin").attr("hidden");
                                        }
                                    }
                                })

                                $("#loginModal").modal("hide");

                                    // }
                                // });
                                localStorage.setItem("emailLogin", email);
                            } else {
                                $("#errLogin").text("Wrong Password !!");
                            }
                        }
                    });
                }
            });
        }
    });

    // Header - Register
    $("#btnSubmitRegister").click(function() {
        var name = $("#txtName").val().trim();
        var fullname = name.split(" ");
        var firstName = fullname[0];
        var lastName = "";
        for (var i = 1; i < fullname.length; i++) {
            lastName += fullname[i];
        }
        var email = $("#txtEmail").val();
        var phone = $("#txtPhone").val();
        var pass = $("#txtPass").val().trim();
        var repass = $("#txtRepass").val();
        var regexName = /^[a-zA-Z ]{2,30}$/;
        var regexEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        var regexPhone = /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

        if (regexName.test(name) == false) {
            $("#errRegister").text("Invalid Name!");
        } else if (regexEmail.test(email) == false) {
            $("#errRegister").text("Invalid Email!");
        } else if (regexPhone.test(phone) == false) {
            $("#errRegister").text("Invalid Phone Number!");
        } else if (pass.length < 6) {
            $("#errRegister").text("Invalid Password!");
        } else if (pass != repass) {
            $("#errRegister").text("Retype password not match!");
        } else {
            $("#errRegister").text("");
            var userAdd = {
                userName: fullname.join(""),
                userPassword: pass,
                userFirstName: firstName,
                userLastName: lastName,
                userPhoneNumber: phone,
                userEmail: email,
                role: {
                    roleId: "R006",
                    roleName: "Guest"
                }
            };

            $.ajax({
                url: "http://localhost:8080/api/user_s/add",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(userAdd),
                success: function(data) {
                    $("#btnSubmitRegisterClose").click();
                    $("#registerModal").modal("hide");
                    $("#btnLogin").hide();
                    $("#btnLogout").removeAttr("hidden");
                    $("#hiUser").removeAttr("hidden");
                    $("#hiUser").text("Hi, " + firstName + " " + lastName);
                    localStorage.setItem("emailLogin", email);
                    location.reload();
                    alert(data);
                },
                error: function(data) {
                    alert(data);
                }
            });

            // sent email sign up
            $.get("http://localhost:8080/api/user_s/mail?email=" + email + "&text=Thank+you+for+registering+with+us.");
        }
    });
});
