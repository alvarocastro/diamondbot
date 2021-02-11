import { ChatCommand } from '@diamondbot/core';
import redditSearch from 'reddit-random-image';
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
			'CatsISUOTTATFO',
			'CatReactionGifs',
			'CatsClimbingPeople',
			'kittiesvsthings',
			'ifitfits',
			'Catfort',
			'Catloaf',
			'catsareliquid',
			'PussyGifs',
			'wet_pussy',
			'smallpussy',
			'KittenGifs',
			'60fpscats',
			'kittyhugs',
			'purrkour',
			'SneezingCats'
		]);
		const img = await redditSearch(reddit);

		await channel.send(img);
	}
}
