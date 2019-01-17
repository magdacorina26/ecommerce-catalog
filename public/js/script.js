$(document).ready(function(){
    showCategories()
    showProducts()
})

function showCategories() {
    $.get( "/categories", function( data ) {
        var html = ''
        data.forEach(function(category) {
            html = html + '<li><a href="#" onClick="showProducts('+category.id+')">'+category.name+'</a></li>'
        })
        $('#categories').html(html)
    });
}

//todo: implement showProducts method
function showProducts(categoryId) {
    if(categoryId) {
        var url = '/categories/'+ categoryId +'/products';
    } else {
        var url = '/products'   
    }
    $.get(url, function(data) {
        var html = '';
        data.forEach(
            function(product) {
                html = html + '<div class="product">'
                  +  '<h2>'+product.name+'</h2>' + '<a href="#" onclick="buy('+product.id+')">(Cumpara)</a> '
                  +  '<p>'+product.description+'</p>'
                  +  '<p>Pret: '+product.pret+'</p>'
                  +  '<p>Categorie: '+product.category.name+'</p>'
                + '</div>';
                
                html = html + '<h3>Product reviews</h3>'
                
                if(product.reviews && product.reviews.length) {
                    product.reviews.forEach(
                        function(reviewData) {
                            html = html + reviewData.name + ' ' + reviewData.content;
                            html = html + '<br>';
                        }
                    )
                } else {
                    html = html + 'No reviews yet.';
                    html = html + '<br>';
                }
                html = html + 'Add a review'
                
            }
        )
        $('#content').html(html);
    })
}

function buy(product_id) {
    var formData = {
        'product_id': product_id
    };
    var token = localStorage.getItem('ecommerce_jwt');
    $.ajax({
        url: '/orders/',
        type: 'POST',
        accepts: {
            json: 'application/json'
        },
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: formData,
        success: function(data) {
            $('#status').text("Comanda a fost plasata cu success!");
        },
        error: function (err) {
            $('#status').text("A aparut o eroare la plasarea comenzii!");
        }
    })
}