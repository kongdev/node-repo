const config = require('config')

// Redis
const redis = require('ioredis')
const rediscluster = config.rediscluster
const sub = new redis.Cluster(rediscluster)


// Util
const util = require('./helper/util')

// MongoDB
const { url, port, dbname } = config.mongodb
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const connectDB = async () => {
    const m = await MongoClient.connect(`mongodb://${url}:${port}`, { useNewUrlParser: true });
    return m.db(dbname);
}

const subscribe = async () => {

    //console.log('hi subscribe 1')
    let arr = [4, 5, 6]
    arr.forEach(el => {
        sub.psubscribe(`follow_tag:${el}*`);
    });
    sub.on('pmessage', (pattern, channel, message) => {
        let temp = []
        const obj = JSON.parse(message)
        //console.log(channel,obj)

        sub.pipeline([
            ['zincrby', channel, 1, obj.tag_name]
        ]).exec()

    })
}

subscribe()
