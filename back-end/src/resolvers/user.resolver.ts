// user.resolver.ts

import { Resolver, Query, Args, Mutation, Context, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from 'src/services/user.service';
import { User } from 'src/entities/user.entity';
import { UpdateUserInput } from "../services/dto/update-user.input";
import { NotFoundException, Req } from "@nestjs/common";
import { Status, Character, Avatar } from '@prisma/client'; // Import the Prisma-generated Status enum
import { Request } from 'express';
import { Payload } from 'src/services/types/auth.service';
import { BlockService } from 'src/services/block.service';
import { Block } from 'src/entities/block.entity';

@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly block: BlockService
  ) { }

  @Query(() => [User], {
    name: "getAllUsers",
    description: "Retrieves all users with their associated data",
  })
  
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Query(() => User, {
    name: "getUserInfo",
    description: "Retrieves authenticated user information"
  })
  async getUserInfo(@Context() context: { req }): Promise<User> {
    const payload: Payload = context.req['user'];
    return this.userService.getUserById(payload.sub);
  }

  @Query(() => User, {
    name: "getUserById",
    description: "Retrieves a specific user with it's id"
  })
  async getUserById(@Args('id') id: string, @Context() context: { req }): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Query(() => [User], {
		name: 'searchUsers',
		description: 'Searches for users based on the provided query',
	})
	async searchUsers(
		@Args({ name: 'query', type: () => String }) query: string
	): Promise<User[]> {
		// Assuming userService.searchUsers(query) searches for users based on the provided query
		return this.userService.searchUsers(query);
	}

  @Mutation(() => User)
  async updateUsername(
    @Args('username') updatedUsername: string,
    @Context() context: { req }
  ): Promise<User> {
    const payload: Payload = context.req['user'];
    const userId = payload.sub;
    const userObject = await this.userService.getUserById(userId);
  
    if (!userObject) {
      throw new NotFoundException("User doesn't exist");
    }
  
    // Assuming your `updateUser` function in the service performs validation
    return this.userService.updateUsername(userId, updatedUsername);
  }
  
  @Mutation(() => User)
  async updateFirstName(
      @Context() context: { req },
    @Args('firstname') updateUserFirstName: string,
  ): Promise<User> {
    const payload: Payload = context.req['user'];
    const userId = payload.sub;
    const userObject = await this.userService.getUserById(userId);
  
    if (!userObject) {
      throw new NotFoundException("User doesn't exist");
    }
  
    // Assuming your `updateUser` function in the service performs validation
    return this.userService.updateFirstName(userId, updateUserFirstName);
  }
  
  @Mutation(() => User)
  async updateLastName(
      @Context() context: { req },
    @Args('firstname') updateUserLastName: string,
  ): Promise<User> {
    const payload: Payload = context.req['user'];
    const userId = payload.sub;
    const userObject = await this.userService.getUserById(userId);
  
    if (!userObject) {
      throw new NotFoundException("User doesn't exist");
    }
  
    // Assuming your `updateUser` function in the service performs validation
    return this.userService.updateLastName(userId, updateUserLastName);
  }
  
  @Mutation(() => User)
  async updateUserStatus(
      @Context() context: { req },
    @Args('status') status: Status,
  ): Promise<User> {
    const payload: Payload = context.req['user'];
    const userId = payload.sub;
  
    const userObject = await this.userService.getUserById(userId);
  
    if (!userObject) {
      throw new NotFoundException("User doesn't exist");
    }
  
    return this.userService.updateStatus(userId, status);
  }
  
  @Mutation(() => User)
  async updateUserCharacter(
      @Context() context: { req },
    @Args('character') character: Character,
  ): Promise<User> {
    const payload: Payload = context.req['user'];
    const userId = payload.sub;

    const userObject = await this.userService.getUserById(userId);

    if (!userObject) {
      throw new NotFoundException("User doesn't exist");
    }

    return this.userService.updateCharacter(userId, character);
  }  

  @Mutation(() => User)
  async updateUserAvatar(
      @Context() context: { req },
    @Args('newAvatar') newAvatar: string,
  ): Promise<User> {
    const payload: Payload = context.req['user'];
    const userId = payload.sub;

    const userObject = await this.userService.getUserById(userId);

    if (!userObject) {
      throw new NotFoundException("User doesn't exist");
    }

    return this.userService.updateAvatarfileName(userId, newAvatar);
  }

  @Mutation(() => User)
  async desactivate2Fa(@Context() context: { req }): Promise<boolean> {
    const payload: Payload = context.req['user'];
    const userId = payload.sub;
    
    const userObject = await this.userService.getUserById(userId);
    if (!userObject) {
      throw new NotFoundException("User doesn't exist");
    }
    return this.userService.activate2Fa(userId, false);
  }

  @ResolveField(() => [Block], {
    name: "blocked",
    description: 'Get members blocked by a user'
  })
  async getBlockedUser(
    @Parent() user: User,
  ) {
    return await this.block.getBlockedListByUid(user.id as string);
  }

  @ResolveField(() => [Block], {
    name: "blocking",
    description: 'Get members blocked by a user'
  })
  async getBlockenUser(
    @Parent() user: User,
  ) {
    return await this.block.getBlockenListByUid(user.id as string);
  }
}

