const keys = require('./keys')
const redis = require('redis')

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    // tells the redis client to connect here and if the connection is lost then connect back in 1 ms
    retry_strategy: () => 1000
})
// make a duplicate of the redisClient
const sub = redisClient.duplicate();

//This function is run everytime a new index comes from redis
function fib(index){
    if(index < 2) return 1;
    return fib(index-1) + fib(index-2)
}

//this is called everytime a new value comes
sub.on('message',(channel,message)=>{
    console.log(fib(parseInt(message)))
    redisClient.hset('values',message, fib(parseInt(message)))
})

// inserts the new value into redis
sub.subscribe('insert');
