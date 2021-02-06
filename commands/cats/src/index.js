import { ChatCommand } from '@diamondbot/core';
import randomPuppy from 'random-puppy';
import randomItem from 'random-item';

export default class CatsCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'cats',
			alias: 'cat',
			description: 'Get an image of our overlords'
		}, options));
	}

	async exec ({channel}) {
		const reddit = randomItem([
			'cat',
			'cats',
			'whatswrongwithyourcat',
			'catsareassholes',
			'catsridingroombas',
			'CatTaps',
			'CatSlaps',
			'CatsISUOTTATFO'

			// 'CatReactionGifs'
			// 'CatsClimbingPeople',
			// 'kittiesvsthings',
			// 'ifitfits',
			// 'Catfort',
		]);
		const img = await randomPuppy(reddit);

		await channel.send(img);
	}
}
