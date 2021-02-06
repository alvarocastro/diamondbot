import { ChatCommand } from '@diamondbot/core';

export default class VaseCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'vase',
			description: 'A decorative container without handles'
		}, options));
	}

	async exec ({channel}) {
		const num = Math.floor(Math.random() * 20000) + 1; // Number between 1 and 20000 inclusive
		const padded = num.toString().padStart(7, '0');
		const vase = `http://thisvesseldoesnotexist.s3-website-us-west-2.amazonaws.com/public/v2/fakes/${padded}.jpg`;

		await channel.send(vase);
	}
}

