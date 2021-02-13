import { ChatCommand } from '@diamondbot/core';
import fetch from 'node-fetch';
import pick from 'pick-random-weighted';
import capitalize from 'microsoft-capitalize';

export default class JokeCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'joke',
			description: 'Get some bot humor'
		}, options));

		this.categories = options.categories ?? ['dad', 'anti', 'yomama'];
		this.categoriesChance = options.categoriesChance ?? null;

		if (this.categoriesChance && this.categoriesChance.length !== this.categories.length) {
			throw new Error('categoriesChance must be an array the same length as categories');
		}

		if (this.categoriesChance) {
			this.weightedCategories = this.categories.map((c, i) => [c, this.categoriesChance[i]]);
		} else {
			this.weightedCategories = this.categories.map((c, i) => [c, 1]);
		}
		this.dadEmoji = options.dadEmoji ?? 'KEKW';
		this.yomamaEmoji = options.yomamaEmoji ?? 'KEKW';
		this.antiEmoji = options.antiEmoji ?? 'KEKWait';
	}

	getRandomCategory () {
		return pick(this.weightedCategories);
	}

	async getDadJoke () {
		const res = await fetch('https://icanhazdadjoke.com', {
			headers: {
				'Accept': 'application/json'
			}
		});
		const data = await res.json();

		if (data.status !== 200 || !data.joke) {
			throw new Error(`Failed to get dad joke, ${JSON.stringify(data)}`);
		}

		return data.joke;
	}

	async getAntiJoke () {
		const res = await fetch('https://generatorfun.com/code/model/generatorcontent.php?recordtable=generator&recordkey=109&gen=Y&itemnumber=1&randomoption=undefined&genimage=No&nsfw=No&keyword=undefined&tone=Normal');
		const data = await res.text();
		let joke = data.replace(/.*<p>(.+?)<\/p>.*/ims, '$1').trim();

		if (!joke) {
			throw new Error(`Failed to get anti joke, ${data}`);
		}

		joke = joke.replace(/\. See also .+\.$/, '').replace(/\.$/, '');

		return capitalize(joke.toLowerCase());
	}

	async getYoMamaJoke () {
		const res = await fetch('https://api.yomomma.info/');
		const data = await res.json();

		if (!data.joke) {
			throw new Error(`Failed to get yomama joke, ${JSON.stringify(data)}`);
		}

		return data.joke;
	}

	async exec ({channel}) {
		const category = this.getRandomCategory();
		let joke = 'Your mom';
		let emoji;
		if (category === 'dad') {
			joke = await this.getDadJoke();
			emoji = this.bot.emoji(this.dadEmoji);
		} else if (category === 'yomama') {
			joke = await this.getYoMamaJoke();
			emoji = this.bot.emoji(this.yomamaEmoji);
		} else if (category === 'anti') {
			joke = await this.getAntiJoke();
			emoji = this.bot.emoji(this.antiEmoji);
		}

		await channel.send(`${joke} ${emoji}`);
	}
}
