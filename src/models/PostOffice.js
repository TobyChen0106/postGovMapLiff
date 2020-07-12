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
    s_nowCalling: {
        type: Number,
    },
    s_nowWaiting: {
        type: Number,
    },
    p_nowCalling: {
        type: Number,
    },
    p_nowWaiting: {
        type: Number,
    },
    s_waitingUpdateTime: {
        type: String,
    },
    p_waitingUpdateTime: {
        type: String,
    },
    postDataUpdateTime: {
        type: String,
    },

    total: {
        type: Number,
    },
    number_plate_total:{
        type: Number,
    },
    number_plate_now:{
        type: Number,
    },
    number_plate_updateTime:{
        type: String,
    },
})

const PostOffice = mongoose.model('postoffice', PostOfficeSchema, "postoffices");
module.exports = PostOffice;