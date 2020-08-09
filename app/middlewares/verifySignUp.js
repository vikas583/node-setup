const db = require("../models/index");
const User = db.user;


checkDuplicateMobileorEmail = (req, res, next) => {
    User.findOne({
        where: {
            mobile_no: req.body.mobile_no
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Mobile number is already in use!"
            });
            return;
        }

        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: "Failed! Email is already in use!"
                });
                return;
            }
            next();
        });
    });
};

const verifySignUp = {
    checkDuplicateMobileorEmail: checkDuplicateMobileorEmail,
};

module.exports = verifySignUp;
