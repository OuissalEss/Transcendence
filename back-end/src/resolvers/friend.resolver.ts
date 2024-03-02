import {Query, Resolver, Mutation} from "@nestjs/graphql";
import {Friend} from "../entities/friend.entity";
import {FriendService} from "../services/friend.service";

@Resolver(of => Friend)
export class FriendResolver {
    constructor(private readonly friendService: FriendService) {}
    
    @Query(() => [Friend], {
        name: "getAllFriends",
        description: "Retrieves all friends with their associated data"
    })
    getAllFriends(): Promise<Friend[]> {
        return this.friendService.getAllFriends();
    }
    
    @Query(() => Friend, {
        name: "getFriendById",
        description: "Retrieves friend with their associated id"
    })
    getFriendById(friendId: string): Promise<Friend> {
        return this.friendService.getFriendById(friendId);
    }
    
    @Mutation(() => Friend, {
        name: "deleteFriend",
        description: "Delete friend with their associated id"
    })
    deleteFriend(friendId: string): Promise<Friend> {
        return this.friendService.deleteFriend(friendId);
    }
}