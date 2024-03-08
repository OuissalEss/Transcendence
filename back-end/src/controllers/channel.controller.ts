import { Controller } from '@nestjs/common';
import { ChannelService } from 'src/services/channel.service';

@Controller('Chat')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}
	
}
