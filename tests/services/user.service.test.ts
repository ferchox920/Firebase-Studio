// tests/services/user.service.test.ts
/* -------------------------------------------------------------------------- */
/* 1️⃣ MOCKS BASE                                                             */
/* -------------------------------------------------------------------------- */
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('../../src/models/user.entity');
jest.mock('../../src/mails/sendVerificationEmail', () => ({
  sendVerificationEmail: jest.fn(),
}));
jest.mock('bcrypt', () => ({ hash: jest.fn() }));

/* -------------------------------------------------------------------------- */
/* 2️⃣ IMPORTS (ya apuntan a mocks)                                           */
/* -------------------------------------------------------------------------- */
import bcrypt from 'bcrypt';
import * as mailer from '../../src/mails/sendVerificationEmail';
import { User } from '../../src/models/user.entity';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../../src/services/user.service';

/* -------------------------------------------------------------------------- */
/* 3️⃣ ALIASES DE LOS MOCKS                                                   */
/* -------------------------------------------------------------------------- */
const mockedHash = bcrypt.hash as jest.Mock;
const mockedMailer = mailer.sendVerificationEmail as jest.Mock;
const mockedUser = User as jest.Mocked<typeof User>;

/* -------------------------------------------------------------------------- */
/* 4️⃣ SUITE DE TESTS                                                         */
/* -------------------------------------------------------------------------- */
describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedHash.mockResolvedValue('hashed_password');
  });

  /* ----------------------------- createUser ------------------------------ */
  describe('createUser', () => {
    it('lanza error si el email ya existe', async () => {
      mockedUser.findOneBy.mockResolvedValue({ id: 'existing' } as any);

      await expect(
        createUser({
          name: 'Test',
          email: 'dup@mail.com',
          password: '123',
          role: 'user',
        }),
      ).rejects.toThrow('El correo electrónico ya está en uso');
    });

    it('crea usuario, hashea pass y envía OTP si es nuevo', async () => {
      mockedUser.findOneBy.mockResolvedValue(null);
      const saveMock = jest.fn().mockResolvedValue({ id: '1', email: 'test@mail' });
      mockedUser.create.mockReturnValue({ save: saveMock } as any);

      const res = await createUser({
        name: 'Nuevo',
        email: 'test@mail',
        password: '123',
        role: 'user',
      });

      expect(mockedHash).toHaveBeenCalledWith('123', 10);
      expect(saveMock).toHaveBeenCalled();
      expect(res.id).toBe('1');
      expect(mockedMailer).toHaveBeenCalledWith('test@mail', expect.any(String));
    });
  });

  /* ----------------------------- getAllUsers ----------------------------- */
  describe('getAllUsers', () => {
    it('devuelve lista vacía si no hay registros', async () => {
      mockedUser.find.mockResolvedValue([]);
      const res = await getAllUsers();
      expect(res).toEqual([]);
    });

    it('devuelve usuarios cuando existen', async () => {
      const list = [{ id: '1' }, { id: '2' }] as any;
      mockedUser.find.mockResolvedValue(list);
      const res = await getAllUsers();
      expect(res).toBe(list);
    });
  });

  /* ----------------------------- getUserById ----------------------------- */
  describe('getUserById', () => {
    it('retorna null si no existe', async () => {
      mockedUser.findOneBy.mockResolvedValue(null);
      expect(await getUserById('x')).toBeNull();
    });

    it('retorna usuario si existe', async () => {
      const u = { id: '1' } as any;
      mockedUser.findOneBy.mockResolvedValue(u);
      expect(await getUserById('1')).toBe(u);
    });
  });

  /* ------------------------------ updateUser ----------------------------- */
  describe('updateUser', () => {
    it('retorna null si no existe', async () => {
      mockedUser.findOneBy.mockResolvedValue(null);
      expect(await updateUser('no', { name: 'A' })).toBeNull();
    });

    it('actualiza campos y guarda', async () => {
      const save = jest.fn().mockResolvedValue({ id: '1', name: 'Nuevo' });
      mockedUser.findOneBy.mockResolvedValue({ id: '1', name: 'Viejo', save } as any);

      const res = await updateUser('1', { name: 'Nuevo' });
      expect(save).toHaveBeenCalled();
      expect(res).toEqual({ id: '1', name: 'Nuevo' });
    });
  });

  /* ------------------------------ deleteUser ----------------------------- */
  describe('deleteUser', () => {
    it('devuelve false si no se afectó nada', async () => {
      mockedUser.delete.mockResolvedValue({ affected: 0 } as any);
      expect(await deleteUser('bad')).toBe(false);
    });

    it('devuelve true al eliminar', async () => {
      mockedUser.delete.mockResolvedValue({ affected: 1 } as any);
      expect(await deleteUser('good')).toBe(true);
    });
  });
});
