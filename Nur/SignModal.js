const express = require("express");
const router = express.Router();

module.exports = (usersCollection) => {
  router.get("/users", async (req, res) => {
    const cursor = usersCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  });

  router.get("/user/:email", async (req, res) => {
    const { email } = req.params;
    console.log(req.params);

    console.log(email);

    const query = { email: email };
    console.log(query);

    try {
      const user = await usersCollection.findOne(query);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.post("/users", async (req, res) => {
    const user = req.body;
    console.log(user);
    const query = { email: user.email };

    const existingUser = await usersCollection.findOne(query);
    if (existingUser) {
      return res.send({
        message: "user already exists",
        insertedId: null,
      });
    }
    const result = await usersCollection.insertOne(user);
    res.send(result);
    console.log(result);
  });

  router.put("/users/:email", async (req, res) => {
    const email = req.params.email;
    console.log(email);

    const userData = req.body;
    const query = { email: email };
    const update = {
      $set: userData,
    };
    const result = await usersCollection.updateOne(query, update);
    if (result.modifiedCount > 0) {
      res.send({ message: "User updated successfully", result });
    } else {
      res.send({ message: "No changes made to the user", result });
    }
  });

  return router;
};
