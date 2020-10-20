import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {HelloResolver} from "./resolvers/hello";
import "reflect-metadata";
import {PostResolver} from "./resolvers/post";


const main = async () => {

    const orm = await MikroORM.init(microConfig);

    // run migration
    await orm.getMigrator().up();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                HelloResolver,
                PostResolver,
            ],
            validate: false
        }),
        context: () => ({ em: orm.em })
    });

    const app = express();
    apolloServer.applyMiddleware({ app })
    // app.get("/", (_, res) => { res.send("Hello")});

    app.listen(4000, () => {
        console.log('Server started on localhost:4000')
    });
    // const post = orm.em.create(Post, { title: "my first post" });
    // await orm.em.persistAndFlush(post);

    // const posts = await orm.em.find(Post, {});
    // console.log(posts);
};

main().catch((err) => {
    console.error(err);
});
