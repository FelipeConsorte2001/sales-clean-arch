import { bcryptjsHashProvider } from '../../bcryptjs-hash.provider'

describe('bcryptjsHashProvider unit tests', () => {
  let sut: bcryptjsHashProvider
  beforeEach(() => {
    sut = new bcryptjsHashProvider()
  })
  it('Should return an encrypted password', async () => {
    const password = 'Teste123'
    const hash = await sut.generateHash(password)
    expect(hash).toBeDefined()
  })

  it('Should return return false on invalid passoword and hash comparison', async () => {
    const password = 'Teste123'
    const hash = await sut.generateHash(password)
    const result = await sut.compareHash('fake', hash)
    expect(result).toBeFalsy()
  })
  it('Should return return true on valid passoword and hash comparison', async () => {
    const password = 'Teste123'
    const hash = await sut.generateHash(password)
    const result = await sut.compareHash(password, hash)
    expect(result).toBeTruthy()
  })
})
