import { ChatCommand } from '@diamondbot/core';
import randomPuppy from 'random-puppy';
import randomItem from 'random-item';

export default class MemeCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'meme',
			description: 'Quality memes'
		}, options));
	}

	async exec ({channel}) {
		const reddit = randomItem([
			'meme',
			'memes'
		]);
		const img = await randomPuppy(reddit);

		await channel.send(img);
	}
}
