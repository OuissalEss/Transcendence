// message.entity.ts
import { Field, ID , InputType} from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';

@InputType()
export class CreateMessageInput {
  @Field(() => ID)
  @IsString({ message: 'Message ID must be a string' })
  @IsNotEmpty({ message: 'Message ID cannot be empty' })
  id: string;

  @Field({ description: 'Content of the message' })
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content cannot be empty' })
  text: string;

  @Field(() => Date, { description: 'Time the message was sent' })
  @IsDate({ message: 'Time must be a date' })
  time?: Date;
    
  @Field(() => String, { description: 'Channel User who sent the message' })
  channelId: string;
}
