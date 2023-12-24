import { MODEL_INDEX } from '../../../constants/index.js';
import modelEngine from './modelEngine.js';

const schema = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		banner: { type: 'string' },
		profileImg: { type: 'string' },
		heading: { type: 'string' },
		subHeading: { type: 'string' },
		socials: {
			type: 'object',
			properties: {
				gaffar: { type: 'string' },
				email: { type: 'string' },
				twitter: { type: 'string' },
			},
		},
		highlights: {
			type: 'array',
			items: {
				type: 'string',
			},
		},
		description: { type: 'string' },
	},
	required: [
		'id',
		'banner',
		'profileImg',
		'heading',
		'subHeading',
		'socials',
		'highlights',
		'description',
	],
};

const sampleData = {
	id: 'uuid',
	banner: 'url',
	profileImg: 'url',
	heading: 'heading',
	subHeading: 'sub heading',
	socials: {
		gaffar: 'id',
		email: 'email',
		twitter: 'id',
	},
	highlights: ['hightlight1', 'hightlight2', 'hightlight3', 'hightlight4'],
	description: 'description goes here',
};

const Page = modelEngine(schema, MODEL_INDEX.PAGES);

export default Page;
