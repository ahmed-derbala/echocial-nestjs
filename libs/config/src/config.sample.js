const packagejson = require('../../../package.json')

export default () => ({
	app: {
		name:packagejson.name,
		version: '1.0.0',
		description: packagejson.description
	},
	port: parseInt(process.env.PORT, 10) || 5000,
	db: {
		mongo: {
			uri: `mongodb://127.0.0.1/${packagejson.name}`,
			options: {
				maxPoolSize: 200,
				minPoolSize: 5
			}
		}
	},
	auth: {
		saltOrRounds: 10,
		jwt: {
			secret: packagejson.name,
			signOptions: {
				expiresIn: '30d'
			}
		}
	},
	NODE_ENV: 'local', //local or development or production
	throttler: {
		ttl: 60,
		limit: 10
	},
	logs: {
		logger: false
	},
	notifications: {
		email: true,
		sms: false
	},
	pagination: {
		mongoose: {
			minLimit: 1,
			defaultLimit: 100,
			maxLimit: 300
		}
	}
})
