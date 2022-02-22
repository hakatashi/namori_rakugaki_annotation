import qs from 'querystring';
import {OAuth} from 'oauth';
import dotenv from 'dotenv';

dotenv.config();

const twitter = (method: 'GET' | 'POST', endpoint: string, parameters: {[key: string]: string}) => {
	const keys = {
		consumer_key: process.env.CONSUMER_KEY,
		consumer_secret: process.env.CONSUMER_SECRET,
		access_token_secret: process.env.ACCESS_TOKEN_SECRET,
		access_token: process.env.ACCESS_TOKEN,
	};

	const oauth = new OAuth(
		'https://api.twitter.com/oauth/request_token',
		'https://api.twitter.com/oauth/access_token',
		keys.consumer_key,
		keys.consumer_secret,
		'1.0A',
		null,
		'HMAC-SHA1',
	);

	const domain = `${endpoint.startsWith('media/') ? 'upload' : 'api'}.twitter.com`;

	return new Promise<any>((resolve, reject) => {
		if (method === 'GET') {
			oauth.get(
				`https://${domain}/1.1/${endpoint}.json?${qs.stringify(parameters)}`,
				keys.access_token,
				keys.access_token_secret,
				(error, d) => {
					if (error) {
						reject(error);
					} else if (d) {
						resolve(JSON.parse(d.toString()));
					} else {
						reject(new Error('No data'));
					}
				},
			);
		} else {
			oauth.post(
				`https://${domain}/1.1/${endpoint}.json`,
				keys.access_token,
				keys.access_token_secret,
				parameters,
				'application/x-www-form-urlencoded',
				(error, d) => {
					if (error) {
						reject(error);
					} else if (d) {
						resolve(JSON.parse(d.toString()));
					} else {
						reject(new Error('No data'));
					}
				},
			);
		}
	});
};

interface Medium {
	tweetId: string,
	id: string,
	url: string,
}

(async () => {
	const media: Medium[] = [];

	let maxId: string | null = null;
	while (true) {
		console.error(`Fetching tweets... (maxId = ${maxId})`);
		const tweets: any = await twitter('GET', 'statuses/user_timeline', {
			screen_name: '_namori_',
			count: '200',
			exclude_replies: 'true',
			trim_user: 'true',
			include_rts: 'false',
			...(maxId ? {max_id: maxId} : {}),
		});

		if (tweets.length <= 1) {
			break;
		}

		maxId = tweets[tweets.length - 1].id_str;

		for (const tweet of tweets) {
			if (tweet.hasOwnProperty('extended_entities')) {
				const infos = tweet.extended_entities.media || [];
				for (const info of infos.reverse()) {
					media.push({
						tweetId: tweet.id_str,
						id: info.id_str,
						url: info.media_url_https,
					});
				}
			}
		}
	}

	const lines = media.reverse().map(({tweetId, id, url}) => [
		`=HYPERLINK("https://twitter.com/_namori_/status/${tweetId}", "${tweetId}")`,
		id,
		url,
		`=HYPERLINK("${url}?name=orig", IMAGE("${url}?name=orig"))`,
	].join('\t'));
	/*
	const lines = media.reverse().map(({tweetId, id, url}) => [tweetId, id, url].join(','));
	*/
	console.log(lines.join('\n'));
})();
