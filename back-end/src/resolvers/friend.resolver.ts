import { Query, Resolver, Mutation, Context } from "@nestjs/graphql";
import { Friend } from "../entities/friend.entity";
import { FriendService } from "../services/friend.service";
import { Payload } from "src/services/types/auth.service";
import { User } from "src/entities/user.entity";

@Resolver(of => Friend)
export class FriendResolver {
    constructor(private readonly friendService: FriendService) { }

    @Query(() => [Friend], {
        name: "getAllFriends",
        description: "Retrieves all friends with their associated data"
    })
    getAllFriends(): Promise<Friend[]> {
        return this.friendService.getAllFriends();
    }


    @Query(() => [User], {
        name: "getUserFriends",
        description: "Retrieves all friends with their associated data"
    })
    async getUserFriends(@Context() context: { req }): Promise<User[]> {
        const payload: Payload = context.req['user'];

        const friendList: User[] = await this.friendService.getFriendList(payload.sub);
        return friendList;
    }

    @Query(() => Friend, {
        name: "getFriendById",
        description: "Retrieves friend with their associated id"
    })
    getFriendById(friendId: string): Promise<Friend> {
        return this.friendService.getFriendById(friendId);
    }

    // @Mutation(() => Friend, {
    //     name: "deleteFriend",
    //     description: "Delete friend with their associated id"
    // })
    // deleteFriend(friendId: string): Promise<Friend> {
    //     return this.friendService.deleteFriend(friendId);
    // }
}