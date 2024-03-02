// message.resolver.ts
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MessageService } from '../services/message.service';
import { Message } from '../entities/message.entity';
import { CreateMessageInput } from 'src/services/dto/create-message.input';

@Resolver(() => Message)
export class MessageResolver {
    constructor(private readonly messageService: MessageService) {}

    @Query(() => [Message])
  async getAllMessages(): Promise<Message[]> {
        return this.messageService.getAllMessages();
    }

    @Query(() => Message)
  async getMessageById(@Args('id') id: string): Promise<Message> {
        return this.messageService.getMessageById(id);
    }

    @Mutation(() => Message)
  async createMessage(@Args('input') input: CreateMessageInput): Promise<Message> {
        return this.messageService.createMessage(input);
    }
}
