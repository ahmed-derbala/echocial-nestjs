import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import compression from '@fastify/compress'
import { constants } from 'zlib'
import helmet from '@fastify/helmet'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import fastifyCsrf from '@fastify/csrf-protection'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { Logger } from 'nestjs-pino'
import config from '@config'

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: true }))
	//app.useLogger(app.get(Logger))

	await app.register(helmet)
	await app.register(compression, {
		encodings: ['gzip', 'deflate'],
		brotliOptions: { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } }
	})
	await app.register(fastifyCsrf)

	app.enableCors()
	app.enableVersioning({
		type: VersioningType.HEADER,
		header: 'api-version'
	})

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			enableDebugMessages: true
		})
	)

	const documentBuilder = new DocumentBuilder()
		.setTitle(config().app.name)
		.setDescription(config().app.description)
		.setVersion(config().app.version)
		.addTag(config().app.name)
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				name: 'JWT',
				description: 'Enter JWT token',
				in: 'header'
			}
			//'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
		)
		.build()
	const document = SwaggerModule.createDocument(app, documentBuilder)
	SwaggerModule.setup('docs', app, document)

	await app.listen(5000, '0.0.0.0')
}
bootstrap()
