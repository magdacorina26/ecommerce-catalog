function sendMessage() {
    var name = $('#name').val();
    var email = $('#email').val();
    var message = $('#message').val();
    formData = {
        'name': name,
        'email': email,
        'message': message
    };
    $.ajax({
        url: '/contact',
        type: 'POST',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#status').text('Mesaj trimis cu success!');
        },
        error: function (error) {
            $('#status').text('A aparut o eroare!');
        }
    });
}