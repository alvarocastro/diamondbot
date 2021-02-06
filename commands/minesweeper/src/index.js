import { ChatCommand } from '@diamondbot/core';
import Minesweeper from 'discord.js-minesweeper';

export default class MinesweeperCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'minesweeper',
			format: '[level=normal]',
			description: 'Play minesweeper'
		}, options));
	}

	exec ({channel}, [level = 'normal']) {
		level = level.toLowerCase();
		const levels = ['dumb', 'easy', 'normal', 'hard', 'extreme'];

		if (!levels.includes(level)) {
			channel.send('Possible difficulty levels are: `dumb`, `easy`, `normal`, `hard`, `extreme');
			return;
		}

		const configs = {
			dumb: {
				columns: 4,
				rows: 6,
				mines: 4,
				zeroFirstCell: true
			},
			easy: {
				columns: 8,
				rows: 8,
				mines: 10,
				zeroFirstCell: true
			},
			normal: {
				columns: 8,
				rows: 10,
				mines: 20
			},
			hard: {
				columns: 10,
				rows: 10,
				mines: 30
			},
			extreme: {
				columns: 10,
				rows: 10,
				mines: 49
			}
		};

		const minesweeper = new Minesweeper(Object.assign({
			spaces: true,
			revealFirstCell: true
		}, configs[level]));

		channel.send(minesweeper.start());
	}
}
