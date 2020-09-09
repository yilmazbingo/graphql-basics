//  @babel/preset-env allows us to use "import-export"
import { GraphQLServer,PubSub } from 'graphql-yoga'
import db from "./db"
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";
import Subscription from "./resolvers/Subscription"

// we have to pass this to all of the resolvers so they can subscribe
const pubsub=new PubSub()

const server = new GraphQLServer({
    // path is relative to the root of the app
    typeDefs:"./src/schema.graphql",
    resolvers: { Query, Mutation, Post, Comment, User, Subscription },
    // this will be passed to the "ctx" arg
    // "ctx" is where shared data is stored
    context:{db,pubsub}
})

// default port is 4000
server.start(() => {
    console.log('The server is up!')
})