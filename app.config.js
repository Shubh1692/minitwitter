
module.exports = {
    NODE_SERVER_PORT: 8000,
    REQUEST_HEADER: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials': true
    },
    EXPRESS_SESSION: {
        COKKIES_MAX_AGE: 6000000,
        SECRET: 'minitwitter'
    },
    MONGOURL: process.env.MONGOURL || "mongodb://localhost:27017/minitwitter"
};