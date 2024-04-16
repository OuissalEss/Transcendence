// create-notification.input.ts
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsBoolean, IsDate, IsString } from 'class-validator';
import { NotifType as NotificationType } from '@prisma/client';

@InputType()
export class CreateNotificationInput {
  @Field(() => Date, { description: 'Time the notification was sent' })
  @IsDate({ message: 'Time must be a date' })
  time?: Date;

  @Field(() => NotificationType, { description: 'Type of notification' })
  @IsEnum(NotificationType, { message: 'Invalid notification type' })
  type: NotificationType;

  @Field(() => Boolean, {
    defaultValue: false,
    description: 'Read status of the notification',
  })
  @IsBoolean({ message: 'Is read must be a boolean' })
  isRead: boolean;

  @Field(() => String, { description: 'User who sent the notification' })
  @IsString({ message: 'Sender ID must be a string' })
  @IsNotEmpty({ message: 'Sender ID cannot be empty' })
  senderId: string;

  @Field(() => String, { description: 'User who received the notification' })
  @IsString({ message: 'Receiver ID must be a string' })
  @IsNotEmpty({ message: 'Receiver ID cannot be empty' })
  receiverId: string;

  @Field(() => String, { description: 'Invite Code' })
  @IsString({ message: 'InviteCode must be a string' })
  @IsNotEmpty({ message: 'InviteCode cannot be empty' })
  inviteCode?: string;
}
