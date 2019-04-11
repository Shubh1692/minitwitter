const User = require('../Models/user');
/**
 * @name getUserDetail
 * @description
 * This method used to get users data from data base
 * @param filterObject mongoose filter object
 * @returns {db response}
*/

const getUserDetail = async (filterObject) => {
    const users = await User.find(filterObject);
    return users;
}

/**
 * @name subscribeUnsubscribeUser
 * @description
 * This method used to subscribe or unsubscribe user for a user
 * @param userId logged in user id
 * @param subScribeUser subscribe or unsubscribe user id 
 * @returns {db response}
*/
const subscribeUnsubscribeUser = async ({
    userId,
    subScribeUser
}) => {
    const findSubScribeUser = await User.findOne({
        _id: userId,
        'subscribe_users': { $ne: subScribeUser }
    });
    if (findSubScribeUser) {
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $push: {
                subscribe_users: subScribeUser
            }
        }, {
            new: true
        });
        return updatedUser
    }
    const updatedUser = await User.findByIdAndUpdate(userId, {
        $pull: {
            subscribe_users: subScribeUser
        }
    }, {
        new: true
    });
    return updatedUser;
}
module.exports = {
    getUserDetail,
    subscribeUnsubscribeUser
}