const userRouter = require('express').Router(),
    config = require('../app.config'),
    jwt = require('jsonwebtoken'),
    { getUserDetail } = require('../server/Controllers/user');

module.exports = (app, passport) => {
    //User routers 
    userRouter.route('/').get(passport.authenticate('jwt', { session: false }), (req, res) => {
        getUserDetail({
            _id: req.user._id
        })
            .then((success) => {
                res.status(200).send(success);
            }, (error) => {
                res.status(400).send(error);
            });
    });
    userRouter.route('/login').post((req, res) => {
        if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string' || !req.body.email.trim().length || !req.body.password.trim().length)
            return res.status(400).send({
                msg: 'Please provide email or password',
                success: false
            });;
        passport.authenticate('local-login', { session: false }, (error, user) => {
            if (error) {
                return res.status(400).send({
                    msg: typeof error === 'string' ? error : 'Error by database',
                    success: false,
                    error: error
                });
            }
            if (!user) {
                return res.status(400).send({
                    msg: 'No user exist',
                    success: false
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    return res.status(400).send({
                        msg: 'Error by database',
                        success: false,
                        error: error
                    });
                }
                const token = jwt.sign({
                    id: user._id
                }, config.EXPRESS_SESSION.SECRET);
                return res.status(200).json({
                    token: token,
                    msg: 'Successfully login',
                    user: user,
                    success: true
                });
            });
        })(req, res);
    });
    userRouter.route('/register').post((req, res) => {
        if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string' || !req.body.email.trim().length || !req.body.password.trim().length)
            return res.status(400).send({
                msg: 'Please provide email or password',
                success: false
            });;
        passport.authenticate('local-signup', { session: false }, (error, user) => {
            if (error) {
                return res.status(400).send({
                    msg: typeof error === 'string' ? error : 'Error by database',
                    success: false,
                    error: error
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    return res.status(400).send({
                        msg: 'Error by database',
                        success: false,
                        error: error
                    });
                }
                const token = jwt.sign({
                    id: user._id
                }, config.EXPRESS_SESSION.SECRET);
                return res.status(200).json({
                    token: token,
                    msg: 'Successfully login',
                    user: user,
                    success: true
                });
            });
        })(req, res);
    });
    userRouter.route('/logout').get(passport.authenticate('jwt', { session: false }), (req, res) => {
        if (req.user) {
            if (typeof req.session === 'function') {
                return req.session.destroy(() => {
                    res.status(200).json({
                        success: true,
                        msg: 'Successfully logout'
                    });
                });
            } else {
                req.logout();
                res.status(200).json({
                    success: true,
                    msg: 'Successfully logout'
                });
            }
        } else {
            res.status(200).json({
                success: true,
                msg: 'Successfully logout'
            });
        }
    });

    app.use('/user/', userRouter);


}