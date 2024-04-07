// notification.resolver.ts
import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { NotificationService } from 'src/services/notification.service';
import { Notification } from 'src/entities/notification.entity';
import { CreateNotificationInput } from 'src/services/dto/create-notification.input';
import { Payload } from 'src/services/types/auth.service';

@Resolver(() => Notification)
export class NotificationResolver {
    constructor(private readonly notificationService: NotificationService) {}

    @Query(() => [Notification])
  async getAllNotifications(): Promise<Notification[]> {
        return await this.notificationService.getAllNotifications();
    }

    @Query(() => [Notification])
  async getNotificationById(@Args('id') id: string): Promise<Notification> {
        return await this.notificationService.getNotificationById(id);
    }

    @Query(() => [Notification])
  async getUserNotifications(@Context() context: { req }): Promise<Notification[]> {
      const payload: Payload = context.req['user'];
      const userId = payload.sub;
      return this.notificationService.getUserNotifications(userId);
    }


    @Mutation(() => Notification)
  async updateIsRead(@Context() context: { req }, @Args('id') id: string): Promise<Notification> {
      const payload: Payload = context.req['user'];
      const userId = payload.sub;
        return await this.notificationService.updateIsRead(userId, id);
    }

    @Mutation(() => Notification)
  async createNotification(
      @Args('input') input: CreateNotificationInput,
      ): Promise<Notification> {
        return await this.notificationService.createNotification(input);
    }
}
