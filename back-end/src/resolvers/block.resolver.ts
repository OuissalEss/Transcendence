import { Query, Resolver, Mutation, Context, Args } from "@nestjs/graphql";
import { Block } from "../entities/block.entity";
import { BlockService } from "../services/block.service";
import { Payload } from "src/services/types/auth.service";
import { User } from "src/entities/user.entity";
import { ForbiddenError } from "@nestjs/apollo";

@Resolver(of => Block)
export class BlockResolver {
    constructor(private readonly blockService: BlockService) { }

    @Query(() => [Block], {
        name: "getAllBlocks",
        description: "Retrieves all blocks with their associated data"
    })
    getAllBlocks(@Context() context: { req }): Promise<Block[]> {
        const payload: Payload = context.req['user'];
        return this.blockService.getAllBlocks(payload.sub);
    }


    @Query(() => Block, {
        name: "getBlockById",
        description: "Retrieves block with their associated id"
    })
    getBlockById(@Args('blockId') id: string,): Promise<Block> {
        return this.blockService.getBlockById(id);
    }


    @Query(() => [Block], {
        name: "getUserBlocked",
        description: "Retrieves all blocks with their associated data"
    })
    async getUserBlocked(@Context() context: { req }): Promise<Block[]> {
        const payload: Payload = context.req['user'];

        const blockList: Block[] = await this.blockService.getBlockedForUser(payload.sub);
        return blockList;
    }


    @Mutation(() => Block, {
        name: "unBlock",
        description: "Delete block with their associated id"
    })
    unblockUser(@Args('blockId') id: string, @Context() context: { req }): Promise<Block> {
        const payload: Payload = context.req['user'];

        return this.blockService.unblockUser(payload.sub, id);
    }
}