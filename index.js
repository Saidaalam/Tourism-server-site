require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xxaftzm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });

    const touristCollection = client.db('touristDB').collection('tourist');
    const countryCollection = client.db('touristDB').collection('country');

    app.get('/addedSpot', async(req, res) => {
      const cursor = touristCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/country', async(req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

     app.get('/addedSpot/:email', async(req, res) => {
      console.log(req.params.email);
      const result = await touristCollection.find({email: req.params.email}).toArray();
      res.send(result);
    })

    app.delete('/addedSpot/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristCollection.deleteOne(query);
      res.send(result);
    });

    app.get('/updatedSpot/:id', async(req, res) => {
      console.log(req.params.id);
      const result = await touristCollection.findOne({
        _id : new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    })

    app.put('/updatedSpot/:id', async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          name: req.body.name,
          country: req.body.country,
          spot: req.body.spot,
          cost: req.body.cost,
          time: req.body.time,
          season: req.body.season,
          tourist: req.body.tourist,
          description: req.body.description,
          image: req.body.image,
        }
      };
    
      delete data.$set.email;
    
      const result = await touristCollection.updateOne(query, data);
      console.log(result);
      res.send(result);
    });
    
    app.post("/addedSpot", async(req, res) => {
      const newTourist = req.body;
      console.log(newTourist);
      const result = await touristCollection.insertOne(newTourist);
      res.send(result);
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Let's go on an amusing tour!");
});

app.listen(port, () => {
  console.log(`Tourism started at http://localhost:${port}`);
});
