import 'dotenv/config';
import {google} from 'googleapis';

(async () => {
	const auth = await new google.auth.GoogleAuth({
		scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	}).getClient();
	const sheets = google.sheets({ version: 'v4', auth });

	const sheetsData = await new Promise<string[][]>((resolve, reject) => {
		sheets.spreadsheets.values.get({
			spreadsheetId: '1pyd2LjAI2vjjDFlRc21V2yFxSmtity7x42zDDrKyAWk',
			range: 'ixy!A:H',
		}, (error, response) => {
			if (error) {
				reject(error);
			} else if (response!.data.values) {
				resolve(response!.data.values as string[][]);
			} else {
				reject(new Error('values not found'));
			}
		});
	});

	console.log('tweet_id,media_id,image_url,character_name,character_ruby,work_name,rating');

	for (const [tweetId, mediaId, url, _, characterName, characterRuby, workName, rating] of sheetsData) {
		if (Number.isNaN(parseInt(tweetId))) {
			continue;
		}

		if (characterName && characterName !== '-' && characterName !== '?' && !characterName.startsWith('(')) {
			const normalizedWorkName = workName.includes(',') ? `"${workName}"` : workName;
			console.log(`${tweetId},${mediaId},${url},${characterName},${characterRuby},${normalizedWorkName},${rating ?? '0'}`);
		}
	}
})();