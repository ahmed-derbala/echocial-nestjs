import { Test, TestingModule } from '@nestjs/testing'
import { CustomTypesService } from './custom-types.service'

describe('CustomTypesService', () => {
	let service: CustomTypesService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CustomTypesService]
		}).compile()

		service = module.get<CustomTypesService>(CustomTypesService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
