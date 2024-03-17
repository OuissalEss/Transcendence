// user.service.ts
import { Status } from '@prisma/client'; // Import the Prisma-generated Status enum
import {BadRequestException, ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';


import { PrismaService } from './prisma.service';

import {CreateUserInput} from './dto/create-user.input';
import {User} from "src/entities/user.entity";

import {userIncludes} from "../includes/user.includes";
import { CreateUserTestInput } from './dto/create-user-test.input';




@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves all users.
   * @returns {Promise<User[]>}
   */
  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
        include: userIncludes,
    });
  }
    
  /**
   * Retrieves a specific user by ID.
   * @param {number} id - User ID
   * @returns {Promise<User>}
   */
  async getUserById(id: string): Promise<User> {
    const user = this.prisma.user.findUnique({
      where: {
          id: id
      },
      include: userIncludes,
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async CheckUserExistence(username: string, email: string) : Promise<User> {
    return this.prisma.user.findFirst({
        where: {
            username: username,
            email: email,
        }
    });
  }

  /**
   * Updates a user's information.
   * @param {number} userId - User ID
   * @param {string} updatedUsername - Username data to update
   * @returns {Promise<User>}
   */
  async updateUsername(userId: string, updatedUsername: string): Promise<User> {
      return this.prisma.user.update({
          where: { id: userId },
          data: {username: updatedUsername},
          include: userIncludes,
      });
  }
    /**
 * Updates a user's first name.
 * @param {string} userId - User ID
 * @param {string} updatedFirstName - First name to update
 * @returns {Promise<User>} Updated user object
 */
 async updateFirstName(
     userId: string,
     updatedFirstName: string
 ): Promise<User> {
      return this.prisma.user.update({
          where: { id: userId },
          data: { firstName: updatedFirstName },
          include: userIncludes,
      });
 }

 /**
 * Updates a user's last name.
 * @param {string} userId - User ID
 * @param {string} updatedLastName - Last name to update
 * @returns {Promise<User>} Updated user object
 */
 async updateLastName(
     userId: string,
     updatedLastName: string
 ): Promise<User> {
      return this.prisma.user.update({
          where: { id: userId },
          data: { lastName: updatedLastName },
          include: userIncludes,
      });
 }

 async CreateUserTest(user: string, avatar: string, email: string): Promise<User> {
    return this.prisma.user.create({
         data: {
             username: user,
             email: email,
             firstName: 'test',
             lastName: 'test',
             avatarTest: avatar,
            },
         include: userIncludes,
     });
 }

 async updateAvatar(userId: string, filename: string): Promise<User> {
    return this.prisma.user.update({
        where: { id: userId },
        data: {
            avatarTest: filename,
        },
        include: userIncludes,
    });
 }

 async createUser(createUserInput: CreateUserInput): Promise<User> {
      return this.prisma.user.create({
          data: {
              username: createUserInput.username,
              firstName: createUserInput.firstName,
              lastName: createUserInput.lastName,
              email: createUserInput.email,
              xp: createUserInput.xp,
            //   password: createUserInput.password, // Add the password property
              connection: {
                  create: {
                      provider: createUserInput.provider,
                      providerId: createUserInput.providerId
                  },
              },
              avatar: {
                  create: {
                      defaultFilename: createUserInput.defaultFilename,
                      filename: createUserInput.filename,
                  },
              },
          },
          include: userIncludes,
      });
  }

  /**
   * Updates a user's status.
   * @param {number} userId - User ID
   * @param {Status} status - User status
   * @returns {Promise<User>}
   */
  async updateStatus(userId: string, status: Status): Promise<User> {
        // Check if the provided userId is a valid id
        let userObject: Promise<User> = this.getUserById(userId);

        if (!userObject) throw new NotFoundException("User does't exist");

        // Check if the provided status is a valid enum value
        if (!Object.values(Status).includes(status)) {
            throw new BadRequestException("Invalid status");
        }

        try {
            return this.prisma.user.update({
                where: {id: userId},
                data: {
                    status: Status[status],
                }
            });
        } catch (e) {
            throw new ForbiddenException("Unable to update Status");
        }
  }

   // Add more functions as needed for your web application logic
  /**
   * Deletes a user and their associated data.
   *
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<User>} A promise that resolves to the deleted user.
   * @throws {ForbiddenException} If the user cannot be deleted.
   */
   async deleteUser(userId: string): Promise<User> {
         try {
             const [
                 ,
                 ,
                 deletedUser,
             ] = await this.prisma.$transaction([
                    this.prisma.avatar.deleteMany({
                        where: {userId: userId}
                    }),
                    this.prisma.connection.deleteMany({
                        where: {userId: userId}
                    }),
                    this.prisma.user.delete({
                        where: {id : userId},
                        include: userIncludes
                    })
             ]);
             return deletedUser;
         }catch (e) {
             throw new ForbiddenException("Unable to delete Friend.");
         }
    }
}
