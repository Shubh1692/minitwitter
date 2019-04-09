const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    FeedSchema = mongoose.Schema({
        feed_description: {
            type: String,
            default: ''
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    }, {
            timestamps: true
        });
// Export Feed Schema
module.exports = mongoose.model('Feed', FeedSchema);;