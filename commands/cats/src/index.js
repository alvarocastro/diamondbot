import { ChatCommand } from '@diamondbot/core';
import randomPuppy from 'random-puppy';
import randomItem from 'random-item';

export default class CatsCommand extends ChatCommand {
	name = 'cats';
	description = 'Get an image of our overlords';

	async run ({channel}) {
		const reddit = randomItem([
			'cat',
			'cats',
			'whatswrongwithyourcat',
			'catsareassholes'
		]);
		const img = await randomPuppy(reddit);

		await channel.send(img);
	}
}
