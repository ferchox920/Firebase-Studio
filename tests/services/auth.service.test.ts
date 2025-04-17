// tests/services/auth.service.test.ts

import { login } from '../../src/services/auth.service';
import { User } from '../../src/models/user.entity';
import * as jwtUtils from '../../src/utils/jwt';
import bcrypt from 'bcryptjs';

// 1. Mock de los módulos externos
jest.mock('../../src/models/user.entity');
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));
jest.mock('../../src/utils/jwt', () => ({
  generateToken: jest.fn(),
}));

// 2. Tipado de los mocks como jest.Mock
const mockedUser = User as jest.Mocked<typeof User>;
const mockedCompare = bcrypt.compare as jest.Mock;                   // 👈 aquí
const mockedGenerateToken = jwtUtils.generateToken as jest.Mock;     // 👈 y aquí

describe('authService.login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe lanzar error si el usuario no existe', async () => {
    mockedUser.findOneBy.mockResolvedValue(null);

    await expect(login('fake@mail.com', '123456'))
      .rejects
      .toThrow('Credenciales inválidas');
  });

  it('debe lanzar error si la contraseña no coincide', async () => {
    mockedUser.findOneBy.mockResolvedValue({
      email: 'test@mail.com',
      password: 'hashedpw',
      verified: true,
    } as any);

    mockedCompare.mockResolvedValue(false);

    await expect(login('test@mail.com', 'wrongpw'))
      .rejects
      .toThrow('Credenciales inválidas');

    expect(mockedCompare).toHaveBeenCalledWith('wrongpw', 'hashedpw');
  });

  it('debe lanzar error si el usuario no está verificado', async () => {
    mockedUser.findOneBy.mockResolvedValue({
      email: 'test@mail.com',
      password: 'hashedpw',
      verified: false,
    } as any);

    mockedCompare.mockResolvedValue(true);

    await expect(login('test@mail.com', '123456'))
      .rejects
      .toThrow('Usuario no verificado');
  });

  it('debe devolver un token si el usuario es válido y verificado', async () => {
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
      user: expect.objectContaining({ email: 'test@mail.com' }),
      token: 'token123',
    });

    expect(mockedGenerateToken).toHaveBeenCalledWith({ id: '123', email: 'test@mail.com' });
  });
});
