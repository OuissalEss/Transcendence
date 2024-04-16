// notification.entity.ts
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsDate, IsEnum, IsString } from 'class-validator';
//import { NotificationType } from 'src/enums/notification.enum';
import { User } from 'src/entities/user.entity';


import { NotifType as NotificationType } from '@prisma/client'; // Import the Prisma-generated Status enum

@ObjectType()
export class Notification {
  /**
   * The unique identifier of the notification.
   * @type {number}
   */
  @Field(() => ID)
  @IsString({ message: 'Notification ID must be a string' })
  @IsNotEmpty({ message: 'Notification ID cannot be empty' })
  id: string;

  /**
   * Time the notification was sent.
   * @type {DateTime}
   */
  @Field(() => Date, { description: 'Time the notification was sent' })
  @IsDate({ message: 'Time must be a date' })
  time?: Date;

  /**
   * Type of notification.
   * @type {NotificationType}
   */
  @Field(() => NotificationType, { description: 'Type of notification' })
  @IsEnum(NotificationType, { message: 'Invalid notification type' })
  type: NotificationType;

  /**
   * Read status of the notification.
   * @type {boolean}
   */
  @Field(() => Boolean, {
    defaultValue: false,
    description: 'Read status of the notification'
  })
  isRead: boolean;

  /**
   * User who sent the notification.
   * @type {User}
   */
  @Field(() => String, { description: 'User who sent the notification' })
  @IsString({ message: 'Sender ID must be a string' })
  @IsNotEmpty({ message: 'Sender ID cannot be empty' })
  senderId: String;

  /**
   * User who received the notification.
   * @type {User}
   */
  @Field(() => String, { description: 'User who received the notification' })
  @IsString({ message: 'Receiver ID must be a string' })
  @IsNotEmpty({ message: 'Receiver ID cannot be empty' })
  receiverId: String;


  /**
   * User who sent the notification.
   * @type {String}
   */
  @Field(() => String, { description: 'InviteCode' })
  @IsString({ message: 'InviteCode must be a string' })
  @IsNotEmpty({ message: 'InviteCode cannot be empty' })
  inviteCode?: String;

  @Field(() => User, { description: 'User who receive the notification' })
  sender?: User;

  @Field(() => User, { description: 'User who receive the notification' })
  receiver?: User;

  /**
   * The date when the notification was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Notification created at must not be empty' })
  @IsDate({ message: 'Notification created at must be a date' })
  @Field(() => Date, { description: 'Date the notification was created' })
  createdAt: Date;

  /**
   * The date when the notification was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Notification updated at must not be empty' })
  @IsDate({ message: 'Notification updated at must be a date' })
  @Field(() => Date, { description: 'Date the notification was updated' })
  updatedAt: Date;
}


registerEnumType(NotificationType, {
  name: 'NotificationType',
  description: 'The type of the notification',
});