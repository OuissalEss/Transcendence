// message.resolver.ts
import { Resolver, Mutation, Args, Query, Parent, ResolveField } from '@nestjs/graphql';
import { Message } from '../entities/message.entity';
import { CreateMessageInput } from 'src/services/dto/create-message.input';
import { User} from 'src/entities/user.entity';
import { MessageService } from 'src/services/message.service';

@Resolver(() => Message)
export class MessageResolver {
    constructor(
      private readonly messageService: MessageService,
    ) {}

    @Query(() => [Message])
  async getAllMessages(): Promise<Message[]> {
        return this.messageService.getAllMessages();
    }

    @Query(() => Message)
  async getMessageById(@Args('id',{ type: () => String }) id: string): Promise<Message> {
        return this.messageService.getMessageById(id);
    }

    @Mutation(() => Message)
  async createMessage(@Args('input') input: CreateMessageInput): Promise<Message> {
        return this.messageService.createMessage(input);
    }

    @Mutation(() => Message)
  async updateMessage(
    @Args('mid', {type: () => String}) mid: string,
    @Args('text', {type: () => String}) text: string
  ): Promise<Message> {
        return this.messageService.updateMessage(mid, text);
    }

    @ResolveField(() => String)
    async sender(@Parent() message: Message): Promise<String> {
        const user = await this.messageService.getMessageSender(message.id as string);
        return user.username;
    }

    @ResolveField(() => String)
    async senderId(@Parent() message: Message): Promise<String> {
        const user = await this.messageService.getMessageSender(message.id as string);
        return user.id;
    }
}
