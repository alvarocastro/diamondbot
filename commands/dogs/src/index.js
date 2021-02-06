import { ChatCommand } from '@diamondbot/core';
import randomPuppy from 'random-puppy';
import randomItem from 'random-item';

export default class DogsCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'dogs',
			aliases: ['dog', 'doggy', 'doggie'],
			description: 'Get some doggy happiness'
		}, options));
	}

	async exec ({channel}) {
		const reddit = randomItem([
			'Dogberg',
			'WhatsWrongWithYourDog',
			'dogswithjobs'

			// 'blop',
			// 'puppies',
		]);
		const img = await randomPuppy(reddit);

		await channel.send(img);
	}
}
