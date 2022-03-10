const keys = require('./keys')

//express app setup
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
//cross origin resource sourcesing, allows to share between different domains/port
app.use(cors())
//parses incoming request from the react app and convert the body of the request into json value
app.use(bodyParser.json())

//Postgress client setup
const { Pool } = require('pg')
//const { pgHost } = require('./keys')
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})


//pg holds only the indices and not the values

pgClient.on("connect",(client)=>{
    client
        .query('CREATE TABLE IF NOT EXISTS values (number INT)')
        .catch(err => console.log(err))
})


//Redis client setup
const redis = require('redis')
const { response } = require('express')
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    // tells the redis client to connect here and if the connection is lost then connect back in 1 ms
    retry_strategy: () => 1000
})

//making the duplicate is the redis requirement to work with js
const redisPublisher = redisClient.duplicate()

//Express route handlers

app.get('/',(req,res)=>{
    res.send("Hi")
})

//retrieve all the values ever been submitted to pg
app.get('/values/all', async (req,res)=>{
    const values = await pgClient.query('SELECT * from values')
    res.send(values.rows)
})

//redis doesn't support promises
app.get('/values/current', async (req,res)=>{
    redisClient.hgetall('values',(err,values)=>{
        res.send(values)
    })
})

app.post('/values', async (req,res)=>{
    const index = req.body.index
    if(parseInt(index)>40){
        return res.status(422).send('Index too high')
    }
    //telling that the new inex doesn't have any fib value yet
    redisClient.hset('values',index,'Nothing yet')
    redisPublisher.publish('insert',index)
    console.log("index" + index)
    pgClient.query('INSERT INTO values(number) VALUES($1)',[index])

    res.send({working: true})
})

app.listen(5000,err => {
    console.log('Listening')
})
