const config = require('config');

// Redis
const redis = require('ioredis')
const rediscluster = config.rediscluster
const client = new redis.Cluster(rediscluster)


// Util
const util = require('../helper/util')

// MongoDB
const { url, port, dbname } = config.mongodb
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const connectDB = async () => {
    //const m = await MongoClient.connect(`mongodb://${url}:${port}`, { useNewUrlParser: true });
    //return m.db(dbname);
    return await MongoClient.connect(`mongodb://${url}:${port}`, { useNewUrlParser: true });
}

exports.readTag = (id, tagname) => {
    return client.zrem(`follow_tag:${id}`, tagname)
}

exports.readTopic = (id , tags) =>{
    /*tags.foreach((name)=>{
        client.zrem(`follow_tag:${id}`, name)
    })*/
}

exports.getRedisFollowTag = (id) => {
    return client.zrange(`follow_tag:${id}`, 0, -1, 'WITHSCORES')
}

exports.getMyFollowTags = async (id, size) => {

    const m = await connectDB()
    const db = m.db(dbname)
    const result = await db.collection('my_follow_tag').find({ mid: id }).sort({ created_time: -1 }).limit(size).map((v) => {
        return {
            mid: v.mid,
            name: v.name_lower
        }
    }).toArray()

    m.close()
    
    return result
}


exports.getTagsDirectory = async (data) => {

    const m = await connectDB()
    const db = m.db(dbname)

    let arr = []
    await util.asyncForEach(data, async ({ mid, name }) => {
        //console.log(name)
        const td = await db.collection('tag_directory').findOne({ name_lower: name })
        if (td) {
            arr.push({
                mid: mid,
                name: td.name,
                name_lower: td.name_lower,
                unread: 0,
                total_cnt: td.total_count,
                follow_cnt: td.follow_count
            })
        }

    })
    m.close()
    return arr
}

