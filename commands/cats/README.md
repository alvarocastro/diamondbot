# Diamond Bot Cats Command

[![NPM](https://img.shields.io/npm/v/@diamondbot/cats-command)](https://www.npmjs.com/package/@diamondbot/cats-command)
[![Code style: XO](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

Command that posts random cat photos and gifs from reddit.

- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [Support](#support)

## Install

```bash
npm install @diamondbot/cats-command
```

```js
// index.js
import { Bot } from '@diamondbot/core';
import CatsCommand from '@diamondbot/cats-command';

const bot = new Bot();
bot.addCommand(new CatsCommand);
```

Command does not require additional configuration.

## Usage

```
!cats
```

Command has no additional options.

## Contributing

Contributions are always welcome! Feel free to fix any bug you find or propose commands to add to the bot.

## Support

If you use this package please consider starring it :)

