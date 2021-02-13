import { ChatCommand } from '@diamondbot/core';
import fetch from 'node-fetch';
import pick from 'pick-random-weighted';
import capitalize from 'microsoft-capitalize';

export default class FortuneCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'fortune',
			description: 'Crack open your fortune cookie!'
		}, options));

		this.cooldown = options.cooldown ?? 1 * 60 * 60 * 1000; // (1 hour) Time a user must wait to get a new fortune
		this.categories = options.categories ?? ['cookie', 'commandment', 'nonsense'];
		this.categoriesChance = options.categoriesChance ?? [2, 1, 1];

		if (this.categoriesChance && this.categoriesChance.length !== this.categories.length) {
			throw new Error('categoriesChance must be an array the same length as categories');
		}

		if (this.categoriesChance) {
			this.weightedCategories = this.categories.map((c, i) => [c, this.categoriesChance[i]]);
		} else {
			this.weightedCategories = this.categories.map((c, i) => [c, 1]);
		}
	}

	getRandomCategory () {
		return pick(this.weightedCategories);
	}

	async getFortuneCookie () {
		const res = await fetch('https://www.generatorslist.com/random/words/fortune-cookie-generator/ajax');
		const data = await res.json();

		return data[0]?.message[0]?.message;
	}

	async getNonsense () {
		const res = await fetch('https://generatorfun.com/code/model/generatorcontent.php?recordtable=generator&recordkey=650&gen=Y&itemnumber=1&randomoption=undefined&genimage=No&nsfw=No&keyword=undefined&tone=Normal');
		const data = await res.text();
		let nonsense = data.replace(/.*<p>(.+?)<\/p>.*/ims, '$1').trim();

		if (!nonsense) {
			throw new Error(`Failed to get nonsense fortune, ${data}`);
		}

		return capitalize(nonsense.toLowerCase()).replace(/\n/mgs, '');
	}

	async getCommandment () {
		const res = await fetch('https://generatorfun.com/code/model/generatorcontent.php?recordtable=generator&recordkey=76&gen=Y&itemnumber=1&randomoption=undefined&genimage=No&nsfw=No&keyword=undefined&tone=Normal');
		const data = await res.text();
		let nonsense = data.replace(/.*<p>(.+?)<\/p>.*/ims, '$1').trim();

		if (!nonsense) {
			throw new Error(`Failed to get nonsense fortune, ${data}`);
		}

		return capitalize(nonsense.toLowerCase()).replace(/\n/mgs, '');
	}

	async exec (message, args, memory) {
		const lastFortuneTime = memory.get(['fortune', message.author.id], 0);

		if (lastFortuneTime + this.cooldown > Date.now()) {
			await message.reply('come back later for another fortune.');
			return;
		}

		const category = this.getRandomCategory();

		let fortune;
		if (category === 'cookie') {
			fortune = await this.getFortuneCookie();
		} else if (category === 'nonsense') {
			fortune = await this.getNonsense();
		} else if (category === 'commandment') {
			fortune = await this.getCommandment();
		}

		memory.set(['fortune', message.author.id], Date.now());
		if (fortune) {
			await message.reply(fortune.charAt(0).toLowerCase() + fortune.slice(1));
		} else {
			await message.reply('there is no fortune for you today.');
		}
	}
}
