import { ChatCommand } from '@diamondbot/core';
import fetch from 'node-fetch';

export default class InspireCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'inspire',
			description: 'Shows an AI generated inspirational quote'
		}, options));
	}

	async exec ({channel}) {
		const res = await fetch('https://inspirobot.me/api?generate=true');
		const imageUrl = await res.text();
		await channel.send(imageUrl);
	}
}
