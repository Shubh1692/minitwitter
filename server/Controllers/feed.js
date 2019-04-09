const Feed = require('../Models/feed');
const getFeeds = async (filterObject) => {
    const feeds = await Feed.find(filterObject, );
    return feeds;
}

const postFeed = async (feedData) => {
    const newFeed = new Feed(feedData);
    return await newFeed.save();
}

module.exports = {
    getFeeds,
    postFeed
}