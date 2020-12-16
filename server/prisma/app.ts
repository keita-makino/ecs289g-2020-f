import { ApolloServer } from "apollo-server";
import { schema } from "./schema";
import { createContext } from "./context";

new ApolloServer({ schema, context: createContext }).listen(
  process.env.PORT || 4000
);

console.log(`server is ready at localhost:4000`);
