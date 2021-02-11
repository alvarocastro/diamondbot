import { ChatCommand } from '@diamondbot/core';
import redditSearch from 'reddit-random-image';
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
			'dogswithjobs',
			'dogpictures',
			'dogswearinghats',
			'dogswitheyebrows',
			'BeachDogs',
			'blop',
			'puppies'
		]);
		const img = await redditSearch(reddit);

		await channel.send(img);
	}
}
