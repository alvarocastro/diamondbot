import { Client, Collection } from 'discord.js';
import Memory from './memory';

/**
 * The main hub for interacting with the bot and the Discord API.
 */
export default class Bot {
	events = [];
	commands = new Collection();
	aliases = new Collection();

	/**
	 * @param {Object} [options] Options for the bot.
	 * @param {Array} [options.commands] Array of commands.
	 * @param {Array} [options.events] Array of events.
	 */
	constructor (options = {}) {
		options = Object.assign({
			commands: [],
			events: [],
			owner: null
		}, options);

		this.owner = options.owner;

		this.client = new Client();
		this.memory = new Memory();

		this.client.on('message', (message) => {
			this.handleMessage(message);
		});

		for (const command of options.commands) {
			this.addCommand(command);
		}
		for (const event of options.events) {
			this.addEvent(event);
		}
	}

	/**
	 * Tells the bot to register and track a custom ChatEvent.
	 * @method addEvent
	 * @param {ChatEvent} event
	 */
	addEvent (event) {
		console.log(`Registering event ${event.name}`);
		event.bot = this;
		this.events.push(event);
	}

	/**
	 * Tells the bot to register a custom ChatCommand.
	 * @method addCommand
	 * @param {ChatCommand} command
	 */
	addCommand (command) {
		command.bot = this;
		console.log(`Registering command "${command.name}"`);
		this.commands.set(command.name, command);
		for (const alias of command.aliases) {
			console.log(`Registering alias "${alias}" of command "${command.name}"`);
			this.aliases.set(alias, command.name);
		}
	}

	/**
	 * Resolves a possible command name into a command object using the registered aliases and commands.
	 * @method addEvent
	 * @param {String} name Command name/alias.
	 * @return {ChatCommand}
	 */
	resolveCommand (name) {
		let cname;
		if (this.commands.has(name)) {
			cname = name;
		} else {
			console.log(`Command "${name}" not found`);
			if (this.aliases.has(name)) {
				cname = this.aliases.get(name);
				console.log(`"${name}" is alias of "${cname}"`);
			}
		}

		if (!cname) {
			return false;
		}

		return this.commands.get(cname);
	}

	/**
	 * Utility getter for the bot's user.
	 * @type {ClientUser}
	 */
	get user () {
		return this.client.user;
	}

	/**
	 * Utility method to get an emoji from all the emojis available to the bot.
	 * @method emoji
	 * @param {String} name Case sensitive name of the emoji
	 * @return {GuildEmoji}
	 * @example
	 *     const pog = bot.emoji('PogChamp');
	 *     console.log(`PogChamp is ${pog}`);
	 */
	emoji (name) {
		return this.client.emojis.cache.find(emoji => emoji.name === name) || '';
	}

	/**
	 * Utility method to repeatedly call a function with a fixed or random delay between calls.
	 * @method setInterval
	 * @param {Function} fn Function to call, receives the bot instance as first argument.
	 * @param {(Number|Number[])} time Number of milliseconds to wait between calls. Pass an array [min, max] to wait a random amount of time.
	 * @param {Boolean} [immediate=true] Trigger the function at the start of the interval.
	 */
	setInterval (fn, time, immediate = true) {
		if (immediate) {
			fn(this);
		}
		const newtime = Array.isArray(time) ? Math.floor(Math.random() * (time[1] - time[0])) + time[0] : time;
		setTimeout(() => {
			this.setInterval(fn, time, true);
		}, newtime);
	}

	/**
	 * Login the bot using the Discord token.
	 * @method login
	 * @async
	 * @param {String} token Discord access token.
	 */
	async login (token) {
		await new Promise(async (resolve, reject) => {
			await this.client.login(token);

			this.client.on('ready', () => {
				resolve();
			});
		});
	}

	/**
	 * Parses messages and calls a command if it matches the prefix and command name. Also executes custom events.
	 * @method handleMessage
	 * @async
	 * @param {Message} message Message received.
	 */
	async handleMessage (message) {
		// Prevent bots talk
		if (message.author.bot) {
			return;
		}

		const memory = await this.memory.for(message.channel.guild.id);

		for (const event of this.events) {
			if (await event.check(message, memory)) {
				event.action(message, memory);
			}
		}

		const prefix = memory.get(['config', 'prefix']);

		// Check if message starts with prefix
		if (!message.content.startsWith(prefix)) {
			// console.log('[handleMessage] Not a command');
			return;
		}

		// Split the message by spaces, ignoring the prefix chars at the beginning
		let [commandName, ...args] = message.content.substr(prefix.length).split(/ +/);
		commandName = commandName.toLowerCase();

		// console.log(`[handleMessage] Received command "${command}" with args "${args.join(", ")}"`);

		const command = this.resolveCommand(commandName);

		// Check if the command exists
		if (!command) {
			console.log(`[handleMessage] Command "${commandName}" not found`);
			return;
		}

		try {
			console.log(`[handleMessage] Checking if command can run`);
			const allowed = await command.check(message, args, memory);

			if (!allowed) {
				console.log(`[handleMessage] Command not allowed`);
				return;
			}

			console.log(`[handleMessage] Running command "${commandName}"!`);
			await command.exec(message, args, memory);
		} catch (e) {
			console.error('[handleMessage] ERROR', e);
			message.reply('There was an error trying to execute that command!');
		}
	}
}
