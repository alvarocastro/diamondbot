import { ChatCommand, Discord } from '@diamondbot/core';
import dayjs from 'dayjs';
import preciseDiff from 'dayjs-precise-range';
dayjs.extend(preciseDiff);

const and = function (l) {
	const n = l.length;

	if (n === 1) {
		return l[0];
	}
	if (n === 2) {
		return l.join(' and ');
	}
	return `${l.slice(0, n - 1).join(', ')} and ${l[n - 1]}`;
};

export default class MemberageCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'memberage',
			format: '[user]',
			description: 'Displays the time a member been on this server'
		}, options));
	}

	async exec ({member, channel, guild}, [user]) {
		let target;
		if (!user) {
			target = member;
		} else if (Discord.MessageMentions.USERS_PATTERN.test(user)) {
			target = await guild.members.fetch(user.replace(Discord.MessageMentions.USERS_PATTERN, '$1'));
		} else {
			const members = await guild.members.fetch({query: user});

			if (members.length > 1) {
				return await message.reply(`try mentioning, your command matched several users: ${members.join(', ')}`);
			} else if (members.length === 0) {
				return await message.reply(`try mentioning, user not found`);
			}
			target = members.first();
		}

		const measures = {
			years: ['year', 'years'],
			months: ['month', 'months'],
			days: ['day', 'days'],
			hours: ['hour', 'hours'],
			minutes: ['minute', 'minutes'],
			seconds: ['second', 'seconds']
		};

		const joined = dayjs(target.joinedTimestamp);
		const now = dayjs();

		const diff = dayjs.preciseDiff(joined, now, true);

		let count = 0;
		const timeParts = [];
		for (const [key, value] of Object.entries(diff)) {
			if (count === 3) {
				break;
			} else if (count > 0) {
				count++;
			}
			if (measures[key] && value > 0) {
				if (count === 0) {
					count++;
				}
				timeParts.push(`${value} ${measures[key][value === 1 ? 0 : 1]}`);
			}
		}

		return await channel.send(`${target} has been a member of this server for ${and(timeParts)}.`);
	}
}
