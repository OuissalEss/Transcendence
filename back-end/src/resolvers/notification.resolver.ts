// notification.resolver.ts
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { NotificationService } from 'src/services/notification.service';
import { Notification } from 'src/entities/notification.entity';
import { CreateNotificationInput } from 'src/services/dto/create-notification.input';

@Resolver(() => Notification)
export class NotificationResolver {
    constructor(private readonly notificationService: NotificationService) {}

    @Query(() => [Notification])
  async getAllNotifications(): Promise<Notification[]> {
        return this.notificationService.getAllNotifications();
    }

    @Query(() => Notification)
  async getNotificationById(@Args('id') id: string): Promise<Notification> {
        return this.notificationService.getNotificationById(id);
    }

    @Mutation(() => Notification)
  async createNotification(
      @Args('input') input: CreateNotificationInput,
      ): Promise<Notification> {
        return this.notificationService.createNotification(input);
    }
}
