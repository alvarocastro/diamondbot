# Diamond Bot

[Diamond Bot Logo](/logo.png)

[![NPM](https://img.shields.io/npm/v/@diamondbot/core)](https://www.npmjs.com/package/@diamondbot/core)
[![Maintainability status](https://img.shields.io/codeclimate/maintainability/alvarocastro/diamondbot)](https://codeclimate.com/github/alvarocastro/diamondbot/maintainability)
[![Code style: XO](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

Modular library to easily build powerful discord bots.

- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [Support](#support)

## Install

```bash
npm install @diamondbot/core
```

## Usage

Just instantiate the bot, make it login with your discord token and you are done!

```js
// index.js
import { Bot } from '@diamondbot/core';

const bot = new Bot();

bot.login('YOUR_DISCORD_TOKEN');
```

The bot by itself has no commands, take a look at our ever-expanding [list of commands](/commands/README.md) that you can add to the bot, or if you want some custom stuff you can easily build your own!

Let's make a command to get cat images (this is just an example, we already have a [command for cats](/commands/cats))

```js
// commands/cat.js
import { ChatCommand } from '@diamondbot/core';

export default class CatCommand extends ChatCommand {
	constructor () {
		super({
			name: 'cat', // This will be used as the name to invoke the command, eg: !cat
			alias: 'cats' // As the name says it, this is an alias for the command, eg: !cats
		});
	}

	async run ({channel}, [count]) { // Our command will be able to accept a parameter, eg: !cat 3
		count = Number(count);
		count = count > 1 ? count : 1;

		for (let i = 0; i < count; i++) {
			await channel.send('https://cataas.com/cat');
		}
	}
}
```

Done! Our command is created, now we have to tell about it to our bot, let's go back to our `index.js` file.

```js
// index.js
import { Bot } from '@diamondbot/core';
import CatCommand from './commands/cat.js';

const bot = new Bot();

bot.addCommand(CatCommand);

bot.login('YOUR_DISCORD_TOKEN');
```

Now our bot is ready to fill our channels with cats!

## Contributing

Contributions are always welcome! Feel free to fix any bug you find or propose commands to add to the bot.

## Support

If you use this package please consider starring it :)
