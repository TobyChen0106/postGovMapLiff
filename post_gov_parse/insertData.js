const PostOffice = require('./models/PostOffice');
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

const PostData = require('./PostData.json')

// for (var i = 0; i < PostData.length; ++i) {
//     const d = new Date();
//     const s = d.toISOString();

//     var new_data = new PostOffice(PostData[i]);
    
//     new_data.waitingUpdateTime = s;
//     new_data.postDataUpdateTime = s;

//     db.collection("postoffices").insertOne(new_data, function (err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//     })
// }



PostOffice.find({}, (err, data) => {
    if (err) {
        console.log(err);
    }
    else if (!data) {
        console.log("[ERROR] EMPTY DATA!");
    } else {
        var i;
        for (i = 0; i < data.length; ++i) {
            console.log(data[i]);
        }
        console.log(i)
    }
})