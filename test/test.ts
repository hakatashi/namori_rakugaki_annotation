import * as fs from 'fs-extra';
import * as path from 'path';
import {parse} from 'csv-parse';

describe('namori.csv', () => {
	let data = '';

	beforeAll(async () => {
		data = await fs.readFile(path.join(__dirname, '../namori.csv'), 'utf8');
	});

	it('is valid', async () => {
		expect(data).not.toBeFalsy();

		const rows = await new Promise<Record<string, string>[]>((resolve, reject) => {
			parse(data, {columns: true}, (error, result) => {
				if (error) {
					reject(error)
				} else {
					resolve(result);
				}
			});
		});

		for (const row of rows) {
			expect(Object.keys(row)).toHaveLength(6);

			const {tweet_id, media_id, image_url, character_name, character_ruby, work_name} = row;
			
			expect(tweet_id).toMatch(/^\d+$/);
			expect(media_id).toMatch(/^\d+$/);
			expect(image_url).toMatch(/^https:\/\//);
			expect(character_name).toBeTruthy();
			expect(character_ruby).toMatch(/^[あ-んゔー、\d &]+$/)
			expect(work_name).toBeTruthy();
		}
	});
});