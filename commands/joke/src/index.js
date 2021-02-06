import { ChatCommand } from '@diamondbot/core';
import fetch from 'node-fetch';

export default class JokeCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'joke',
			description: 'Get some healthy bot humor'
		}, options));

		this.emoji = options.emoji ?? 'KEKW';
	}

	async exec ({channel}) {
		const res = await fetch('https://icanhazdadjoke.com', {
			headers: {
				'Accept': 'application/json'
			}
		});
		const data = await res.json();
		let joke = 'Your mom';
		if (data.status === 200 && data.joke) {
			joke = data.joke;
		}

		const emoji = this.bot.emoji(this.emoji);

		await channel.send(`${joke} ${emoji}`);
	}
}
