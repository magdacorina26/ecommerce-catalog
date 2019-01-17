$(document).ready(function () {
    showAccountInfo();
});

function showAccountInfo() {
    var token = localStorage.getItem('ecommerce_jwt');
    $.ajax({
            url: '/account/',
            type: 'GET',
            accepts: {
                json: 'application/json'
            },
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (data) {
                var html = '<div>' +
                    '<div class="form-group">' +
                    '<label for="name">Nume: </label>' +
                    '<input type="text" name="name" id="name" placeholder="Nume" value="' + data.name + '" class="form-control"/>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="email">Email: </label>' +
                    '<input type="text" name="email" id="email" placeholder="Email" value="' + data.email + '" class="form-control"/>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="address">Adresa: </label>' +
                    '<input type="text" name="address" id="address" placeholder="Adresa" value="' + data.address + '" class="form-control"/>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="phone">Telefon: </label>' +
                    '<input type="text" name="phone" id="phone" placeholder="Telefon" value="' + data.phone + '" class="form-control"/>' +
                    '</div>' +
                    '<button type="button" class="btn btn-primary" onclick="saveAccountInfo()">Salveaza!</button>' +
                    '</div>'
                ;
                $('#content').html(html);
            },
            error: function (err) {
                redirect('/');
            }
        });
}

function saveAccountInfo() {
    var formData = {
        'name': $('#name').val(),
        'email': $('#email').val(),
        'address': $('#address').val(),
        'phone': $('#phone').val()
    };
    var token = localStorage.getItem('ecommerce_jwt');
    $.ajax({
        url: '/account/',
        type: 'PUT',
        accepts: {
            json: 'application/json'
        },
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: formData,
        success: function(data) {
            $('#status').text("Datele au fost salvate cu success!");
        },
        error: function(data) {
            $('#status').text("Datele nu au fost salvate!");
        }
    });
}


function showOrders() {
    var token = localStorage.getItem('ecommerce_jwt');
    var html = '';
    $.ajax({
        url: '/orders/',
        type: 'GET',
        accepts: {
            json: 'application/json'
        },
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (data) {
            data.forEach(function (order) {
                html += '<div>' +
                    '<div class="form-group">' +
                    '<label for="id">ID comanda: </label>' +
                    '<span>' + order.id + '</span>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="product_name">Nume produs: </label>' +
                    '<span>' + order.product.name + '</span>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="product_price">Pret produs: </label>' +
                    '<span>' + order.product.price + '</span>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="product_price">ID Categorie produs: </label>' +
                    '<span>' + order.product.category_id + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<hr><br>'
                ;
            });

            $('#content').html(html);
        }
    });
}

function logout() {

}