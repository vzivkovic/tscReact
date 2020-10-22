import {Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver} from "type-graphql";
import {MyContext} from "../types";
import {User} from "../entities/User";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput{
    @Field()
    username: string
    @Field()
    password:string
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {

    @Mutation(() => User)
    async registration(
        @Arg("inputData") inputData: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<User | null> {

        const hashedPass = await argon2.hash(inputData.password);

        const user = em.create(User,  {
            username: inputData.username,
            password: hashedPass
        });

        await em.persistAndFlush(user);

        return user;
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("inputData") inputData: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {

        const user = await em.findOne(User,  {
            username: inputData.username,
        });

        if (!user) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "that username doesn't exist",
                    },
                ],
            };
        }

        const valid = await argon2.verify(user.password, inputData.password);

        if (!valid){
            return {
                errors: [
                    {
                        field: "password",
                        message: "incorrect password",
                    },
                ],
            };
        }

        return {user};
    }
}
