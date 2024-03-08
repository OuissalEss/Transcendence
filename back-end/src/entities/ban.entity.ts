import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString
} from 'class-validator';

import { User } from "./user.entity";
import { Channel } from './channel.entity';

@ObjectType()
export class ban {
	/**
	 * The unique identifier of the ban.
	 * @type {string}
	 */

	@Field(() => String)
	@IsString({ message: 'Ban ID must be an string' })
	@IsNotEmpty({ message: 'Ban ID cannot be empty' })
	id: String;

	/**
	 * The user associated with this ban.
	 * @type {User}
	 */
	@Field(() => User, {
		description: 'User associated with this ban'
	})
	userID: User;

	/**
	 * The channel associated with this ban.
	 * @type {Channel}
	 */
	@Field(() => Channel, {
		description: 'Channel associated with this ban'
	})
	channelID: Channel;
}