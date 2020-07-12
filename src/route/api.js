const express = require("express");
const router = express.Router();
const PostOffice = require('../models/PostOffice');
const User = require('../models/User');

router.post('/append-comment-id/:id', (req, res) => {
    // const id = req.params.id;
    // PostOffice.findOne({ offerID: id }, (err, data) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else if (!data) {
    //         var new_comment = new Comment({ offerID: id });
    //         new_comment.comments.push(req.body.new_comments);
    //         new_comment.save().then(() => {
    //             res.json("Comment Data appended!");
    //         }).catch(function (error) {
    //             console.log("[Error] " + error);
    //         })
    //     }
    //     else {
    //         data.comments.push(req.body.new_comments)
    //         data.save().then(() => {
    //             res.json("Comment Data appended!");
    //         }).catch(function (error) {
    //             console.log("[Error] " + error);
    //         })
    //     }
    // })
});

router.get('/getData', (req, res) => {
    PostOffice.find({}, (err, data) => {
        if (err) {
            console.log(err);
        }
        else if (!data) {
            console.log("[ERROR] <get-comment-id> DATA NOT FOUND!");
            res.json(null);
        }
        else {
            res.json(data);
        }
    })
});

router.get('/check-user', (req, res) => {
    const id = req.params.id;
    User.findOne({ lineID: id }, (err, data) => {
        if (err) {
            console.log(err);
        }
        else if (!data) {
            console.log("[ERROR] <get-comment-id> DATA NOT FOUND!");
            res.json(null);
        }
        else {
            res.json(data);
        }
    })
});

module.exports = router;