import { Field, ObjectType } from '@nestjs/graphql';
import {
	IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  isBoolean
} from 'class-validator';

import { User } from "./user.entity";
import { Channel } from './channel.entity';

@ObjectType()
export class mute {
	/**
	 * The unique identifier of the mute.
	 * @type {string}
	 */
	@Field(() => String)
	@IsString({ message: 'Mute ID must be an string' })
	@IsNotEmpty({ message: 'Mute ID cannot be empty' })
	id: String;

	/**
	 * The time the mute was set to expire.
	 * @type {Date}
	 */
	@Field(() => Date, {
		description: 'The time the mute was set to expire'
	})
	@IsNotEmpty({ message: 'Mute expiry time cannot be empty' })
	@IsOptional()
	duration?: Date;

	/**
	 * Indicates whether the mute finished or not.
	 * @type {boolean}
	 */
	@IsNotEmpty({message: 'Mute finished must not be empty'})
	@IsBoolean({ message: 'Mute finished must be a boolean'})
	@Field(() => Boolean, {
		defaultValue: false,
		description: 'Whether the mute is finished',
	})
	finished: boolean;

	/**
	 * Indicates whether the mute is permanent or not.
	 * @type {boolean}
	 */
	@IsNotEmpty({message: 'Mute permanent must not be empty'})
	@IsBoolean({ message: 'Mute permanent must be a boolean'})
	@Field(() => Boolean, {
		defaultValue: false,
		description: 'Whether the mute is permanent',
	})
	permanent: boolean;

	/**
	 * channel id
	 * @type {string}
	 */
	@Field(() => String)
	@IsString({ message: 'Mute ID must be an string' })
	@IsNotEmpty({ message: 'Mute ID cannot be empty' })
	channelId: string;

}