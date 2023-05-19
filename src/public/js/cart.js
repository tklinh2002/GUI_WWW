var minusBook;
var plusBook;


$(document).ready(function () {
    loadCartPage();

    $("#checkAllBook").click(function () {
        $("input[name='select']").prop('checked', this.checked);
        let totalPrice = 0;
        let listBook = JSON.parse(localStorage.getItem("books"));
        // // change listBook.bookStatus
        for (let i = 0; i < listBook.length; i++) {
            listBook[i].status = this.checked;
        }
        localStorage.setItem("books", JSON.stringify(listBook));

        if (!this.checked) {
            $("#total-price").text(totalPrice.toFixed(2));
        }else{
            for (let i = 0; i < listBook.length; i++) {
                totalPrice += listBook[i].price * listBook[i].quantity;
            }
            $("#total-price").text(totalPrice.toFixed(2));
        }

        localStorage.setItem("totalPriceInCart", totalPrice.toFixed(2));
    });

    $("input[name='select']").click(function () {
        let totalPrice = parseFloat(localStorage.getItem("totalPriceInCart"));
        let listBook = JSON.parse(localStorage.getItem("books"));

        for (let i = 0; i < listBook.length; i++) {
            if (listBook[i].id == $(this).val()) {
                if (this.checked) {
                    totalPrice += parseFloat(listBook[i].price).toFixed(2) * listBook[i].quantity;
                }else{
                    totalPrice -= parseFloat(listBook[i].price).toFixed(2) * listBook[i].quantity;
                }
                listBook[i].status = this.checked;
            }
        }
        console.log(totalPrice.toFixed(2));
        $("#total-price").text(totalPrice.toFixed(2))
        localStorage.setItem("totalPriceInCart", totalPrice.toFixed(2));
        localStorage.setItem("books", JSON.stringify(listBook));
    });

    $("input[name='select']").click(function () {
        if ($("input[name='select']:checked").length == $("input[name='select']").length) {
            $("#checkAllBook").prop('checked', true);
        } else {
            $("#checkAllBook").prop('checked', false);
        }
    });

    // uncheck one -> uncheck all then recalculate total price
    $("input[name='select']").click(function () {
        if ($("input[name='select']:checked").length == 0) {
            $("#total-price").text(0.00)
        }
    });

    // Delete book
    $("#btnDeleteSelected").click(function () {
        let listBook = JSON.parse(localStorage.getItem("books"));
        let listBookSelected = [];
        $("input[name='select']:checked").each(function () {
            listBookSelected.push($(this).val());
        });
        if (listBookSelected.length == 0) {
            alert("Please select book(s) to delete!");
        } else {
            let confirmDelete = confirm("Are you sure to delete selected book(s)?");
            if (confirmDelete) {
                for (let i = 0; i < listBookSelected.length; i++) {
                    for (let j = 0; j < listBook.length; j++) {
                        if (listBookSelected[i] == listBook[j].id) {
                            listBook.splice(j, 1);
                        }
                    }
                }
                localStorage.setItem("books", JSON.stringify(listBook));
                $("#list-cart").empty();
                loadCartPage();
            }
        }
    });

    minusBook = function (id, event) {
        let listBook = JSON.parse(localStorage.getItem("books"));
        let price = 0;
        for (let i = 0; i < listBook.length; i++) {
            if (listBook[i].id == id) {
                price = parseFloat(listBook[i].price).toFixed(2) * (listBook[i].quantity - 1);
                if (listBook[i].quantity == 1) {
                    if (confirm("Do you want to remove this book from cart?")) {
                        listBook.splice(i, 1);
                        break;
                    }
                } else {
                    listBook[i].quantity -= 1;
                    break;
                }
            }
        }
        localStorage.setItem("books", JSON.stringify(listBook));
        window.location.href = '/cart'
    }

    plusBook =function (id) {
        let listBook = JSON.parse(localStorage.getItem("books"));
        for (let i = 0; i < listBook.length; i++) {
            if (listBook[i].id == id) {
                if (listBook[i].quantity == 10) {
                    alert("You can only buy 10 books at a time!");
                } else {
                    listBook[i].quantity += 1;
                }
            }
            localStorage.setItem("books", JSON.stringify(listBook));
            // $("#list-cart").empty();
            // loadCartPage();
            window.location.href = '/cart'
        }
    }

    function loadCartPage() {
        let listBook = JSON.parse(localStorage.getItem("books"));
        let content = "";
        let totalPrice = 0;
        let flag = true;
        if (listBook.length == 0) {
            $("#list-cart").append('<h2 class="text-center">Your cart is empty</h2>');
            $("#list-cart").append('<div class="d-flex justify-content-center"><a href="/categories/C001" class="btn btn-success mx-auto">Continue shopping</a></div>');
            return;
        }
        content += '<div class="row mb-4 mb-md-3 border-bottom border-dark pb-3">';
        content += '    <div><button id="btnDeleteSelected" type="button" class="btn btn-danger">Delete all seleted</button></div>';
        content += '</div>';

        content += '<div class="row mb-4 mb-md-3 border-bottom border-dark pb-3">';
        content += '    <div class="col-md-8 col-9">';
        content += '        <input type="checkbox" id="checkAllBook" class="form-check-input" style="transform: scale(2);">';
        content += '        <label for="checkAllBook" class="ms-4 form-check-label fw-bold font-table-header">Check all</label>';
        content += '    </div>';
        content += '    <div class="col-md-2 d-none d-md-block text-center fw-bold font-table-header">Quantity</div>';
        content += '    <div class="col-md-2 col-3 text-center fw-bold font-table-header">Total</div>';
        content += '</div>';


        for (let i = 0; i < listBook.length; i++) {
            content +=' <div class="row mb-4 mb-md-3">';
            content +='     <div class="col-md-8 col-9">';
            content +='         <div class="row">';
            content +='             <div class="col-1 align-self-center">';
            if (listBook[i].status) {
                content +='                 <input type="checkbox" name="select" value="' + listBook[i].id + '" class="form-check-input" style="transform: scale(2);" checked>';
                totalPrice += parseFloat(listBook[i].price).toFixed(2) * listBook[i].quantity;
            }else {
                content +='                 <input type="checkbox" name="select" value="' + listBook[i].id + '" class="form-check-input" style="transform: scale(2);">';
                flag = false;
            }
            content +='             </div>';
            content +='             <div class="col-md-2 col-3">';
            content +='                 <a href="/product/'+ listBook[i].id +'" class=""><img src="'+ listBook[i].image +'" alt="Image" style="height: 15vh; width: 90%;object-fit: cover;"></a>';
            content +='             </div>';
            content +='             <div class="col d-flex flex-column justify-content-md-between justify-content-around">';
            content +='                 <b class="h6"><a href="/product/'+ listBook[i].id +'" class="text-decoration-none text-dark">'+ listBook[i].title +'</a></b>';
            content +='                 <div class="d-md-none d-block">';
            content +='                     <button class="btn btn-success" type="button" onclick="minusBook(\'' + listBook[i].id + '\')">-</button>';
            content +='                     <span class="mx-2">'+ listBook[i].quantity +'</span>';
            content +='                     <button class="btn btn-success" type="button" onclick="plusBook(\'' + listBook[i].id + '\')">+</button>';
            content +='                 </div>';
            content +='                 <div class="text-danger h6">'+ listBook[i].price +' $</div>';
            content +='             </div>';
            content +='         </div>';
            content +='     </div>';
            content +='     <div class="col-md-2 d-none d-md-block text-center align-self-center">';
            content +='         <div class="d-flex justify-content-center">';
            content +='             <button class="btn btn-success" type="button" onclick="minusBook(\'' + listBook[i].id + '\', event)">-</button>';
            content +='             <span class="mx-md-3">'+ listBook[i].quantity +'</span>';
            content +='             <button class="btn btn-success" type="button" onclick="plusBook(\'' + listBook[i].id + '\')">+</button>';
            content +='         </div>';
            content +='     </div>';
            content +='     <div class="col-md-2 col-3 text-center align-self-center text-danger h6">'+ (parseFloat(listBook[i].price).toFixed(2) * listBook[i].quantity) +' $</div>';
            content +=' </div>';
        }
        content += '<div class="d-flex justify-content-end"><div class="h5"><span>Total Price Selected Book: </span><span class="text-danger" id="total-price">' + totalPrice.toFixed(2) +'</span><span class="text-danger"> $</span></div></div>';
        content += '<a href="/checkout" class="btn btn-success w-100 mb-5 p-2">Checkout</a>';
        localStorage.setItem("totalPriceInCart", totalPrice.toFixed(2));
        $("#list-cart").append(content);
        if (flag) {
            $("#checkAllBook").prop('checked', true);
        }
    }

});
