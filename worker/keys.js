// THE below keys is for the connection to the redis server from the worker dir/index.js
module.exports = {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT
}