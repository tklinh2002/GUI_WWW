async function loadAccount(page) {
    $.ajax({
        url: "http://localhost:8080/api/user_s/search/find10Users",
        data: {
            offset: page
        },
        success: function (data) {
            var users = data._embedded.user_s;
            // Render table
            for (var i = 0; i < users.length; i++) {
                var table = '';
                table += '<tr>'
                table += '<td>' + users[i].userFirstName + ' ' + users[i].userLastName + '</td>'
                table += '<td>' + users[i].userPhoneNumber + '</td>'
                table += '<td>' + users[i].userEmail + '</td>'
                $.ajax({
                    url: users[i]._links.role.href,
                    async: false,
                    success: function (data) {
                        table += '<td>' + data.roleName + '</td>';
                    }
                });
                table += '<td><button type="button " class="btn btn-outline-warning " data-bs-toggle="modal" data-bs-target="#modalAccount" id="editAccount"><i class="fas fa-edit"></i></button>'
                table += '<button type="button " class="btn btn-outline-danger " id="deleteAccount"><i class="fas fa-trash-alt"></i></button>'
                table += '</td>'
                table += ' </tr>'

                $('#tableAccount').append(table);
            }
        }
    });
}

function searchUserByPhone(phone, offset) {
    $.ajax({
        url: "http://localhost:8080/api/user_s/search/search10UserByPhone",
        data: {
            phoneNumbers: phone,
            offset: offset
        },
        success: function (data) {
            var users = data._embedded.user_s;
            // Render table
            for (var i = 0; i < users.length; i++) {
                var table = '';
                table += '<tr>'
                table += '<td>' + users[i].userName + '</td>'
                table += '<td>' + users[i].userFirstName + ' ' + users[i].userLastName + '</td>'
                table += '<td>' + users[i].userPhoneNumber + '</td>'
                table += '<td>' + users[i].userEmail + '</td>'
                $.ajax({
                    url: users[i]._links.role.href,
                    async: false,
                    success: function (data) {
                        table += '<td>' + data.roleName + '</td>';
                    }
                });
                table += '<td><button type="button " class="btn btn-outline-warning " data-bs-toggle="modal" data-bs-target="#modalAccount" id="editAccount"><i class="fas fa-edit"></i></button>'
                table += '<button type="button " class="btn btn-outline-danger " id="deleteAccount"><i class="fas fa-trash-alt"></i></button>'
                table += '</td>'
                table += ' </tr>'
                $('#tableAccount').append(table);
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
        url: "http://localhost:8080/api/user_s/search/countUser_sBy",
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
        $('#tableAccount').empty();
        loadAccount((page - 1) * 10)
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

function addAccount() {
    var firstName = $('#userFirstName').val();
    var lastName = $('#userLastName').val();
    var fullname = firstName + ' ' + lastName;
    var phone = $("#userPhoneNumber").val();
    var email = $("#userEmail").val();
    var pass = $("#userPassword").val().trim();
    var repass = $("#userRePassword").val();
    var regexName = /^[a-zA-Z ]{2,30}$/;
    var regexEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    var regexPhone = /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

    if (regexName.test(fullname) == false) {
        $("#errRegisterAccount").text("Invalid Name!");
        return
    } else if (regexEmail.test(email) == false) {
        $("#errRegisterAccount").text("Invalid Email!");
        return
    } else if (regexPhone.test(phone) == false) {
        $("#errRegisterAccount").text("Invalid Phone Number!");
        return
    } else if (pass.length < 6) {
        $("#errRegisterAccount").text("Invalid Password!");
        return
    } else if (pass != repass) {
        $("#errRegisterAccount").text("Retype password not match!");
        return
    } else {
        $("#errRegisterAccount").text("*");
        var role = $('.role option:selected').text()
        var roleId = ''
        $.ajax({
            url: "http://localhost:8080/api/roles/search/findRoleByRoleNameIgnoreCase",
            data: {
                roleName: role
            },
            async: false,
            success: function (data) {
                let str = data._links.self.href
                roleId += str.substring(str.lastIndexOf("/") + 1);
            },
            error: function (data) {
                alert(data);
            }
        });

        var userAdd = {
            userName: fullname,
            userPassword: pass,
            userFirstName: firstName,
            userLastName: lastName,
            userPhoneNumber: phone,
            userEmail: email,
            role: {
                roleId: roleId
            }
        };

        $.ajax({
            url: "http://localhost:8080/api/user_s/add",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(userAdd),
            async: false,
            success: function (data) {
                alert(data)
                $('#modalAccount').modal('hide');
                $('#tableAccount').empty();
                loadAccount(0)
            },
            error: function (data) {
                alert(data);
            }
        });

        // sent email sign up
        $.get("http://localhost:8080/api/user_s/mail?email=" + email + "&text=Thank+you+for+registering+with+us.");
    }

}

async function loadDataModal() {
    // load catagories
    $('.role').empty()
    $.ajax({
        url: "http://localhost:8080/api/roles/search/findRolesBy",
        success: function (data) {
            var roles = data._embedded.roles
            var role = ''
            for (var i = 0; i < roles.length; i++) {
                if (i === 0)
                    role += '<option selected>' + roles[i].roleName + '</option>'
                else
                    role += '<option>' + roles[i].roleName + '</option>'
            }
            $('.role').append(role);
        }
    });

}

function deleteUser(email) {
    $.ajax({
        url: "http://localhost:8080/api/user_s/deleteUser?email=" + email,
        method: "delete",
        success: function (data) {
            alert(data);loadValueModal
            $('#tableAccount').empty();
            loadAccount(0)
        },
        error: function (data) {
            alert("Delete user failed. ");
        }
    });
}

function loadValueModal(email) {
    $('.modal-title').html("Edit user");
    $('#submitModal').html('Edit')
    $('#userEmail').prop('disabled', true);
    $('#userPassword').prop('disabled', true);
    $('#userRePassword').prop('disabled', true);
    $('#userFirstName').prop('disabled', true);
    $('#userLastName').prop('disabled', true);
    $("#userPhoneNumber").prop('disabled', true);
    $.ajax({
        url: "http://localhost:8080/api/user_s/search/findUser_ByUserEmail",
        data: {
            email: email
        },
        async: false,
        success: function (data) {
            $('#userFirstName').val(data.userFirstName);
            $('#userLastName').val(data.userLastName);
            $("#userPhoneNumber").val(data.userPhoneNumber);
            $("#userEmail").val(data.userEmail);
            var roleName = ''
            $.ajax({
                url: data._links.role.href,
                async: false,
                success: function (data) {
                    roleName += data.roleName
                }
            });
            console.log(roleName)
            $('.role option:contains("' + roleName + '")').prop('selected', true);
        }
    });

}

function editAccount() {
    var firstName = $('#userFirstName').val();
    var lastName = $('#userLastName').val();
    var fullname = firstName + ' ' + lastName;
    var phone = $("#userPhoneNumber").val();
    var email = $("#userEmail").val();
    // var regexName = /^[a-zA-Z ]{2,30}$/;
    // var regexEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    // var regexPhone = /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

    $("#errRegisterAccount").text("*");
    var role = $('.role option:selected').text()
    console.log(role);
    var roleId = ''
    $.ajax({
        url: "http://localhost:8080/api/roles/search/findRoleByRoleNameIgnoreCase",
        data: {
            roleName: role
        },
        async: false,
        success: function (data) {
            let str = data._links.self.href
            roleId += str.substring(str.lastIndexOf("/") + 1);
        },
        error: function (data) {
            alert(data);
        }
    });

    var userAdd = {
        userName: fullname,
        userFirstName: firstName,
        userLastName: lastName,
        userPhoneNumber: phone,
        userEmail: email,
        role: {
            roleId: roleId
        }
    };

    $.ajax({
        url: "http://localhost:8080/api/user_s/updateUser",
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(userAdd),
        async: false,
        success: function (data) {
            alert(data)
            $('#modalAccount').modal('hide');
            $('#tableAccount').empty();
            loadAccount(0)
        },
        error: function (data) {
            alert(data);
        }
    });

    // sent email sign up
    $.get("http://localhost:8080/api/user_s/mail?email=" + email + "&text=Update+successful.");

}

function setModalAdd() {
    loadDataModal()
    $('.modal-title').html("Add user");
    $('#submitModal').html('Add')
    $('#userEmail').prop('disabled', false);
    $('#userPassword').prop('disabled', false);
    $('#userRePassword').prop('disabled', false);
    $('#userFirstName').prop('disabled', false);
    $('#userLastName').prop('disabled', false);
    $("#userPhoneNumber").prop('disabled', false);
    $('#userFirstName').val('');
    $('#userLastName').val('');
    $("#userPhoneNumber").val('');
    $("#userEmail").val('');
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
        $('#tableAccount').empty();
        loadAccount(0)
    })

    $("#btnAdd").click(function () {
        setModalAdd()
    })

    $(".searchAccount").click(function () {
        var phone = $("#txtSearch").val().trim()
        $('#tableAccount').empty();
        searchUserByPhone(phone, 0)
    })
    loadAccount(0)
    //paganition
    loadPaganition()
    // load dataModal
    loadDataModal()
    //addUser
    $("#submitModal").click(function () {
        if ($(this).text() === 'Add')
            addAccount()
        else {
            editAccount()
        }
    });
    $("#closeModal, .btn-close").click(function () {
        $('.modal-title').html("Add user")
        $('#submitModal').html('Add')
    });

    //deleteUser
    $('#tableAccount').on('click', '#deleteAccount', function () {
        let row = $(this).closest('tr');
        let mail = row.find('td:eq(2)').text();
        console.log(mail)

        deleteUser(mail.trim())
    });
    //editUser
    $('#tableAccount').on('click', '#editAccount', function () {
        let row = $(this).closest('tr');
        // Lấy giá trị email trong ô thứ hai của hàng đó
        let mail = row.find('td:eq(2)').text();
        // Hiển thị giá trị email
        loadValueModal(mail)
    });
});
