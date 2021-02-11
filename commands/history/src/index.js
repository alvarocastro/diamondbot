import { ChatCommand } from '@diamondbot/core';
import fetch from 'node-fetch';
import randomItem from 'random-item';
import VolatileMap from 'volatile-map';

const CACHE_TTL = 600000; // 10 minutes

export default class HistoryCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'history',
			alias: 'hist',
			description: 'Get a random history event that happened on a day like today'
		}, options));

		this.cache = new VolatileMap(options.cache ?? CACHE_TTL);
	}

	async commandHelp (channel) {
		return await channel.send(`
			> Today in history:
			> \`!${this.name}\` - Get an event that happened today but from another year.
			> \`!${this.name} [year]\` - Get an event that happened today but form that year.
			> \`!${this.name} [month] [day]\` - Get an event that happened that date but form another year.
			> \`!${this.name} [year] [month] [day]\` - Get an event that happened that date.
		`);
	}

	async getEvents (month, day) {
		const key = `${month}_${day}`;

		if (this.cache.has(key)) {
			return this.cache.get(key);
		}

		const response = await fetch(`https://history.muffinlabs.com/date/${month}/${day}`);
		const data = await response.json();
		this.cache.set(key, data);

		return data;
	}

	async exec ({channel}, args) {
		const now = new Date;
		let month;
		let day;
		let year;
		let message;
		let isToday = false;

		// Sanitize input
		if (args.length <= 1) {
			isToday = true;
			month = now.getMonth() + 1;
			day = now.getDate();
			if (args.length === 1) {
				year = Number(args[0]);
			}
		} else if (args.length === 2) {
			month = Number(args[0]);
			day = Number(args[1]);
		} else if (args.length === 3) {
			year = Number(args[0]);
			month = Number(args[1]);
			day = Number(args[2]);
		}

		// Validate input
		var lastDayOfMonth = new Date(year || now.getFullYear(), month, 0);
		if (
			args.length > 3 ||
			(year && isNaN(year)) ||
			isNaN(month) ||
			isNaN(day) ||
			day > lastDayOfMonth.getDate() ||
			month > 12 ||
			year > now.getFullYear()
		) {
			return await this.commandHelp(channel);
		}

		const {date, data} = await this.getEvents(month, day);

		if (!data) {
			throw new Error(`Got no response for ${month}/${day}`);
		}

		if (isToday) {
			message = `A day like today but`;
		} else {
			message = `On ${date}`;
		}
		let events = data.Events;
		if (year) {
			year = year.toString();
			events = events.filter(e => e.year === year);
		}

		const event = randomItem(events);
		if (!event) {
			message += ` of ${year}...\nNothing interesting happened ${this.bot.emoji('KEKWait')}`;
		} else {
			year = event.year;
			message += ` of ${year}...\n${event.text}`;
		}
		await channel.send(message);
	}
}
