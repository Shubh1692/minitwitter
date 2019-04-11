const Config = require('../../app.config'),
    { subscribeUnsubscribeUser, getUserDetail } = require('../Controllers/user'),
    { postFeed, getFeeds } = require('../Controllers/feed'),
    socketioJwt = require("socketio-jwt");
module.exports = (io) => {
    /**
     * Check socket io auth using logged user token by socketioJWT library
    */
    io.use(socketioJwt.authorize({
        secret: Config.EXPRESS_SESSION.SECRET,
        handshake: true
    }));

    /**
     * socket connection event 
    */
    io.on('connection', async (socket) => {
        const [loggedInUser] = await getUserDetail({
            _id: socket.decoded_token.id
        });
        const userList = await getUserDetail({});
        const feeds = await getFeeds({
            created_by: {
                $in: loggedInUser._doc.subscribe_users
            }
        });
        /**
         * Create socket room using user id for multitab in same browser window
         * It also help for emit new feed data to subscribe users 
        */
        socket.join(socket.decoded_token.id);
        /**
         * Emit initial data like logged in user detail and related feeds data to user
        */
        io.sockets.in(socket.decoded_token.id).emit('intiConfig', {
            loggedInUser, userList, feeds
        });

        /**
         * Save Subscribe or Unsubscribe user in data base of logged in user and emit new feeds data to user
        */
        socket.on('subscribeUnsubscribeUser', async ({
            subScribeUser
        }) => {
            const updatedLloggedInUser = await subscribeUnsubscribeUser({
                userId: socket.decoded_token.id,
                subScribeUser
            });
            const feeds = await getFeeds({
                created_by: {
                    $in: updatedLloggedInUser._doc.subscribe_users
                }
            }, {

                })
            io.sockets.in(socket.decoded_token.id).emit('updatedLloggedInUser', {
                loggedInUser: updatedLloggedInUser, feeds
            });
        });

        /**
         * Save new feed data to user and subscribed user
        */
        socket.on('postFeed', async ({
            feed_description
        }) => {
            const newFeed = await postFeed({
                created_by: socket.decoded_token.id,
                feed_description
            });
            const [loggedInUser] = await getUserDetail({
                _id: socket.decoded_token.id
            });
            loggedInUser.subscribe_users.forEach((userId) => {
                io.sockets.in(userId).emit('newFeed', {
                    newFeed
                });
            })


        });

        /**
         * Unauthroized event for logged in user
        */
        socket.on("unauthorized", function (error, callback) {
            if (error.data.type == "UnauthorizedError" || error.data.code == "invalid_token") {
                // redirect user to login page perhaps or execute callback:
                callback();
                console.log("User's token has expired");
            }
        });
    })
}