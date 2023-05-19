$(document).ready(function () {
    

    // Render list categories
    $.ajax({
        url: "http://localhost:8080/api/categories",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        type: "GET", /* or type:"GET" or type:"PUT" */
        dataType: "json",
        success: function (data) {
            var categories = data._embedded.categories;
            var content = "";
            for (var i = 0; i < categories.length; i++) {
                content += '<li><a class="dropdown-item" href="' + String(categories[i]._links.self.href).slice(25, )  + '">'+ categories[i].categoryName +'</a></li>';
            }
            $('#dropdown-menu').append(content);
        }
    });

    // Navbar - Sales
    $('#showSales').click(function () {
        // $('#content').load('./html/home.html');
        $('html, body').animate({
            scrollTop: $("#contentSales").offset().top
        }, 1);
    });
});
