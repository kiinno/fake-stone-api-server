import app from '../app';
import { createServer } from 'http';
import { config } from 'dotenv';

import onLisiten from './onLisiten';
import { connect } from 'mongoose';

// Loading environment variables
config({
	path: './.env',
});

const server = createServer(app);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Connect to database server => mongoose server

let { DB_URI = 'mongodb://127.0.0.1' } = process.env;
const { DB_NAME = 'fake-stone-api', DB_PASS = '', DB_USER = '' } = process.env;

DB_URI = DB_URI.replace('<username>', DB_USER).replace('<password>', DB_PASS) + `/${DB_NAME}`;

connect(DB_URI).then(function (connection): void {
	const { host: db_host, port: db_port, name: db_name } = connection.connections[0];
	console.log(`Connected successfuly with database server at ${db_host}:${db_port} on '${db_name}'`);

	// Run the server after the connection has been established with the database
	server.listen(+PORT, HOST, onLisiten(+PORT, HOST));
});

// Unhandled Rejection -> Node.JS Event
process.on('unhandledRejection', function (reason): void {
	console.log('Unhandled Rejection at:', reason);
});
