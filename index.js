const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qlhnchw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
      const volunteerCollection = client.db('volunteer').collection('services');
      const registerCollection = client.db('volunteer').collection('registers')

      app.get('/services', async(req, res) => {
        const query = {};
        const cursor = volunteerCollection.find(query);
        const services = await cursor.toArray();
        res.send(services)
      })

      app.get('/services/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const services = await volunteerCollection.findOne(query);
        res.send(services)
      })

      app.post('/registers', async(req, res)=>{
        const register = req.body;
        const result = await registerCollection.insertOne(register);
        res.send(result)
      })

      app.get('/registers', async(req, res)=>{
        let query = {};
        if(req.query.email){
          query={
            email: req.query.email
          }
        }
        const cursor = registerCollection.find(query);
        const registers = await cursor.toArray();
        res.send(registers)
      })

      app.delete('/registers/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await registerCollection.deleteOne(query);
        res.send(result)
      })

      app.patch('/registers/:id', async(req, res)=>{
        const id = req.params.id;
        const status = req.body.status;
        const query = {_id: ObjectId(id)};
        const updatedDoc = {
          $set: {
            status: status
          }
        }
        const result = await registerCollection.updateOne(query, updatedDoc);
        res.send(result)
      })

      
    } finally {
      
    }
  }
  run().catch(err=> console.error(err));


//Primary step
app.get('/', (req, res) =>{
    res.send('server is running')
})

app.listen(port, (req, res) =>{
    console.log(`server is running on port ${port}`)
})