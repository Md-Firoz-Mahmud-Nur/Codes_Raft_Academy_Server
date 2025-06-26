const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const axios = require("axios");

// Middleware
app.use(
  cors()
  //   {
  //   origin: ["http://localhost:5173"],
  //   credentials: true,
  // }
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_SECRET_KEY}@cluster0.${process.env.MONGO_DB_URI_SECRET_KEY}.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // database collection

    const academyCodesRaft = client.db("academyCodesRaft");
    const usersCollection = academyCodesRaft.collection("users");
    const adminPaymentNumberCollection =
      academyCodesRaft.collection("adminPaymentNumber");
    const enrollmentsCollection = academyCodesRaft.collection("enrollments");

    // Import Route

    const SignModal = require("./Nur/SignModal")(usersCollection);
    const Form = require("./Nur/Form/Form")(adminPaymentNumberCollection);
    const Enrollments = require("./Nur/Enrollments/Enrollments")(
      enrollmentsCollection,
      axios
    );

    // Use Route

    app.use(SignModal);
    app.use(Form);
    app.use(Enrollments);

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Codes_Raft_Academy_Server");
});

app.listen(port, () => {
  console.log(`Codes_Raft_Academy_Server listening on port ${port}`);
});
