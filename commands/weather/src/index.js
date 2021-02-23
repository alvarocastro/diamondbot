import { ChatCommand } from '@diamondbot/core';
import weather from 'weather-js';

const getWeather = function (location, unit) {
	return new Promise((resolve, reject) => {
		weather.find({
			search: location,
			degreeType: unit
		}, (err, result) => {
			if (err) {
				reject(err);
			}
			resolve(result);
		});
	})
};








const skycodes = {
	0: '⛈️', //thunderstorm
	1: '⛈️', //thunderstorm
	2: '⛈️', //thunderstorm
	3: '⛈️', //thunderstorm
	4: '⛈️', //thunderstorm
	5: '🌨️', //rain_snow
	6: '🌨️', //sleet
	7: '🌨️', //rain_snow
	8: '❄️', //icy
	9: '🌧️', //icy
	10: '🌨️', //rain_snow
	11: '🌧️', // showers
	12: '🌧️', //rain
	13: '🌨️', // flurries
	14: '🌨️', // snow
	15: '🌨️', // snow
	16: '🌨️', // snow
	17: '⛈️', //thunderstorm
	18: '🌧️', // showers
	19: '🌫️', // dust
	20: '🌫️', // fog
	21: '🌫️', // haze
	22: '🌫️', // haze
	23: '💨', // windy
	24: '💨', // windy
	25: '❄️', //icy
	26: '☁️', //cloudy
	27: '🌥️', // mostly_cloudy
	28: '🌥️', // mostly_cloudy
	29: '⛅', // partly_cloudy
	30: '⛅', // partly_cloudy
	31: '☀️', // sunny
	32: '☀️', // sunny
	33: '🌤️', // mostly_sunny
	34: '🌤️', // mostly_sunny
	35: '⛈️', //thunderstorm
	36: '☀️', // hot
	37: '⛈️', // chance_of_tstorm
	38: '⛈️', // chance_of_tstorm
	39: '🌦️', // chance_of_rain
	40: '🌧️', // showers
	41: '🌨️', // chance_of_snow
	42: '🌨️', // snow
	43: '🌨️', // snow
	44: '', // na
	45: '🌦️', // chance_of_rain
	46: '🌨️', // chance_of_snow
	47: '⛈️' // chance_of_tstorm
};

const a = function (memory, text, code) {
	let r = memory.get(['w', text], []);

	if (!r.includes(code)) {
		r.push(code);
		memory.set(['w', text], r);
	}
};

export default class WeatherCommand extends ChatCommand {
	constructor (options = {}) {
		super(Object.assign({
			name: 'weather',
			description: 'Get the weather'
		}, options));
	}

	async exec ({channel}, args, memory) {
		const res = await getWeather(args.join(' '), 'C');

		for (const {location, current, forecast} of res) {
			let message = [
				`Weather in ${location.name}:`,
				`Now: ${current.skytext} ${current.temperature} C, feels like ${current.feelslike} C, humidity ${current.humidity}%, winds ${current.winddisplay}`
			];
			a(memory, current.skytext, current.skycode);
			for (const f of forecast) {
				message.push(`${f.day}: ${skycodes[f.skycodeday]} ${f.skytextday} ${f.low} - ${f.high} C, precipitation ${f.precip}%`);
				a(memory, f.skytextday, f.skycodeday);
			}
			await channel.send(message.join('\n'));
		}

		console.log('DONE');
	}
}
