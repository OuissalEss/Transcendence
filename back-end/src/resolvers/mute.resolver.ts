import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { mute } from 'src/entities/mute.entity';
import { User } from 'src/entities/user.entity';
import { MuteService } from 'src/services/mute.service';

type IdType = { uid: string; cid: string } | { mid: string };

@Resolver(() => mute)
export class MuteResolver {
	constructor(private readonly muteService: MuteService) {}

	@Query(() => [mute], {
		name:'AllMutes',
		description: 'Get all mutes'
	})
	async getAllMutes(): Promise<mute[]> {
		return this.muteService.getMuteList();
	}

	@Query(() => [User], {
		name: "MuteListCid",
		description: 'Get a muted user list by channel ID'
	})
	async getMuteListCid(@Args('cid', {type: () => String}) cid: string): Promise<User[]> {
		return this.muteService.getMutedUserListCid(cid);
	}

	@Query(() => [User], {
		name: "MuteListUid",
		description: 'Get a muted user list by user ID'
	})
	async getMuteListUid(@Args('uid', {type: () => String}) uid: string): Promise<User[]> {
		return this.muteService.getMuteListUid(uid);
	}

	@Query(() => Date, {
		name: "duration",
		description: "Get the duration of a mute",
	})
	async getDuration(
		@Args('uid', {type: () => String}) uid: string,
		@Args('cid', {type: () => String}) cid: string
	): Promise<Date> {
		return this.muteService.getMuteDuration(cid, uid);
	}

	@Query(() => Boolean, {
		name: "isPermanent",
		description: "is the mute perminent",
	})
	async isPermanentlyMuted(
		@Args('uid', {type: () => String}) uid: string,
		@Args('cid', {type: () => String}) cid: string
	): Promise<boolean> {
		return this.muteService.isPermanentlyMuted(cid, uid);
	}

	@Mutation(() => mute, {
		name: "muteUser",
		description: "mute user",
	})
	async muteUser(
		@Args('uid', {type: () => String}) uid: string,
		@Args('cid', {type: () => String}) cid: string,
		@Args('duration', {type: () => Date}) duration: Date,
		@Args('permanent', {type: () => Boolean}) permanent: boolean
	): Promise<mute> {
		return this.muteService.muteUser(cid,uid,duration,permanent);
	}

	@Mutation(() => mute, {
		name: "unmuteUser",
		description: "unmute user",
	})
	async unmuteUser(
		@Args('uid', {type: () => String}) uid: string,
		@Args('cid', {type: () => String}) cid: string,
	): Promise<mute> {
		return this.muteService.unmuteUser(cid,uid);
	}
}
