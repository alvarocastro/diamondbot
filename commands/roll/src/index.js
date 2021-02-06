import { ChatCommand } from '@diamondbot/core';
import roll from '@alvarocastro/roll';

export default class RollCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'roll',
			format: '[dice]',
			description: 'Try your luck and roll the dices in AdX notation. Ex: 1d20, 2d6+1d12+2, etc.'
		}, options));
	}

	async exec ({channel, author}, [dice = '1d100']) {
		await channel.send(`<@${author.id}> rolled ${roll(dice)}`);
	}
}
