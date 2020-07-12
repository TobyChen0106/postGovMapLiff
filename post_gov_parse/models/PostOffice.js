const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostOfficeSchema = new Schema({
    hsnCd: {
        type: String,
    },
    hsnNm: {
        type: String,
    },
    townCd: {
        type: String,
    },
    townNm: {
        type: String,
    },
    storeCd: {
        type: String,
    },
    storeNm: {
        type: String,
    },
    addr: {
        type: String,
    },
    zipCd: {
        type: String,
    },
    tel: {
        type: String,
    },
    busiTime: {
        type: String,
    },
    busiMemo: {
        type: String,
    },
    longitude: {
        type: String,
    },
    latitude: {
        type: String,
    },
    total: {
        type: String,
    },
    waitingUpdateTime: {
        type: String,
    },
    postDataUpdateTime: {
        type: String,
    }
})

const PostOffice = mongoose.model('postoffice', PostOfficeSchema, "postoffices");
module.exports = PostOffice;