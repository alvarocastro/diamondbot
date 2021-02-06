import fs from 'fs';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

/**
 * Main memory class that holds the sub memories for each guild.
 */
export default class Memory {
	constructor () {
		this.guilds = {};

		if (!fs.existsSync('./data')) {
			fs.mkdirSync('./data');
		}
	}

	/**
	 * Returns a scoped memory for a given guild.
	 * @method for
	 * @param {String} guildId Discord id of a guild.
	 * @return {GuildMemory}
	 */
	async for (guildId) {
		if (this.guilds[guildId]) {
			return this.guilds[guildId];
		}

		return this.guilds[guildId] = new GuildMemory(guildId);
	}
}

/**
 * Memory scoped for a guild.
 */
export class GuildMemory {
	/**
	 * @param {String} guildId Discord id of a guild.
	 */
	constructor (guildId) {
		this.db = low(new FileSync(`./data/guild-${guildId}.json`));

		this.db.defaults({
			config: {
				prefix: '!'
			},
			channels: {
				// <CHANNEL_ID>: {
				// 	commands: ['']
				// }
			}
		}).write();
	}

	/**
	 * Retrieves a value from the memory.
	 * @method get
	 * @param {String[]} path Array of keys representing a nested path.
	 * @param {Any} value Default value.
	 * @return {Any}
	 * @example
	 *     memory.get(['config', 'prefix'], '!');
	 */
	get (path, value) {
		return this.db.get(path, value).value();
	}

	/**
	 * Stores a value into the memory.
	 * @method set
	 * @param {String[]} path Array of keys representing a nested path.
	 * @param {Any} value Value to store.
	 * @example
	 *     memory.set(['config', 'prefix'], '-');
	 */
	set (path, value) {
		this.db.set(path, value).write();
	}

	/**
	 * Merges the given value or values in the given path. Useful for setting the initial memory values without overriding actual stored values.
	 * @method default
	 * @param {String[]} path Array of keys representing a nested path.
	 * @param {Any} value Value to merge.
	 * @example
	 *     memory.default(['config'], {
	 *       prefix: '!',
	 *       lang: 'en',
	 *       some: {
	 *         object: 'with',
	 *         nested: 'props'
	 *       }
	 *     });
	 */
	default (path, value) {
		this.db.get(path).defaultsDeep(value).write();
	}
}
