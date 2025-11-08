import { randomUUID } from 'crypto'
import { Entity } from '../../entity'

type StubProps = {
  prop1: string
  prop2: number
}

function uuidValidate(uuid: string): boolean {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i
  return regex.test(uuid)
}

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  it('should set props props and id', () => {
    const props = { prop1: 'valeu1', prop2: 15 }
    const entity = new StubEntity(props)
    expect(entity.props).toStrictEqual(props)
    expect(entity.id).not.toBeNull()
    expect(uuidValidate(entity._id)).toBeTruthy()
  })

  it('should accept a valid uuid', () => {
    const props = { prop1: 'valeu1', prop2: 15 }
    const id = randomUUID()
    const entity = new StubEntity(props, id)

    expect(uuidValidate(entity._id)).toBeTruthy()
    expect(entity._id).toBe(id)
  })

  it('should convert a entity to a json', () => {
    const props = { prop1: 'valeu1', prop2: 15 }
    const id = randomUUID()
    const entity = new StubEntity(props, id)

    expect(entity.toJSON()).toStrictEqual({ id, ...props })
  })
})
