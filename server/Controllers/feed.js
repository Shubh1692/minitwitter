const Feed = require('../Models/feed');
/**
 * @name getFeeds
 * @description
 * This method used to get feed from data base
 * @param filterObject mongoose filter object
 * @returns {db response}
*/
const getFeeds = async (filterObject) => {
    const feeds = await Feed.find(filterObject, );
    return feeds;
}

/**
 * @name postFeed
 * @description
 * This method used to post new feed in data base
 * @param feedData feed mongo document object
 * @returns {db response}
*/
const postFeed = async (feedData) => {
    const newFeed = new Feed(feedData);
    return await newFeed.save();
}

module.exports = {
    getFeeds,
    postFeed
}