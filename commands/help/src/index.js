import { ChatCommand } from '@diamondbot/core';

export default class HelpCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'help',
			alias: 'commands',
			format: '[command]',
			description: 'Shows help of a given command or all commands'
		}, options));
	}

	buildHelpForCommand (command, prefix) {
		let output = `${prefix}${command.name}`;

		if (command.format) {
			output += ` ${command.format}`;
		}
		output = `\`${output}\``;
		if (command.description) {
			output += ` - ${command.description}`;
		}
		return output;
	}

	async exec ({channel}, [commandName], memory) {
		const prefix = memory.get(['config', 'prefix']);

		if (!commandName) {
			const helps = this.bot.commands
				.filter((command) => {
					return !command.hidden;
				})
				.map((command) => {
					return this.buildHelpForCommand(command, prefix);
				});
			channel.send(`> Commands:\n> ${helps.join('\n> ')}`);
			return;
		}

		const command = this.bot.commands.get(commandName);

		if (!command) {
			channel.send(`Command ${prefix}${commandName} not found`);
			return;
		}

		channel.send(`> Command:\n> ${this.buildHelpForCommand(command, prefix)}`);
	}
}
