const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const app = express();

// Your GraphQL schema
const typeDefs = gql`
  type Query {
    // Define your queries here
  }

  type Mutation {
    // Define your mutations here
  }
`;

// Your resolvers
const resolvers = {
  // Implement your resolvers here
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);



// Import your authentication middleware
const authenticate = require('./middleware/authenticate');

// ...

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({ req }) => {
//     // Pass the request and authentication information to the context
//     const user = authenticate(req);
//     return { user };
//   },
//});

// ...
