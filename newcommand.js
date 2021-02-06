const fs = require('fs');
const execSync = require('child_process').execSync;

const name = process.argv[2];

console.log(`Creating command "${name}"`);

console.log('+ Creating base dir');
fs.mkdirSync(`commands/${name}`);

console.log('+ Creating .babelrc file');
const babelrc = {
	presets: [
		[
			'@babel/preset-env', {
				targets: {
					node: 10
				}
			}
		]
	],
	plugins: [
		'@babel/plugin-proposal-class-properties'
	]
};
fs.writeFileSync(`commands/${name}/.babelrc`, JSON.stringify(babelrc, null, 2));

console.log('+ Creating package.json file');
const packagejson = {
	name: `@diamondbot/${name}-command`,
	version: '0.0.0',
	description: 'DiamondBot command',
	main: 'dist/index.js',
	files: [
		'dist'
	],
	scripts: {
		'bump:patch': 'npm version patch --no-git-tag-version',
		'bump:minor': 'npm version minor --no-git-tag-version',
		'bump:major': 'npm version major --no-git-tag-version',
		postversion: 'npm publish --access public',
		prepare: 'npm run build',
		build: 'babel src -d dist'
	},
	repository: {
		type: 'git',
		url: 'git+https://github.com/alvarocastro/diamondbot.git'
	},
	keywords: [
		'diamondbot',
		'diamondbot command',
		'discord',
		'command'
	],
	author: 'Alvaro Castro',
	license: 'MIT',
	bugs: {
		url: 'https://github.com/alvarocastro/diamondbot/issues'
	},
	homepage: `https://github.com/alvarocastro/diamondbot/commands/${name}#readme`
}
fs.writeFileSync(`commands/${name}/package.json`, JSON.stringify(packagejson, null, 2));

console.log('+ Creating base command file');
const nameFormatted = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
fs.mkdirSync(`commands/${name}/src`);
fs.writeFileSync(`commands/${name}/src/index.js`, `import { ChatCommand } from '@diamondbot/core';

export default class ${nameFormatted}Command extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: '${name}',
			description: ''
		}, options));
	}

	async exec ({channel}) {
		await channel.send();
	}
}
`);

console.log('+ Installing dev dependencies');
execSync(`cd commands/${name}; npm i -D @babel/cli @babel/core @babel/plugin-proposal-class-properties @babel/preset-env`);
console.log('+ Installing bot dependencies');
execSync(`cd commands/${name}; npm i @diamondbot/core`);

console.log('Done!');
