const express = require("express");
const router = express.Router();
const _ = require('underscore');
let result = { success: false }
// Models
const model = require('../models/publishTags')

router.get('/kong', async (req, res) => {

    //model.test()
    res.json({a:1})
});

router.post('/followTag', async (req, res)=>{
    const { topic_id , mid , tags } = req.body
    //console.log( req.body)
    model.publishFollowTags(mid,topic_id , tags)
    res.json({ success: true })
})

module.exports = router;