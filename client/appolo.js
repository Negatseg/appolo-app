import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Your server endpoint
  cache: new InMemoryCache(),
});

// Wrap your main component with ApolloProvider
const App = () => (
// <ApolloProvider client={client}>
    //{/* Your main component */}
    ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
));
  //{/* </ApolloProvider>

// ...


// src/index.js
//import React from 'react';
//import ReactDOM from 'react-dom';
//import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
//import App from './App';

// Create Apollo Client instance
// const client = new ApolloClient({
//   uri: 'http://localhost:4000', // Replace with your server URL
//   cache: new InMemoryCache(),
// });

// Wrap your app with ApolloProvider
// ReactDOM.render(
//   <ApolloProvider client={client}>
//     <App />
//   </ApolloProvider>,
//   document.getElementById('root')
// );

// src/App.js
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const SEARCH_BOOKS = gql`
  query SearchBooks($searchTerm: String) {
    books(searchTerm: $searchTerm) {
      id
      title
      author
      description
      image
      link
    }
  }
`;

// Define other GraphQL queries and mutations as needed

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, error, data } = useQuery(SEARCH_BOOKS, {
    variables: { searchTerm },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search for books"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button>Search</button>

      {/* Display search results */}
      {data.books.map(book => (
        <div key={book.id}>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          <p>{book.description}</p>
          <img src={book.image} alt={book.title} />
          <a href={book.link} target="_blank" rel="noopener noreferrer">
            View on Google Books
          </a>
          <button>Save</button>
        </div>
      ))}
    </div>
  );
}

export default App;


// server.js
const { ApolloServer, gql } = require('apollo-server');

// Sample data (replace this with your actual data source)
const books = [
  { id: '1', title: 'Book 1', author: 'Author 1', description: 'Description 1', image: 'image1.jpg', link: 'https://books.google.com/book1' },
  // Add more books as needed
];

const users = [];

// GraphQL schema
const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    description: String!
    image: String!
    link: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]!
  }

  type Query {
    books(searchTerm: String): [Book]
    user(id: ID!): User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
    loginUser(email: String!, password: String!): User
    saveBook(userId: ID!, bookId: ID!): User
    removeBook(userId: ID!, bookId: ID!): User
  }
`;

// Resolvers
const resolvers = {
  Query: {
    books: (parent, { searchTerm }) => {
      // Implement book search logic based on searchTerm
      // For simplicity, returning all books if no search term provided
      return searchTerm ? books.filter(book => book.title.includes(searchTerm)) : books;
    },
    user: (parent, { id }) => {
      return users.find(user => user.id === id);
    },
  },
  Mutation: {
    createUser: (parent, { username, email, password }) => {
      const newUser = { id: String(users.length + 1), username, email, password, savedBooks: [] };
      users.push(newUser);
      return newUser;
    },
    loginUser: (parent, { email, password }) => {
      return users.find(user => user.email === email && user.password === password);
    },
    saveBook: (parent, { userId, bookId }) => {
      const user = users.find(user => user.id === userId);
      const book = books.find(book => book.id === bookId);
      if (user && book) {
        user.savedBooks.push(book);
      }
      return user;
    },
    removeBook: (parent, { userId, bookId }) => {
      const user = users.find(user => user.id === userId);
      if (user) {
        user.savedBooks = user.savedBooks.filter(book => book.id !== bookId);
      }
      return user;
    },
  },
};

// Create Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server
server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});

