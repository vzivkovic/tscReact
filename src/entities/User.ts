import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";

@ObjectType() // object type gql
@Entity() // entity db
export class User {

  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String ) // gql field
  @Property({ type: "date" }) // db field
  createdAt = new Date();

  @Field(() => String )
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text", unique:true })
  username!: string;

  @Property({ type: "text" })
  password!: string;

}
