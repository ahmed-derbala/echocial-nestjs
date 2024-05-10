import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SignupDto } from './dto/signup.dto'
import { SigninDto } from './dto/signin.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { Role } from '@libs/auth/roles/role.enum'
import { User } from './users.schema'
import { Session } from './sessions.schema'
import config from '@config'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name)
		private UserModel: Model<User>,
		@InjectModel(Session.name)
		private SessionModel: Model<Session>,

		private jwtService: JwtService
	) {}

	async signup(signupData: SignupDto) {
		let userToCreate: any = signupData
		//check if user already exists
		const userExists = await this.UserModel.findOne({ email: signupData.email }).select('_id').lean()

		if (userExists) throw new HttpException(`Email ${signupData.email} already used.`, HttpStatus.CONFLICT)

		const salt = bcrypt.genSaltSync(config().auth.saltOrRounds)
		userToCreate.password = bcrypt.hashSync(signupData.password, salt)
		//default role
		userToCreate.roles = [Role.User]
		const createdUser = await this.UserModel.create(userToCreate)
		let createdUserJSON = createdUser.toJSON()
		delete createdUserJSON.password
		return createdUserJSON
	}

	async signin(signinData: SigninDto) {
		try {
			const user = await this.UserModel.findOne({ email: signinData.email }).lean().select('password email roles permissions')

			if (!user) throw new HttpException(`User ${signinData.email} not found`, HttpStatus.NOT_FOUND)

			//user found, check password
			//console.log(user)

			const passwordCompare = bcrypt.compareSync(signinData.password, user.password)
			delete user.password //we dont need password anymore

			if (passwordCompare == false) {
				throw UnauthorizedException
			}
			//signin success
			const accessToken = this.jwtService.sign(user)
			let session: Session
			session = { accessToken, user }
			//store session info
			const createdSession = await this.SessionModel.create(session)
			//console.log(user,'user signin token');
			return { accessToken, user }
		} catch (error) {
			throw new Error(error)
		}
	}

	findOne(id: number) {
		return `This action returns a #${id} auth`
	}

	update(id: number, updateAuthDto: UpdateAuthDto) {
		return `This action updates a #${id} auth`
	}

	remove(id: number) {
		return `This action removes a #${id} auth`
	}
}
