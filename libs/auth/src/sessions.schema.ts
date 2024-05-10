import { PermissionsEnum } from '@libs/auth/permissions/permissions.enum'
import { Role } from '@libs/auth/roles/role.enum'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IsNotEmpty, IsString, IsEmail } from 'class-validator'
import { HydratedDocument } from 'mongoose'
import { User } from './users.schema'
import { ObjectId } from 'mongoose'

@Schema({ timestamps: true })
export class Session {
	@IsNotEmpty()
	@Prop({ required: true, type: Object })
	user: User

	@IsNotEmpty()
	@IsString()
	@Prop({ required: true })
	accessToken: String
}
export type SessionDocument = HydratedDocument<Session>

export const SessionSchema = SchemaFactory.createForClass(Session)
