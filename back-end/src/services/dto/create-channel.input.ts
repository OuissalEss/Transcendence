import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate } from 'class-validator';
import { ChannelUser } from 'src/entities/channel-user.entity';
import { ChannelType as PrismaChannelType } from '@prisma/client'; // Update import

@InputType()
export class CreateChannelInput {
  @Field({ description: 'Channel title' })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @Field({ nullable: true, description: 'Channel password' })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  password?: string;

  @Field({ nullable: true, description: 'Channel profile image' })
  @IsOptional()
  @IsString()
  profile?: string;

  @Field(() => PrismaChannelType, { description: 'Channel type' })
  @IsEnum(PrismaChannelType, { message: 'Invalid channel type, must be one of these values: '+Object.values(PrismaChannelType).join(', ') })
  type: PrismaChannelType;

}
