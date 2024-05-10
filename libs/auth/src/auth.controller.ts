import { Controller, Get, Post, Body, Patch, Param, Delete, VERSION_NEUTRAL, Version, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignupDto } from './dto/signup.dto'
import { SigninDto } from './dto/signin.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { JwtAuthGuard } from '@jwt/jwt-auth.guard'
import { HttpRestType } from '@libs/custom-types/http-rest.type'
import { User } from './users.schema'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/signup')
	async signup(@Body() body: SignupDto): Promise<HttpRestType> {
		const createdUser = await this.authService.signup(body)
		const result: HttpRestType = {
			pagination: null,
			data: createdUser,
			error: false,
			message: { code: 'sucess', text: 'success' }
		}
		return result
	}

	@Post('/signin')
	async signin(@Body() signinDto: SigninDto): Promise<HttpRestType> {
		try {
			const signedInUser = await this.authService.signin(signinDto)
			const result: HttpRestType = {
				pagination: null,
				data: signedInUser,
				error: false,
				message: { text: 'success', code: 'success' }
			}

			return result
		} catch (error) {
			throw new Error(error)
		}
	}

	@UseGuards(JwtAuthGuard)
	@Post('a')
	findOne(@Param('id') id: string) {
		return this.authService.findOne(+id)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
		return this.authService.update(+id, updateAuthDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.authService.remove(+id)
	}
}
