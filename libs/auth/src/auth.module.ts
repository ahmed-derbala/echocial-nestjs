import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from '@jwt/jwt.strategy'
import { User, UserSchema } from './users.schema'
import { Session, SessionSchema } from './sessions.schema'
import config from '@config'

@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Session.name, schema: SessionSchema }
		]),
		JwtModule.register({
			secret: config().auth.jwt.secret,
			signOptions: {
				expiresIn: config().auth.jwt.signOptions.expiresIn
			}
		})
	]
})
export class AuthModule {}
