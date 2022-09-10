import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

let tweets = [
  {
    id: "1",
    text: "hello1",
    userId: "1",
  },
  {
    id: "2",
    text: "hello2",
    userId: "2",
  },
  {
    id: "3",
    text: "hello3",
    userId: "3",
  },
  {
    id: "4",
    text: "hello4",
    userId: "4",
  },
];

let users = [
  {
    id: "1",
    username: "tesla owner",
    firstname: "elon",
    lastname: "musk",
  },
  {
    id: "2",
    username: "whdgus003",
    firstname: "jonghyeon",
    lastname: "park",
  },
  {
    id: "3",
    username: "nico112",
    firstname: "nomad",
    lastname: "xoder",
  },
  {
    id: "4",
    username: "whqnd22",
    firstname: "woojung",
    lastname: "kim",
  },
];

const typeDefs = gql`
  type User {
    id: ID
    username: String!
    firstname: String!
    lastname: String!
    """
    sum of firstName & lastName as String
    """
    fullname: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }
  type Query {
    allMovies: [Movie!]!
    movie(id: String!): Movie!
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID): Tweet
    ping: String
  }
  type Mutation {
    """
    add a tweet
    """
    postTweet(text: String!, userId: ID!): Tweet
    """
    Deletes a Tweet if found and return true, else return false
    """
    deleteTweet(id: ID): Boolean
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String!
    yt_trailer_code: String!
    language: String!
    mpa_rating: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;

const resolvers = {
  Query: {
    allUsers() {
      return users;
    },
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    ping() {
      return "pong";
    },
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((res) => res.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((res) => res.json())
        .then((json) => json.data.movie);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        userId,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullname(root) {
      console.log(root);
      return root.firstname + root.lastname;
    },
  },
  Tweet: {
    author(root) {
      return users.find((user) => user.id === root.userId);
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
