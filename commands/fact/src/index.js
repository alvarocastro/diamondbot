import { ChatCommand } from '@diamondbot/core';
import fetch from 'node-fetch';

export default class FactCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'fact',
			description: 'Get a random useless fact about something'
		}, options));
	}

	async exec ({channel}) {
		const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
		const data = await response.json();

		await channel.send(data.text);
	}
}
