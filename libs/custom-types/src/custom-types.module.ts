import { Module } from '@nestjs/common'
import { CustomTypesService } from './custom-types.service'

@Module({
	providers: [CustomTypesService],
	exports: [CustomTypesService]
})
export class CustomTypesModule {}
