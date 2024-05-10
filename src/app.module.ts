import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiModule } from './api/api.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { CacheModule } from '@nestjs/cache-manager'
import { AuthModule } from '@libs/auth/auth.module'
import { MongooseModule } from '@nestjs/mongoose'
import { BullModule } from '@nestjs/bull'
import { LoggerModule } from 'nestjs-pino'
import config from '@config'

@Module({
	imports: [
		ApiModule,
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 10
			}
		]),
		CacheModule.register({
			isGlobal: true,
			ttl: 30000
		}),
		AuthModule,
		MongooseModule.forRoot(config().db.mongo.uri),
		BullModule.forRoot({
			redis: {
				host: 'localhost',
				port: 6379
			}
		})
		//LoggerModule.forRoot()
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
