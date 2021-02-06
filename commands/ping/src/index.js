import { ChatCommand } from '@diamondbot/core';

export default class PingCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'ping',
			alias: 'pong',
			description: 'Measures the latency of the bot'
		}, options));
	}

	async exec (message) {
		message.reply(`Pong! This message had a latency of ${Date.now() - message.createdTimestamp}ms.`);
	}
}
