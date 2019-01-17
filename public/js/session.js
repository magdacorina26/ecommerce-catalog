var SESSION_TOKEN_NAME = 'ecommerce_jwt';

$(document).ready(function () {
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if (page === 'signin.html') {
        $('#register-button').on('click', function () {
            register();
        });
        $('#login-button').on('click', function () {
            login();
        });
    }
    // check();
});

function isLoggedIn() {
    var token = getToken();
    if (!token) {
        return false;
    }
    $.ajax({
        'url': '/check/',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (response) {
            return !!response;
        },
        error: function (err) {
            return false;
        }
    });
}

function login() {
    var formData = {
        'email': $('form#login input[name="email"]').val(),
        'password': $('form#login input[name="password"]').val()
    };
    $.ajax({
        url: '/login/',
        type: 'POST',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            setToken(data);
            redirect("/");
        },
        error: function (err) {
            $('#status').text('Invalid login!');
        }
    });
}

function register() {
    var formData = {
        'email': $('form#register input[name="email"]').val(),
        'password': $('form#register input[name="password"]').val()
    };
    $.ajax({
        url: '/register/',
        type: 'POST',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#status').text("You have been registered. Now you can login!");
        }
    });
}

function logout() {
    setToken(null);
    redirect('/');
}

function getSession() {
    var token = getToken();
    // decode token and return body
}

function check() {
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if (page === 'account.html') {
        if (!isLoggedIn()) {
            redirect('/');
        }
    }
}

function redirect(route) {
    window.location.href = route;
}

function setToken(token) {
    localStorage.setItem(SESSION_TOKEN_NAME, token);
}

function getToken() {
    localStorage.getItem(SESSION_TOKEN_NAME);
}