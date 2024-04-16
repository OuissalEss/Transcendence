// user.service.ts
import { Status, Character } from '@prisma/client'; // Import the Prisma-generated Status enum
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';


import { PrismaService } from './prisma.service';

import { CreateUserInput } from './dto/create-user.input';
import { User } from "src/entities/user.entity";

import { userIncludes } from "../includes/user.includes";
import { AchievementService } from './user_achievement.service';




@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService
        // private achievementService: AchievementService
    ) { }

    /**
     * Retrieves all users.
     * @returns {Promise<User[]>}
     */
    async getAllUsers(): Promise<User[]> {
        try {
            return this.prisma.user.findMany({
                include: userIncludes,
            });
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    }

    /**
     * Retrieves a specific user by ID.
     * @param {number} id - User ID
     * @returns {Promise<User>}
     */
    async getUserById(id: string): Promise<User> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: id
                },
                include: userIncludes,
            });
            if (!user) throw new NotFoundException("User not found");
            return user;
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    }

    /**
     * Search for users by query.
     * @param {string} query - Query
     * @returns {Promise<User[]>}
     */
    async searchUsers(query: string): Promise<User[]> {
        try {
            const users = await this.prisma.user.findMany({
                where: {
                    OR: [
                        {
                            username: {
                                contains: query, // Search for users whose name contains the query string
                                mode: 'insensitive', // Case-insensitive search
                            },
                        },
                        // You can add more search criteria here based on your user model
                    ],
                },
                include: userIncludes,
            });
            return users;
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    }

    /**
     * Updates a user's information.
     * @param {number} userId - User ID
     * @param {string} updatedUsername - Username data to update
     * @returns {Promise<User>}
     */
    async updateUsername(userId: string, updatedUsername: string): Promise<User> {
        try {
        // Check if the provided userId is a valid id
        let userObject: User = await this.getUserById(userId);

        if (!userObject) throw new NotFoundException("User does't exist");

            return this.prisma.user.update({
                where: { id: userId },
                data: { username: updatedUsername },
                include: userIncludes,
            });
        } catch (e) {
            throw new ForbiddenException("Unable to update Username");
        }
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
        try {
        // Check if the provided userId is a valid id
        let userObject: Promise<User> = this.getUserById(userId);

        if (!userObject) throw new NotFoundException("User does't exist");

            return this.prisma.user.update({
                where: { id: userId },
                data: { firstName: updatedFirstName },
                include: userIncludes,
            });
        } catch (e) {
            throw new ForbiddenException("Unable to update FirstName");
        }
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
        try {
        const user = this.getUserById(userId);

        if (!user) throw new NotFoundException("User not found");

            return this.prisma.user.update({
                where: { id: userId },
                data: { lastName: updatedLastName },
                include: userIncludes,
            });
        } catch (e) {
            throw new ForbiddenException("Unable to update LastName");
        }
    }

    async createUser(createUserInput: CreateUserInput): Promise<User> {
        try {
            return this.prisma.user.create({
                data: {
                    username: createUserInput.username,
                    firstName: createUserInput.firstName,
                    lastName: createUserInput.lastName,
                    email: createUserInput.email,
                    xp: createUserInput.xp,
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
        } catch (e) {
            throw new ForbiddenException("Unable to update CreateUser");
        }
    }

    /**
     * Updates a user's status.
     * @param {number} userId - User ID
     * @param {Status} status - User status
     * @returns {Promise<User>}
     */
    async updateStatus(userId: string, status: Status): Promise<User> {
        try {
        // Check if the provided userId is a valid id
        let userObject: Promise<User> = this.getUserById(userId);

        if (!userObject) throw new NotFoundException("User does't exist");

        // Check if the provided status is a valid enum value
        if (!Object.values(Status).includes(status)) {
            throw new BadRequestException("Invalid status");
        }

            return this.prisma.user.update({
                where: { id: userId },
                data: {
                    status: Status[status],
                }
            });
        } catch (e) {
            throw new ForbiddenException("Unable to update Status");
        }
    }

    /**
     * Updates a user's status.
     * @param {number} userId - User ID
     * @param {number} xptoadd - User status
     * @returns {Promise<User>}
     */
    async addXp(userId: string, xptoadd: number): Promise<User> {
        try {
        let userObject: Promise<User> = this.getUserById(userId);
        if (!userObject) throw new NotFoundException("User does't exist");

            return this.prisma.user.update({
                where: { id: userId },
                data: {
                    xp: (await userObject).xp + xptoadd,
                }
            });
        } catch (e) {
            throw new ForbiddenException("Unable to update Status");
        }
    }

    /**
     * Updates a user's character.
     * @param {number} userId - User ID
     * @param {Character} character - User character
     * @returns {Promise<User>}
     */
    async updateCharacter(userId: string, character: Character): Promise<User> {
        try {
        // Check if the provided userId is a valid id
        let userObject: Promise<User> = this.getUserById(userId);

        if (!userObject) throw new NotFoundException("User does't exist");

        // Check if the provided character is a valid enum value
        if (!Object.values(Character).includes(character)) {
            throw new BadRequestException("Invalid character");
        }

            return this.prisma.user.update({
                where: { id: userId },
                data: {
                    character: Character[character],
                }
            });
        } catch (e) {
            throw new ForbiddenException("Unable to update Character");
        }
    }

    /**
     * Updates a user's avatar.
     * @param {number} userId - User ID
     * @param {string} newAvatar - User avatar
     * @returns {Promise<User>}
     */
    async updateAvatarfileName(userId: string, newAvatar: string): Promise<User> {
        try {
        // Check if the provided userId is a valid id
        let userObject: User = await this.getUserById(userId);
        if (!userObject) throw new NotFoundException("User does't exist");
            await this.prisma.avatar.update({
                where: { id: userObject.avatar.id },
                data: {
                    filename: newAvatar
                },
            });
            return this.updateCharacter(userId, userObject.character);
        } catch (e) {
            throw new ForbiddenException("Unable to update Avatar");
        }
    }

    /**
  * Updates user Otp Secret.
  * @param {number} userId - User ID
  * @param {string} otpSecret - User OptSercret
  * @returns {Promise<User>}
  */
    async updateOtp(userId: string, otpSecret: string): Promise<User> {
        try {
        // Check if the provided userId is a valid id
        let userObject: User = await this.getUserById(userId);
        if (!userObject) throw new NotFoundException("User does't exist");

            await this.prisma.connection.update({
                where: { userId: userObject.id },
                data: {
                    otp: otpSecret,
                    otpCreatedAt: new Date()
                },
            });
            return userObject;
        } catch (e) {
            throw new ForbiddenException("Unable to update Otp");
        }
    }

    /**
* Activate user 2fa.
* @param {number} userId - User ID
* @param {string} otpSecret - 2fa Status
* @returns {Promise<User>}
*/
    async activate2Fa(userId: string, status: boolean): Promise<boolean> {
        try {
        // Check if the provided userId is a valid id
        let userObject: User = await this.getUserById(userId);

        if (!userObject) throw new NotFoundException("User does't exist");

            await this.prisma.connection.update({
                where: { userId: userObject.id },
                data: {
                    is2faEnabled: status
                },
            });
            return true;
        } catch (e) {
            throw new ForbiddenException("Unable to activate 2Fa");
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
                    where: { userId: userId }
                }),
                this.prisma.connection.deleteMany({
                    where: { userId: userId }
                }),
                this.prisma.user.delete({
                    where: { id: userId },
                    include: userIncludes
                })
            ]);
            return deletedUser;
        } catch (e) {
            throw new ForbiddenException("Unable to delete Friend.");
        }
    }
}
