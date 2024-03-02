// user.resolver.ts

import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from 'src/services/user.service';
import { User } from 'src/entities/user.entity';
import {UpdateUserInput} from "../services/dto/update-user.input";
import {NotFoundException} from "@nestjs/common";

import { Status } from '@prisma/client'; // Import the Prisma-generated Status enum

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], {
    name: "getAllUsers",
    description: "Retrieves all users with their associated data",
  })
  getAllUsers(): Promise<User[]> {
    console.log(this.userService.getAllUsers());
    return this.userService.getAllUsers();
  }
  
  @Query(() => User, {
    name: "getUserById",
    description: "Retrieves a specific user with it's id"
  })
  async getUserById(@Args('id') id: string) {
    return this.userService.getUserById(id);
  }


  @Mutation(() => User)
  async updateUsername(
    @Args('userId') userId: string,
    @Args('username') updatedUsername: string,
    ): Promise<User> {
    const userObject = await this.userService.getUserById(userId);

    if (!userObject) {
      throw new NotFoundException("User doesn't exist");
    }

    // Assuming your `updateUser` function in the service performs validation
    return this.userService.updateUsername(userId, updatedUsername);
  }

  @Mutation(() => User)
  async updateFirstName(
    @Args('userId') userId: string,
    @Args('firstname') updateUserFirstName: string,
    ): Promise<User> {
    const userObject = await this.userService.getUserById(userId);

    if (!userObject) {
      throw new NotFoundException("User doesn't exist");
    }

    // Assuming your `updateUser` function in the service performs validation
    return this.userService.updateFirstName(userId, updateUserFirstName);
  }

  @Mutation(() => User)
  async updateLastName(
    @Args('userId') userId: string,
    @Args('firstname') updateUserLastName: string,
    ): Promise<User> {
    const userObject = await this.userService.getUserById(userId);

    if (!userObject) {
      throw new NotFoundException("User doesn't exist");
    }

    // Assuming your `updateUser` function in the service performs validation
    return this.userService.updateLastName(userId, updateUserLastName);
  }

  @Mutation(() => User)
  async updateUserStatus(
    @Args('userId') userId: string,
    @Args('status') status: Status,
  ): Promise<User> {
    const userObject = await this.userService.getUserById(userId);

    if (!userObject) {
      throw new NotFoundException("User doesn't exist");
    }

    return this.userService.updateStatus(userId, status);
  }

  @Mutation(() => User)
  async deleteUser(
    @Args('userId', {type: () => String}) userId: string
  ): Promise<User> {
    const userObject = await this.userService.getUserById(userId);

    if (!userObject) {
      throw new NotFoundException("User doesn't exist");
    }

    return this.userService.deleteUser(userId);
  }
}