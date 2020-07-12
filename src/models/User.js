const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserActionSchema = new Schema({
    lineID: {
        type: String,
        required: true,
    },
    userImage: {
        type: String,
    },
    displayName: {
        type: String,
    },
    actions: {
        type: [String],
    }
})

const UserAction = mongoose.model('UserAction', UserActionSchema, "useractions");
module.exports = UserAction;