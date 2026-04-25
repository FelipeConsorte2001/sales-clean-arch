import { CategoryOutput } from '@/category/application/dtos/category-output'
import { randomUUID } from 'node:crypto'
import { CategoryController } from '../../category.controller'
import { CreateCategoryDto } from '../../dtos/createCategory.dto'
import { CategoryPresenter } from '../../presenters/category.presenter'

describe('CategoryController unit tests', () => {
  let sut: CategoryController
  let id: string
  let props: CategoryOutput

  beforeEach(() => {
    sut = new CategoryController()
    id = randomUUID()
    props = {
      createdAt: new Date(),
      name: 'name',
      id,
      updatedAt: new Date(),
    }
  })

  it('Should sut be defined', () => {
    expect(sut).toBeDefined()
  })

  it('Should create a user', async () => {
    const output = props
    const mockCreateUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['CreateUseCase'] = mockCreateUseCase as any
    const input: CreateCategoryDto = {
      name: 'name',
    }
    const presenter = await sut.createCategory(input)
    expect(presenter).toBeInstanceOf(CategoryPresenter)
    expect(presenter).toStrictEqual(new CategoryPresenter(output))
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input)
  })
})
