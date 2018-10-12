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

var temp = []
var count = 0
var i = 0
const subscribe = async () => {

    console.log('hi subscribe 1')
    let arr = [1,2,3,4,5,6,7,8,9]
    await util.asyncForEach(arr, async (el) => {
        sub.psubscribe(`follow_tag:${el}*`)
    })
    
    sub.on('pmessage', (pattern, channel, message) => {
        
        const obj = JSON.parse(message)
        console.log("=================================================")
        console.log(obj)
        console.log("=================================================")
        temp.push(['zincrby', channel, 1, obj.tag_name])
        count++
        
        //if (count % 2 == 0) {
        if(temp.length == 2){
            i++
            console.log("case1")
            //sub.pipeline(temp).exec()
            console.log(temp)
            temp = []
        }
        
        
        console.log(count , `push : ${i}`)
        console.log('arr',temp.length)
        
    })

    
  
        
   
   
    
}

/*const subscribe = async () => {

    //console.log('hi subscribe')
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    await util.asyncForEach(arr, async (el) => {
        await sub.psubscribe(`follow_tag:${el}*`);
    })
    sub.on('pmessage', (pattern, channel, message) => {
        let result = []
        //console.log('pub1',channel, JSON.parse(message))
        const obj = JSON.parse(message)

        //console.log(channel,obj.tags)
        obj.tags.forEach((tag) => {
            //console.log(channel,tag)
            result.push(['zincrby', channel, 1, tag])
        })

        //console.log(result)
        sub.pipeline(result).exec()
    });

}*/

/*const subscribe = async () => {

    //console.log('hi subscribe 1')
    let arr = [1, 2, 3]
    arr.forEach(el => {
        sub.psubscribe(`follow_tag:${el}*`);
    });
    sub.on('pmessage', (pattern, channel, message) => {
        let temp = []
        const obj = JSON.parse(message)
        //console.log(channel,obj)

        sub.zincrby(channel, 1, obj.tag_name)
        sub.pipeline([
            ['zincrby',channel, 1, obj.tag_name]
        ]).exec()

    })
}*/

subscribe()
