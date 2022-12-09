const keywords = require('../data/keyword.js');
const templates = require('../data/template.js');
const replaces = require('../data/replace.js');
const debtManager = require('./debt-manager/index.js');
const emojiHandler = require('./emoji/index.js');






function getMessageType(text) {
	return Object.keys(keywords).find((type) => {
		return keywords[type].find(key => text.split(" ").includes(key))
	})
}

function replaceValue(template, params) {
	let finalText = template;
	params.forEach(p => {
		const values = replaces[p];
		let value = '';
		if (typeof values === 'object') {
			const random = Math.floor(Math.random() * values.length);
			value = values[random];

		}
		finalText = finalText.replace(`[[${p}]]`, value);
	})
	return finalText;
}




function textHandler(event) {
	const type = event.message.text.split(" ");
	if (type) {
		switch (type[0]) {
			case 'nợ':
			debtManager(event)
			break;
			default:
			
		}
	}
	const message = event.message.text;
	if (message && message.length) {
		if (message[0] === ':' && message.length > 1) {
			let param = type[0];
			emojiHandler(event, param.replace(/:?/g, ''));
		}
		if (message.includes("bot")) {
			event.reply("Kêu em có việc chi không?");
		}
	}
}


module.exports = textHandler;
