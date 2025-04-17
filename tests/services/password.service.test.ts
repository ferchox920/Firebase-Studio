// tests/services/password.service.test.ts
/* -------------------------------------------------------------------------- */
/* 1️⃣ MOCKS INICIALES                                                        */
/* -------------------------------------------------------------------------- */
jest.mock('crypto', () => {
    const real = jest.requireActual<typeof import('crypto')>('crypto');
    return { ...real, randomInt: jest.fn() };
  });
  jest.mock('../../src/models/user.entity');
  jest.mock('../../src/models/passwordReset.entity');
  jest.mock('bcrypt', () => ({ hash: jest.fn() }));
  jest.mock('../../src/mails/sendVerificationEmail', () => ({
    sendVerificationEmail: jest.fn(),
  }));
  jest.mock('../../src/config/data-source', () => ({
    __esModule: true,
    default: { getRepository: jest.fn() },
  }));
  
  /* -------------------------------------------------------------------------- */
  /* 2️⃣ IMPORTS TRAS LOS MOCKS                                                 */
  /* -------------------------------------------------------------------------- */
  import crypto from 'crypto';
  import bcrypt from 'bcrypt';
  import AppDataSource from '../../src/config/data-source';
  import * as mailer from '../../src/mails/sendVerificationEmail';
  import { User } from '../../src/models/user.entity';
  import { PasswordReset } from '../../src/models/passwordReset.entity';
  import {
    requestPasswordResetService,
    resetPassword,
  } from '../../src/services/password.service';
  
  /* -------------------------------------------------------------------------- */
  /* 3️⃣ ALIASES                                                                */
  /* -------------------------------------------------------------------------- */
  const mockedMailer = mailer.sendVerificationEmail as jest.Mock;
  const mockedBcrypt = bcrypt.hash as jest.Mock;
  const mockedData   = AppDataSource as jest.Mocked<typeof AppDataSource>;
  const mockedUser   = User as jest.Mocked<typeof User>;
  const mockedReset  = PasswordReset as jest.Mocked<typeof PasswordReset>;
  
  /* -------------------------------------------------------------------------- */
  /* 4️⃣ FACTORY DE QUERY BUILDER DINÁMICO                                      */
  /* -------------------------------------------------------------------------- */
  const buildQB = (returnValue: any) => {
    // ① proxy handler: cualquier propiedad → función que devuelve this
    const chainHandler: ProxyHandler<any> = {
      get: (target, prop) => {
        if (prop === 'getOne')             // cerramos la cadena
          return jest.fn().mockResolvedValue(returnValue);
        if (!(prop in target))
          target[prop] = jest.fn().mockReturnThis();
        return target[prop];
      },
    };
  
    // ② proxy + acople al repo
    const qbProxy = new Proxy({}, chainHandler);
    mockedData.getRepository.mockReturnValue({
      createQueryBuilder: jest.fn(() => qbProxy),
    } as any);
    return qbProxy;
  };
  
  /* -------------------------------------------------------------------------- */
  /* 5️⃣ TESTS                                                                  */
  /* -------------------------------------------------------------------------- */
  describe('passwordService', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (crypto.randomInt as jest.Mock).mockReturnValue(123456);
    });
  
    describe('requestPasswordResetService', () => {
      it('no debe hacer nada si el email no existe', async () => {
        mockedUser.findOneBy.mockResolvedValue(null);
  
        await expect(requestPasswordResetService('no@mail.com'))
          .resolves.toBeUndefined();
  
        expect(mockedMailer).not.toHaveBeenCalled();
      });
  
      it('debe crear un registro y enviar OTP si el usuario existe', async () => {
        mockedUser.findOneBy.mockResolvedValue({ email: 'test@mail.com' } as any);
        mockedReset.create.mockReturnValue({
          save: jest.fn().mockResolvedValue(undefined),
        } as any);
  
        await requestPasswordResetService('test@mail.com');
  
        expect(mockedReset.create).toHaveBeenCalledWith({
          user: { email: 'test@mail.com' },
          otp : '123456',
        });
        expect(mockedMailer).toHaveBeenCalledWith('test@mail.com', '123456');
      });
    });
  
    describe('resetPassword', () => {
      it('debe lanzar error si no existe el request', async () => {
        buildQB(null);
  
        await expect(
          resetPassword('test@mail.com', '123456', 'newpass'),
        ).rejects.toThrow('Código de recuperación inválido');
      });
  
      it('debe lanzar error si el código expiró', async () => {
        buildQB({
          id: '1',
          otp: '123456',
          expires_at: new Date(Date.now() - 1000),
          user: { email: 'test@mail.com' },
        });
        const delMock = jest.fn();
        mockedReset.delete = delMock;
  
        await expect(
          resetPassword('test@mail.com', '123456', 'newpass'),
        ).rejects.toThrow('El código ha expirado');
  
        expect(delMock).toHaveBeenCalled();
      });
  
      it('debe actualizar contraseña, verificar usuario y borrar el token', async () => {
        const mockUser = { email: 'test@mail.com', save: jest.fn() } as any;
        mockedReset.delete = jest.fn();
        buildQB({
          id: '1',
          otp: '123456',
          expires_at: new Date(Date.now() + 10_000),
          user: mockUser,
        });
        mockedBcrypt.mockResolvedValue('hashedpw');
  
        await resetPassword('test@mail.com', '123456', 'newpass');
  
        expect(mockUser.password).toBe('hashedpw');
        expect(mockUser.verified).toBe(true);
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockedReset.delete).toHaveBeenCalledWith({ id: '1' });
      });
    });
  });
  