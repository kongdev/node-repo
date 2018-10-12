
// Lib 
const express = require("express");
const router = express.Router();
const _ = require('underscore');
let result = { success: false }
// Models
const model = require('../models/followTags')

router.post('/readTag', async (req, res) => {
    const { mid, tag_name } = req.body
    

    if (await model.readTag(mid, tag_name) > 0) {
        result = { success: true }
    }
    res.json(result)
})


router.get('/:id/tags', async (req, res) => {

    let id = parseInt(req.params.id);
    const {limit} = req.query
   
    let size = (limit !== undefined) ? parseInt(limit) :20
    
    let result = []
    let redis = await model.getRedisFollowTag(id)
    let lists = _.groupBy(redis, (a, b) => Math.floor(b / 2))

    let a = await model.getMyFollowTags(id, size)

    let b = await model.getTagsDirectory(a)
    b.forEach((data) => {

        _.toArray(lists).forEach(redis => {
            if (data.name_lower === redis[0]) {

                data = { ...data, unread: parseInt(redis[1]) }
            }
        })
        result.push(data)
    })
    res.json(result)

})


module.exports = router;