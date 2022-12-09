const {google} = require('googleapis');

const configs = require('./const.js');
let privatekey = require("./service_account.json");


const enviroment = 'prod';
// const enviroment = 'dev';

function getData(params, cb) {
	const { spreadsheetId, key } = configs;
	const { range, type } = params;
	const sheets = google.sheets({version: 'v4'});
	sheets.spreadsheets.values.get({
		spreadsheetId,
		range: `${configs[type][enviroment]}${range ? `!${range}` : ''}`,
		key
	}, (err, res) => {
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows && rows.length && typeof cb === 'function') {
			cb(rows);
		}
		else {
			cb([])
		}
	});
}

function writeData(params, cb) {
	
	let jwtClient = new google.auth.JWT(
		privatekey.client_email,
		null,
		privatekey.private_key,
		['https://www.googleapis.com/auth/spreadsheets']);


	jwtClient.authorize(function (err, tokens) {
		if (err) {
			console.log(err);
			return;
		} else {
			console.log("Successfully connected!");
			const { spreadsheetId } = configs;
			const { range, values, type } = params;
			const sheets = google.sheets({version: 'v4'});
			sheets.spreadsheets.values.batchUpdate({
				auth: jwtClient,
				spreadsheetId,
				resource: {
					data: [{
						range: `${configs[type][enviroment]}${range ? `!${range}` : ''}`,
						values
					}],
					valueInputOption: 'USER_ENTERED',
				}
			}, (err, result) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Cells updated.');
				}
				cb(result, err)
			});
		}
	});
}

function appendData(params, cb) {
	const { content, range, type } = params;

	let jwtClient = new google.auth.JWT(
		privatekey.client_email,
		null,
		privatekey.private_key,
		['https://www.googleapis.com/auth/spreadsheets']);


	jwtClient.authorize(function (err, tokens) {
		if (err) {
			console.log(err);
			return;
		} else {
			console.log("Successfully connected!");
			const { spreadsheetId } = configs;
			const sheets = google.sheets({version: 'v4'});
			sheets.spreadsheets.values.append({
				auth: jwtClient,
				spreadsheetId,
				range: `${configs[type][enviroment]}${range ? `!${range}` : ''}`,
				valueInputOption: 'USER_ENTERED',
				resource: {
					values: [
						...content
					]
				}
			}, (err, result) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Cells updated.');
				}
				if (cb) cb(result, err)
			});
		}
	});
}

module.exports = {
	getData,
	writeData,
	appendData
};