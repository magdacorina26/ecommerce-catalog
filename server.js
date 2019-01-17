var express = require("express");
var Sequelize = require("sequelize");
var nodeadmin = require("nodeadmin");
var nodemailer = require('nodemailer');
var jwt    = require('jsonwebtoken');
var bCrypt = require('bcrypt-nodejs');

//config
var DATABASE_NAME='catalog';
var DATABASE_TYPE='mysql';
var DATABASE_HOST='localhost';
var DATABASE_USER='root';
var DATABASE_PASS='';

var EMAIL_USERNAME='';
var EMAIL_PASSWORD='';

var SECRET_KEY='BGLvosUInyj9geHU3o6k';

//connect to mysql database
var sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASS, {
    dialect:DATABASE_TYPE,
    host:DATABASE_HOST
});

sequelize.authenticate().then(function(){
    console.log('Success')
});

//define a new Model
var Categories = sequelize.define('categories', {
    name: Sequelize.STRING,
    description: Sequelize.STRING
});

var Products = sequelize.define('products', {
    name: Sequelize.STRING,
    category_id: Sequelize.INTEGER,
    description: Sequelize.STRING,
    price: Sequelize.INTEGER,
    image: Sequelize.STRING
});

var Reviews = sequelize.define('reviews', {
    product_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    content: Sequelize.STRING,
    score: Sequelize.INTEGER
});

var Users = sequelize.define('users', {
    name: Sequelize.STRING,
    address: Sequelize.STRING,
    phone: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING
});


var Orders = sequelize.define('orders', {
    status: Sequelize.STRING
});

Products.belongsTo(Categories, {foreignKey: 'category_id', targetKey: 'id'});
Products.hasMany(Reviews, {foreignKey: 'product_id'});
Orders.belongsTo(Users, {foreignKey: 'user_id', targetKey: 'id'});
Orders.belongsTo(Products, {foreignKey: 'product_id', targetKey: 'id'});

var app = express();

app.use('/nodeamin', nodeadmin(app));

//access static files
app.use(express.static('public'));
app.use('/admin', express.static('admin'));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/createdb', (request, response) => {
    sequelize.sync({force: true}).then(() => {
        response.status(200).send('tables created')
    }).catch((err) => {
        response.status(500).send('could not create tables')
    })
})

app.get('/createdata', (req, res) => {
    //TODO add some test data here
})

async function getCategories(request, response) {
    try {
        let categories = await Categories.findAll();
        response.status(200).json(categories)
    } catch(err) {
        response.status(500).send('something bad happened')
    }
}

// get a list of categories
app.get('/categories', getCategories);

// get one category by id
app.get('/categories/:id', function(request, response) {
    Categories.findOne({where: {id:request.params.id}}).then(function(category) {
        if(category) {
            response.status(200).send(category)
        } else {
            response.status(404).send()
        }
    })
});

//create a new category
app.post('/categories', function(request, response) {
    Categories.create(request.body).then(function(category) {
        response.status(201).send(category)
    })
});

app.put('/categories/:id', function(request, response) {
    Categories.findById(request.params.id).then(function(category) {
        if(category) {
            category.update(request.body).then(function(category){
                response.status(201).send(category)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
});

app.delete('/categories/:id', function(request, response) {
    Categories.findById(request.params.id).then(function(category) {
        if(category) {
            category.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    });
});

app.get('/products', function(request, response) {
    Products.findAll(
        {
            include: [{
                model: Categories,
                where: { id: Sequelize.col('products.category_id') }
            }, {
                model: Reviews,
                where: { id: Sequelize.col('products.id')},
                required: false
            }]
        }
        
        ).then(
            function(products) {
                response.status(200).send(products)
            }
        );
});

app.get('/products/:id', function(request, response) {
    Products.findById(request.params.id, {
            include: [{
                model: Categories,
                where: { id: Sequelize.col('products.category_id') }
            }, {
                model: Reviews,
                where: { id: Sequelize.col('products.id')},
                required: false
            }]
        }).then(
            function(product) {
                response.status(200).send(product)
            }
        );
});

app.post('/products', function(request, response) {
    Products.create(request.body).then(function(product) {
        Products.findById(product.id, {
            include: [{
                model: Categories,
                where: { id: Sequelize.col('products.category_id') }
            }]
        }).then(
            function(product) {
                response.status(201).send(product)
            }
        );
    });
});

app.put('/products/:id', function(request, response) {
    Products.findById(request.params.id).then(function(product) {
        if(product) {
            product.update(request.body).then(function(product){
                response.status(201).send(product)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    });
});

app.delete('/products/:id', function(request, response) {
    Products.findById(request.params.id).then(function(product) {
        if(product) {
            product.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
});

app.get('/categories/:id/products', function(request, response) {
    Products.findAll({
            where:{category_id: request.params.id},
            
            include: [{
                model: Categories,
                where: { id: Sequelize.col('products.category_id') }
            }, {
                model: Reviews,
                where: { id: Sequelize.col('products.id')},
                required: false
            }]
        }
            ).then(
            function(products) {
                response.status(200).send(products)
            }
        )
});

app.get('/reviews', function(request, response) {
    Reviews.findAll().then(function(reviews){
        response.status(200).send(reviews)
    })
});

app.get('/reviews/:id', function(request, response) {
    Reviews.findById(request.params.id).then(function(review) {
        response.status(200).send(review);
    })
});

app.post('/reviews', function(request, response) {
    Reviews.create(request.body).then(function(review) {
        response.status(201).send(review)
    })
});

app.put('/reviews/:id', function(request, response) {
    Reviews.findById(request.params.id).then(function(review) {
        if(review) {
            review.update(request.body).then(function(review){
                response.status(201).send(review)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    });
});

app.delete('/reviews/:id', function(request, response) {
    Reviews.findById(request.params.id).then(function(review) {
        if(review) {
            review.destroy().then(function(){
                response.status(204).send();
            })
        } else {
            response.status(404).send('Not found');
        }
    });
});

app.post('/contact/', function (request, response) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USERNAME,
            pass: EMAIL_PASSWORD
        }
    });

    var body = "Message sent from shop.\n" +
        "=======================\n" +
        "Name: " + request.body.name + "\n" +
        "Email: " + request.body.email + "\n" +
        "Message: " + request.body.message + "\n" +
        "=======================\n";

    var mailOptions = {
        from: EMAIL_USERNAME,
        to: EMAIL_USERNAME,
        subject: 'New contact message from your shop.',
        text: body
    };

    transporter.sendMail(mailOptions, function(error){
        if (error) {
            response.status(401).send('Cannot send email!');
        } else {
            response.status(200).send('Email sent!');
        }
    });
});

app.get('/orders/', function(request, response) {
    if (!request.headers.hasOwnProperty('authorization')) {
        response.status(404).send('No authorization header found.');
    }
    var token = getTokenFromHeaders(request);
    var user_data = jwt.verify(token, SECRET_KEY);
    var user_id = user_data['id'];
    Orders.findAll(
        {
            where: {
                'user_id': user_id
            },
            include: [{
                model: Products,
                // where: { id: Sequelize.col('orders.product_id') }
            }]
        }).then(function (orders) {
            response.status(200).send(orders);
        });
});

app.get('/orders/:id', function(request, response) {
    Orders.findById(request.params.id,  {
        include: [{
            model: Products,
            where: { id: Sequelize.col('orders.product_id') }
        }]
    }).then(function (order) {
        response.status(200).send(order)
    });
});

app.post('/orders/', function(request, response) {
    if (!request.headers.hasOwnProperty('authorization')) {
        response.status(404).send('No authorization header found.');
    }
    var token = getTokenFromHeaders(request);
    var user_data = jwt.verify(token, SECRET_KEY);
    request.body.user_id = user_data['id'];
    Orders.create(request.body).then(function (order) {
        Orders.findById(order.id, {
            include: [{
                model: Products,
                where: { id: Sequelize.col('orders.product_id') }
            }]
        }).then(
            function(order) {
                response.status(201).send(order)
            }
        );
    });
});

app.get('/users/', function (request, response) {
    Users.findAll().then(function(users) {
        response.status(200).send(users);
    })
});

app.get('/users/:id', function (request, response) {
    Users.findById(request.params.id).then(function(user) {
        response.status(200).send(user);
    })
});

function getTokenFromHeaders(request) {
    if (request.headers.hasOwnProperty('authorization')) {
        return request.headers['authorization'].replace('Bearer ', '');
    }
}

app.get('/check/', function (request, response) {
    if (!request.headers.hasOwnProperty('authorization')) {
        response.status(404).send('No authorization header found.');
    }
    var token = getTokenFromHeaders(request);
    var user_data = jwt.verify(token, SECRET_KEY);
    var user_id = user_data['id'];
    try {
        jwt.verify(token, SECRET_KEY);
        response.status(200).send('ok');
    } catch(err) {
        response.status(404).send(err);
    }
});

app.post('/login/', function(request, response) {
    // login
    var password = request.body.password;
    var email = request.body.email;
    Users.findOne({
        where: {
            email: email
        },
        limit: 1
    }).then(function (user) {
        if (user) {
            bCrypt.compare(password, user.password, function(err, res) {
                if(res) {
                    var payload = {
                        id: user.id,
                        name: user.name,
                        address: user.address,
                        phone: user.phone,
                        email: user.email
                    };
                    var token = jwt.sign(payload, SECRET_KEY);
                    response.status(200).send(token);
                } else {
                    response.status(404).send("Invalid password!");
                }
            });

        } else {
            response.status(404).send("User not found!");
        }
    });
});



app.post('/register/', function(request, response) {
    if (request.body.email && request.body.password && request.body.email.length && request.body.password.length) {
        request.body.password = bCrypt.hashSync(request.body.password, bCrypt.genSaltSync(8), null);
        Users.create(request.body).then(function(user) {
            response.status(201).send(user);
        });
    } else {
        response.status(401).send("Email and password are mandatory fields!");
    }
});

app.get('/account/', function (request, response) {
    if (!request.headers.hasOwnProperty('authorization')) {
        response.status(404).send('No authorization header found.');
    }
    var token = getTokenFromHeaders(request);
    var user_data = jwt.decode(token, SECRET_KEY);
    if (!user_data) {
        response.status(404).send('Invalid session.');
    }
    var user_id = user_data['id'];
    Users.findById(user_id).then(function(user) {
        response.status(200).send(user);
    })
});

app.put('/account/', function (request, response) {
    var token = getTokenFromHeaders(request);
    var user_data = jwt.decode(token, SECRET_KEY);
    var user_id = user_data['id'];
    Users.findById(user_id).then(function(user) {
        if(user) {
            user.update(request.body).then(function(user){
                response.status(201).send(user)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
});

app.listen(8080);
