export default class ChatCommand {
	/**
	 * @param {Object} options Command options.
	 * @param {String} options.name Name of the command.
	 * @param {String} [options.alias] Alias for the command.
	 * @param {String[]} [options.aliases] Multiple aliases for the command.
	 * @param {String} [options.description] A helpful text of what the command does.
	 * @param {String} [options.format] A hint of what argument the command receives and how to pass them.
	 * @param {Boolean} [options.hidden] Indicates if the command should be visible or not.
	 * @param {String[]} [options.userPermissions] Array of permissions required for the command.
	 * @param {Boolean} [botOwnerOverridesPermissions=false] Bot owner overrides permissions required for the command.
	 * @param {Boolean} [botOwner=false] Command can only be run by the bot owner.
	 * @param {Boolean} [nsfw=false] Command can only be run in NSFW channels.
	 */
	constructor (options) {
		if (!options.name) {
			throw new Error('Command must have a name');
		}
		this.name = options.name;
		this.aliases = options.aliases ?? (options.alias ? [options.alias] : []);
		this.description = options.description ?? null;
		this.format = options.format ?? null;
		this.hidden = options.hidden ?? false;

		this.botOwner = options.botOwner ?? false;
		this.nsfw = options.nsfw ?? false;
		this.botOwnerOverridesPermissions = options.botOwnerOverridesPermissions ?? false;
		this.userPermissions = options.userPermissions ?? [];
	}

	/**
	 * Method to check if the command can be run or not.
	 * @method check
	 * @param {Message} message Discord message that triggered the command.
	 * @param {String[]} args Parsed args.
	 * @param {GuildMemory} memory Memory of the guild.
	 * @return {Boolean}
	 */
	check (message, args, memory) {
		if (this.nsfw && !message.channel.nsfw) {
			return false;
		}

		const runnerIsOwner = this.bot.owner === message.author.id;
		if (this.botOwner) {
			return runnerIsOwner
		}

		const checkPermissions = !this.botOwnerOverridesPermissions || (this.botOwnerOverridesPermissions && !runnerIsOwner);

		if (checkPermissions) {
			for (const permission of this.userPermissions) {
				if (!message.member.hasPermission(permission)) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Method executed when the command is run.
	 * @method exec
	 * @param {Message} message Discord message that triggered the command.
	 * @param {String[]} args Parsed args.
	 * @param {GuildMemory} memory Memory of the guild.
	 */
	exec (message, args, memory) {
		throw new Error(`Command "${this.name}" not implemented`);
	}
}
