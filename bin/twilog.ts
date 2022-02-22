import qs from 'querystring';
import {OAuth} from 'oauth';
import axios from 'axios';
import cheerio from 'cheerio';

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

const urls = [
	'https://twilog.org/Ixy/month-2006/norep',
	'https://twilog.org/Ixy/month-2005/norep',
	'https://twilog.org/Ixy/month-2004/norep',
	'https://twilog.org/Ixy/month-2003/norep',
	'https://twilog.org/Ixy/month-2002/norep',
	'https://twilog.org/Ixy/month-2001/norep',
	'https://twilog.org/Ixy/month-1912/norep',
	'https://twilog.org/Ixy/month-1911/norep',
	'https://twilog.org/Ixy/month-1910/norep',
	'https://twilog.org/Ixy/month-1909/norep',
	'https://twilog.org/Ixy/month-1908/norep',
	'https://twilog.org/Ixy/month-1907/norep',
	'https://twilog.org/Ixy/month-1906/norep',
	'https://twilog.org/Ixy/month-1905/norep',
	'https://twilog.org/Ixy/month-1904/norep',
	'https://twilog.org/Ixy/month-1903/norep',
	'https://twilog.org/Ixy/month-1902/norep',
	'https://twilog.org/Ixy/month-1901/norep',
	'https://twilog.org/Ixy/month-1812/norep',
	'https://twilog.org/Ixy/month-1811/norep',
	'https://twilog.org/Ixy/month-1810/norep',
	'https://twilog.org/Ixy/month-1809/norep',
	'https://twilog.org/Ixy/month-1808/norep',
	'https://twilog.org/Ixy/month-1807/norep',
	'https://twilog.org/Ixy/month-1806/norep',
	'https://twilog.org/Ixy/month-1805/norep',
	'https://twilog.org/Ixy/month-1804/norep',
	'https://twilog.org/Ixy/month-1803/norep',
	'https://twilog.org/Ixy/month-1802/norep',
	'https://twilog.org/Ixy/month-1801/norep',
	'https://twilog.org/Ixy/month-1712/norep',
	'https://twilog.org/Ixy/month-1708/norep',
	'https://twilog.org/Ixy/month-1707/norep',
	'https://twilog.org/Ixy/month-1705/norep',
	'https://twilog.org/Ixy/month-1704/norep',
	'https://twilog.org/Ixy/month-1703/norep',
	'https://twilog.org/Ixy/month-1702/norep',
	'https://twilog.org/Ixy/month-1701/norep',
	'https://twilog.org/Ixy/month-1612/norep',
	'https://twilog.org/Ixy/month-1610/norep',
	'https://twilog.org/Ixy/month-1609/norep',
	'https://twilog.org/Ixy/month-1608/norep',
	'https://twilog.org/Ixy/month-1607/norep',
	'https://twilog.org/Ixy/month-1606/norep',
	'https://twilog.org/Ixy/month-1603/norep',
	'https://twilog.org/Ixy/month-1602/norep',
	'https://twilog.org/Ixy/month-1601/norep',
	'https://twilog.org/Ixy/month-1512/norep',
	'https://twilog.org/Ixy/month-1511/norep',
	'https://twilog.org/Ixy/month-1510/norep',
	'https://twilog.org/Ixy/month-1509/norep',
	'https://twilog.org/Ixy/month-1508/norep',
	'https://twilog.org/Ixy/month-1506/norep',
	'https://twilog.org/Ixy/month-1505/norep',
	'https://twilog.org/Ixy/month-1504/norep',
	'https://twilog.org/Ixy/month-1503/norep',
	'https://twilog.org/Ixy/month-1501/norep',
	'https://twilog.org/Ixy/month-1412/norep',
	'https://twilog.org/Ixy/month-1411/norep',
	'https://twilog.org/Ixy/month-1410/norep',
	'https://twilog.org/Ixy/month-1409/norep',
	'https://twilog.org/Ixy/month-1406/norep',
	'https://twilog.org/Ixy/month-1405/norep',
	'https://twilog.org/Ixy/month-1402/norep',
	'https://twilog.org/Ixy/month-1401/norep',
	'https://twilog.org/Ixy/month-1312/norep',
	'https://twilog.org/Ixy/month-1311/norep',
	'https://twilog.org/Ixy/month-1310/norep',
	'https://twilog.org/Ixy/month-1308/norep',
	'https://twilog.org/Ixy/month-1307/norep',
	'https://twilog.org/Ixy/month-1305/norep',
	'https://twilog.org/Ixy/month-1304/norep',
	'https://twilog.org/Ixy/month-1303/norep',
	'https://twilog.org/Ixy/month-1302/norep',
	'https://twilog.org/Ixy/month-1301/norep',
	'https://twilog.org/Ixy/month-1212/norep',
	'https://twilog.org/Ixy/month-1211/norep',
	'https://twilog.org/Ixy/month-1210/norep',
	'https://twilog.org/Ixy/month-1209/norep',
	'https://twilog.org/Ixy/month-1208/norep',
	'https://twilog.org/Ixy/month-1207/norep',
	'https://twilog.org/Ixy/month-1206/norep',
	'https://twilog.org/Ixy/month-1205/norep',
	'https://twilog.org/Ixy/month-1204/norep',
	'https://twilog.org/Ixy/month-1203/norep',
	'https://twilog.org/Ixy/month-1202/norep',
	'https://twilog.org/Ixy/month-1201/norep',
	'https://twilog.org/Ixy/month-1112/norep',
	'https://twilog.org/Ixy/month-1111/norep',
	'https://twilog.org/Ixy/month-1110/norep',
	'https://twilog.org/Ixy/month-1109/norep',
	'https://twilog.org/Ixy/month-1108/norep',
	'https://twilog.org/Ixy/month-1107/norep',
	'https://twilog.org/Ixy/month-1106/norep',
	'https://twilog.org/Ixy/month-1105/norep',
	'https://twilog.org/Ixy/month-1104/norep',
	'https://twilog.org/Ixy/month-1103/norep',
	'https://twilog.org/Ixy/month-1102/norep',
	'https://twilog.org/Ixy/month-1101/norep',
	'https://twilog.org/Ixy/month-1012/norep',
	'https://twilog.org/Ixy/month-1011/norep',
	'https://twilog.org/Ixy/month-1010/norep',
	'https://twilog.org/Ixy/month-1009/norep',
	'https://twilog.org/Ixy/month-1008/norep',
	'https://twilog.org/Ixy/month-1007/norep',
	'https://twilog.org/Ixy/month-1006/norep',
	'https://twilog.org/Ixy/month-1005/norep',
	'https://twilog.org/Ixy/month-1004/norep',
	'https://twilog.org/Ixy/month-1003/norep',
];

(async () => {
	const ids = [];

	for (const url of urls) {
		for (const i of Array(10).keys()) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.error(`Fetching ${url}-${i + 1}`);
			const {data} = await axios.get(`${url}-${i + 1}`);
			const $ = cheerio.load(data);
			if ($('.tl-tweet').length === 0) {
				break;
			}
			$('p.tl-image').each((_, el) => {
				const id = $(el).parent().attr('id') || '';
				ids.push(id.slice(2));
			});
		}
	}

	for (const id of ids.reverse()) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.error(`Fetching ${id}`);
		try {
			const tweet: any = await twitter('GET', 'statuses/show', {id});

			const media: Medium[] = [];

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

			if (media.length === 0) {
				continue;
			}

			const lines = media.reverse().map(({tweetId, id, url}) => [
				`=HYPERLINK("https://twitter.com/Ixy/status/${tweetId}", "${tweetId}")`,
				id,
				url,
				`=HYPERLINK("${url}?name=orig", IMAGE("${url}?name=orig"))`,
			].join('\t'));
			console.log(lines.join('\n'));
		} catch (e) {
			continue;
		}
	}
})();

