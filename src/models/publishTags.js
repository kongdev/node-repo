const config = require('config');

// Redis
const redis = require('ioredis')
const rediscluster = config.rediscluster
const client = new redis.Cluster(rediscluster)
const pub = new redis.Cluster(rediscluster)

// Util
const util = require('../helper/util')

// MongoDB
const { url, port, dbname } = config.mongodb
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const connectDB = async () => {
  
    return await MongoClient.connect(`mongodb://${url}:${port}`, { useNewUrlParser: true });
}

exports.publishFollowTags = async (owner_id, topic_id, tags) => {

    const m = await connectDB()
    const db = m.db(dbname)

    await util.asyncForEach(tags, async (name) => {

        const tf = await db.collection('tag_followers').find({ name_lower: name }).sort({ total: 1 }).map((v) => {
            return {
                mid: v.mid,
                name: v.name_lower,
                total: v.total
            }
        }).toArray()


        await util.asyncForEach(tf, async (objFollowers) => {

            await util.asyncForEach(objFollowers.mid, async (mid) => {
                var pipeline = pub.pipeline();
                pipeline.publish(`follow_tag:${mid}`, topic_id).exec().then((result) => {
                    console.log(result)
                });

                if(owner_id != mid){
                    const obj = { mid: mid, topic_id: topic_id, tag_name: name };
                    await pub.publish(`follow_tag:${mid}`, JSON.stringify(obj));
                   
                }   
            })
        })
    })
    m.close()
}

exports.test = () => {
    //client.publish('follow_tag:45', 'Hello world!');
}
