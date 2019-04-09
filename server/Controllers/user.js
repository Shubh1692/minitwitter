const User = require('../Models/user');
const getUserDetail = async (filterObject) => {
    const users = await User.find(filterObject);
    return users;
}

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