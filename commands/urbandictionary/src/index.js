import { ChatCommand } from '@diamondbot/core';

export default class UrbandictionaryCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'urbandictionary',
			description: ''
		}, options));
	}

	async exec ({channel}) {
		await channel.send();
	}
}
