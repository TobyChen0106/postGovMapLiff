const fs = require('fs')
const PostOffice = require('../src/models/PostOffice');
const mongoose = require('mongoose');
const dbName = "dbCardbo"
const usrName = "cardbo"
const usrPswd = "69541"
mongoURL = `mongodb+srv://${usrName}:${usrPswd}@cardbo-br3ga.gcp.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(mongoURL, { useNewUrlParser: true });
db = mongoose.connection;
db.on('error', e => {
    console.log(e);
})
db.once('open', () => {
    console.log('MongoDB connected!');
})

const file_path = "./PostData.json";

// var json = require('./o.PostData.json'); 
// console.log(json.length)
// for (var i = 0; i < json.length; ++i) {
//     json[i].nowCalling = 0;
//     json[i].nowWaiting = 0;
//     var newData = new PostOffice(json[i])
//     newData.save().catch(err=).then(console.log(i))
// }
// PostOffice.deleteMany({}, (err, data) => {
//     if (err) {
//         console.log(err);
//     }
//     else if (!data) {
//         console.log("[ERROR] EMPTY DATA!");
//     } else {

//     }
// })

PostOffice.find({}, (err, data) => {
    if (err) {
        console.log(err);
    }
    else if (!data) {
        console.log("[ERROR] EMPTY DATA!");
    } else {
        console.log(data.length)
        for (var i = 0; i < data.length; ++i) {
            data[i].total = -1;
            data[i].nowCalling = -1;
            data[i].nowWaiting = -1;
        }
        fs.writeFile(file_path, JSON.stringify(data), 'utf8', () => console.log(`successfully dump offer to ${file_path}`))
    }
})