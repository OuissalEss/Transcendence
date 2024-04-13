// message.entity.ts
import { Field, ID , InputType} from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';

@InputType()
export class CreateMessageInput {
  @Field({ description: 'Content of the message' })
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content cannot be empty' })
  text: string;

  @Field(() => Date, { description: 'Time the message was sent' })
  @IsDate({ message: 'Time must be a date' })
  time?: Date;
    
  @Field(() => String, { description: 'User who sent the message' })
  sender: string;

  @Field(() => String, { description: 'Channel the message belongs to' })
  channelId: string;
}
