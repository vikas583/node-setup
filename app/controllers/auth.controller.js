const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        mobile_no: req.body.mobile_no,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        user_type: req.body.user_type
    })
        .then(user => {
            res.send({ status: true, message: "User was registered successfully!" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            user.accessToken = token;
            
            res.status(200).send({
                status: true,
                message: 'Logged in successfully!',
                data: user
            });

        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};