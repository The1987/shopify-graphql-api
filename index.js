import express from "express";
import "dotenv/config";
import { createGraphQLHandler } from "app.js";

var app = express()

dotenv.config();

app.all("/graphql", createGraphQLHandler())

app.listen(4000, () => {
  console.log("Running a GraphQL API server at http://localhost:4000/graphql")
})
