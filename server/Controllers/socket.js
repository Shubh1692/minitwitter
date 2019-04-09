const Config = require('../../app.config'),
    { subscribeUnsubscribeUser, getUserDetail } = require('../Controllers/user'),
    { postFeed, getFeeds } = require('../Controllers/feed'),
    socketioJwt = require("socketio-jwt");
module.exports = (io) => {
    io.use(socketioJwt.authorize({
        secret: Config.EXPRESS_SESSION.SECRET,
        handshake: true
    }));
    io.on('connection', async (socket) => {
        const [loggedInUser] = await getUserDetail({
            _id: socket.decoded_token.id
        });
        const userList = await getUserDetail({});
        const feeds = await getFeeds({
            created_by: {
                $in: loggedInUser._doc.subscribe_users
            }
        }, {

            })
        socket.join(socket.decoded_token.id);
        io.sockets.in(socket.decoded_token.id).emit('intiConfig', {
            loggedInUser, userList, feeds
        });
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

        socket.on("unauthorized", function (error, callback) {
            if (error.data.type == "UnauthorizedError" || error.data.code == "invalid_token") {
                // redirect user to login page perhaps or execute callback:
                callback();
                console.log("User's token has expired");
            }
        });
    })
}