export default class ChatEvent {
	/**
	 * @param {String} name Name of the chat event.
	 */
	constructor (name) {
		this.name = name;
	}

	/**
	 * Checks if the chat event should trigger it's action.
	 * @method check
	 * @param {Message} message Discord message.
	 * @param {GuildMemory} memory Memory of the guild.
	 * @return {Boolean}
	 */
	check (message, memory) {
		return true;
	}

	/**
	 * Function to execute whenever the event triggers.
	 * @method action
	 * @param {Message} message Discord message.
	 * @param {GuildMemory} memory Memory of the guild.
	 */
	action (message, memory) {
		throw new Error(`Event "${this.name}" not implemented`);
	}
}
