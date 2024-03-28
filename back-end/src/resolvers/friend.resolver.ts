import { Query, Resolver, Mutation, Context, Args } from "@nestjs/graphql";
import { Friend } from "../entities/friend.entity";
import { FriendService } from "../services/friend.service";
import { Payload } from "src/services/types/auth.service";
import { User } from "src/entities/user.entity";
import { CreateFriendInput } from "src/services/dto/create-friend.input";
import { ForbiddenError } from "@nestjs/apollo";

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

    @Query(() => [Friend], {
        name: "getUserFriendsSender",
        description: "Retrieves all friends where the user is the sender"
    })
    async getUserFriendsSender(@Context() context: { req }): Promise<Friend[]> {
        const payload: Payload = context.req['user'];

        const friendList: Friend[] = await this.friendService.getFriendSender(payload.sub);
        return friendList;
    }

    @Query(() => [Friend], {
        name: "getUserFriendsReceiver",
        description: "Retrieves all friends where the user is the receiver"
    })
    async getUserFriendsReceiver(@Context() context: { req }): Promise<Friend[]> {
        const payload: Payload = context.req['user'];

        const friendList: Friend[] = await this.friendService.getFriendReceiver(payload.sub);
        return friendList;
    }

    @Query(() => Friend, {
        name: "getFriendById",
        description: "Retrieves friend with their associated id"
    })
    getFriendById(@Args('friendId') friendId: string): Promise<Friend> {
        return this.friendService.getFriendById(friendId);
    }

    @Mutation(() => Friend, {
        name: "updateAccept",
        description: "update friend with their associated id"
    })
    updateAccept(@Args('friendId') friendId: string, @Context() context: { req }): Promise<Friend> {
        const payload: Payload = context.req['user'];

        return this.friendService.updateAccept(payload.sub, friendId);
    }

    @Mutation(() => Friend, {
        name: "createFriend",
        description: "create friend with their associated id"
    })
    createFriend(@Args('receiverId') receiverId: string, @Args('senderId') senderId: string, @Context() context: { req }): Promise<Friend> {
        const payload: Payload = context.req['user'];
        if (payload.sub != senderId && payload.sub != receiverId)
            throw new ForbiddenError('You dont have permission to create friendship');
        const data: CreateFriendInput = {
            senderId: senderId,
            receiverId: receiverId,
            isAccepted: false,
        };
        return this.friendService.createFriend(data);
    }

    @Mutation(() => Friend, {
        name: "deleteFriend",
        description: "Delete friend with their associated id"
    })
    deleteFriend(@Args('friendId') id: string, @Context() context: { req }): Promise<Friend> {
        const payload: Payload = context.req['user'];

        return this.friendService.deleteFriend(payload.sub, id);
    }
}