// tests/services/auth.service.test.ts
/* -------------------------------------------------------------------------- */
/* 1️⃣ MOCKS DE DEPENDENCIAS                                                  */
/* -------------------------------------------------------------------------- */
jest.mock('../../src/models/user.entity');

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

// 🛠️  marcamos como ESModule para que el named import funcione
jest.mock('../../src/utils/jwt', () => ({
  __esModule: true,
  generateToken: jest.fn(),
}));

/* -------------------------------------------------------------------------- */
/* 2️⃣ IMPORTS DESPUÉS DE LOS MOCKS (Jest los remonta)                        */
/* -------------------------------------------------------------------------- */
import { login } from '../../src/services/auth.service';
import { User } from '../../src/models/user.entity';
import * as jwtUtils from '../../src/utils/jwt';
import bcrypt from 'bcryptjs';

/* -------------------------------------------------------------------------- */
/* 3️⃣ ALIASES TIPADOS                                                        */
/* -------------------------------------------------------------------------- */
const mockedUser          = User as jest.Mocked<typeof User>;
const mockedCompare       = bcrypt.compare as jest.Mock;
const mockedGenerateToken = jwtUtils.generateToken as jest.Mock;

/* -------------------------------------------------------------------------- */
/* 4️⃣ TESTS                                                                  */
/* -------------------------------------------------------------------------- */
describe('authService.login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lanza error si el usuario no existe', async () => {
    mockedUser.findOneBy.mockResolvedValue(null);

    await expect(login('fake@mail.com', '123456'))
      .rejects.toThrow('Credenciales inválidas');
  });

  it('lanza error si la contraseña no coincide', async () => {
    mockedUser.findOneBy.mockResolvedValue({
      email: 'test@mail.com',
      password: 'hashedpw',
      verified: true,
    } as any);

    mockedCompare.mockResolvedValue(false);

    await expect(login('test@mail.com', 'wrongpw'))
      .rejects.toThrow('Credenciales inválidas');

    expect(mockedCompare).toHaveBeenCalledWith('wrongpw', 'hashedpw');
  });

  it('lanza error si el usuario no está verificado', async () => {
    mockedUser.findOneBy.mockResolvedValue({
      email: 'test@mail.com',
      password: 'hashedpw',
      verified: false,
    } as any);

    mockedCompare.mockResolvedValue(true);

    await expect(login('test@mail.com', '123456'))
      .rejects.toThrow('Usuario no verificado');
  });

  it('devuelve token si usuario y password son correctos', async () => {
    mockedUser.findOneBy.mockResolvedValue({
      id: '123',
      email: 'test@mail.com',
      password: 'hashedpw',
      verified: true,
    } as any);

    mockedCompare.mockResolvedValue(true);
    mockedGenerateToken.mockReturnValue('token123');

    const result = await login('test@mail.com', '123456');

    expect(result).toEqual({
      user : expect.objectContaining({ email: 'test@mail.com' }),
      token: 'token123',
    });
    expect(mockedGenerateToken).toHaveBeenCalledWith({ id: '123', email: 'test@mail.com' });
  });
});
