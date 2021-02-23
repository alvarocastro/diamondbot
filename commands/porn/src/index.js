import querystring from 'querystring';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import randomItem from 'random-item';
import ImgurAnonymousUploader from 'imgur-anonymous-uploader';
import { ChatCommand } from '@diamondbot/core';

export default class PornCommand extends ChatCommand {
	categories = {
		amateur: 'amateur',
		anal: 'anal',
		asian: 'asian',
		ass: 'ass',
		babes: 'babes',
		bbw: 'bbw',
		bdsm: 'bdsm',
		tits: 'big-tits',
		blonde: 'blonde',
		blowjob: 'blowjob',
		brunette: 'brunette',
		celebrity: 'celebrity',
		college: 'college',
		creampie: 'creampie',
		cumshots: 'cumshots',
		doublepenetration: 'double-penetration',
		ebony: 'ebony',
		emo: 'emo',
		femalepenetration: 'female-ejaculation',
		fisting: 'fisting',
		footjob: 'footjob',
		gangbang: 'gang-bang',
		gay: 'gay',
		girlfriend: 'girlfriend',
		group: 'group-sex',
		hairy: 'hairy',
		handjob: 'handjob',
		hardcore: 'hardcore',
		hentai: 'hentai',
		indian: 'indian',
		interracial: 'interracial',
		latina: 'latina',
		lesbian: 'lesbian',
		lingerie: 'lingerie',
		masturbation: 'masturbation',
		mature: 'mature',
		milf: 'milf',
		clothed: 'non-nude',
		panties: 'panties',
		penis: 'penis',
		pornstar: 'pornstar',
		public: 'public-sex',
		pussy: 'pussy',
		redhead: 'redhead',
		selfshot: 'selfshot',
		shemale: 'shemale',
		solomale: 'solo-male',
		teen: 'teen',
		threesome: 'threesome',
		toys: 'toys'
	};

	constructor (options = {}) {
		super(Object.assign({
			name: 'porn',
			format: '[options] <query>',
			description: 'All the power of porn in a single command, try `!porn h` for details',
			hidden: true,
			nsfw: true
		}, options));

		if (!options.imgurClientId) {
			throw new Error('imgurClientId is required');
		}

		this.imgur = new ImgurAnonymousUploader(options.imgurClientId);
	}

	async fetcher (url) {
		const response = await fetch(url);
		const body = await response.text();

		const $ = cheerio.load(body);
		const elements = $('#masonry_container .masonry_box.small_pin_box .image');

		if (!elements.length) {
			return [];
		}
		const urls = elements.toArray().map(element => element.attribs['data-src'].split('?')[0]);

		return urls;
	}
	async byTerm (term, type = 'pics') {
		const query = querystring.stringify({
			query: term
		});
		const url = `https://www.sex.com/search/${type}?${query}`;

		return await this.fetcher(url);
	}
	async byCategory (category, type = 'pics', sort = 'latest') {
		const query = querystring.stringify(sort === 'latest' ? {
			sort: 'latest'
		} : {
			sort: 'popular',
			sub: 'week'
		});
		const url = `https://www.sex.com/${type}/${category}?${query}`;

		return await this.fetcher(url);
	}

	async uploadToImgur (url) {
		const response = await fetch(url, {
			method: 'GET',
			headers: { referer: 'https://www.sex.com/' }
		});
		const buffer = await response.buffer();
		const result = await this.imgur.uploadBuffer(buffer);

		if (!result.success) {
			throw new Error(JSON.stringify(result));
		}

		return result.url;
	}

	async commandHelp ({channel}) {
		return await channel.send(`
			> Porn help:
			> - \`c\` for a list of categories
			> - \`s\` for free search
			> - \`g\` to filter for gifs
			> - \`h\` for this message
			> Examples:
			> \`!${this.name} s redhead ass\`
			> \`!${this.name} sg titty drop\`
			> \`!${this.name} blonde\`
		`);
	}

	async commandCategoriesList ({channel}) {
		return await channel.send(`
			> Porn categories:
			> ${Object.keys(this.categories).map(c => `\`${c}\``).join(', ')}
		`);
	}

	async commandSearch ({channel}, type, term) {
		const waitMessage = await channel.send(`Fetching some ${term}...`);
		const results = await this.byTerm(term, type);
		const url = randomItem(results);
		const imgurUrl = await this.uploadToImgur(url);

		await waitMessage.delete();
		await channel.send(imgurUrl);
	}

	async commandCategory (message, type, categoryName) {
		const category = this.categories[categoryName];
		if (!category) {
			return await this.commandHelp(message);
		}

		const {channel} = message;
		const waitMessage = await channel.send(`Fetching some ${categoryName}...`);
		const results = await this.byCategory(category, type);
		const url = randomItem(results);
		const imgurUrl = await this.uploadToImgur(url);

		await waitMessage.delete();
		await channel.send(imgurUrl);
	}

	async exec (message, args) {
		const [options, ...rest] = args;

		let type = 'pics';
		let command = 'category';
		let term = args.join(' ');
		if (/^[csgh]+$/i.test(options)) {
			term = rest.join(' ');
			if (options.includes('g')) {
				type = 'gifs';
			}
			if (options.includes('s')) {
				command = 'search';
			}
			if (options.includes('c')) {
				command = 'categories';
			}
			if (options.includes('h')) {
				command = 'help';
			}
		}

		if (command === 'help') {
			return await this.commandHelp(message);
		}
		if (command === 'categories') {
			return await this.commandCategoriesList(message);
		}
		if (command === 'search') {
			return await this.commandSearch(message, type, term);
		}
		if (command === 'category') {
			return await this.commandCategory(message, type, term);
		}
	}
}
