import mongoose from 'mongoose';
import config from '../constants/config';

const { MONGO_URL } = config;

mongoose.connect(MONGO_URL, { dbName: 'projectX' });

const db = mongoose.connection;

db.on('error', (err) => {
	console.log('Error connecting to database', err);
});

db.once('open', function () {
	console.log('Connected to database...');
});

export default db;
