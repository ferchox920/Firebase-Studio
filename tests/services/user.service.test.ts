// tests/services/user.service.test.ts

import bcrypt from 'bcrypt';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../../src/services/user.service';
import { User } from '../../src/models/user.entity';
import * as mailer from '../../src/mails/sendVerificationEmail';

// Mocks de módulos externos
jest.mock('../../src/models/user.entity');
jest.mock('../../src/mails/sendVerificationEmail');
jest.mock('bcrypt');

const mockedUser = User as jest.Mocked<typeof User>;
const mockedMailer = mailer.sendVerificationEmail as jest.Mock;
const mockedHash = bcrypt.hash as jest.Mock;

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Fijar hash para tests
    mockedHash.mockResolvedValue('hashed_password');
  });

  // --- createUser ---
  describe('createUser', () => {
    it('debe lanzar un error si el email ya existe', async () => {
      mockedUser.findOneBy.mockResolvedValue({ id: 'existing-id' } as any);

      await expect(
        createUser({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'user',
        })
      ).rejects.toThrow('El correo electrónico ya está en uso');

      expect(mockedUser.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('debe crear un usuario y enviar OTP si el email es nuevo', async () => {
      mockedUser.findOneBy.mockResolvedValue(null);

      // Simulamos la entidad y su método save()
      const saveMock = jest.fn().mockResolvedValue({
        id: 'new-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'user',
        verified: false,
        otp: 'ignored-otp',
      });
      mockedUser.create.mockReturnValue({ save: saveMock } as any);

      const result = await createUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
      });

      // Comprobaciones básicas
      expect(result.email).toBe('test@example.com');
      expect(mockedHash).toHaveBeenCalledWith('password123', 10);
      expect(saveMock).toHaveBeenCalled();

      // Verificamos que el mailer se haya invocado, sin chequear el OTP exacto
      expect(mockedMailer).toHaveBeenCalledTimes(1);
      expect(mockedMailer).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String)
      );
    });
  });

  // --- getAllUsers ---
  describe('getAllUsers', () => {
    it('debe devolver lista vacía si no hay usuarios', async () => {
      mockedUser.find.mockResolvedValue([]);
      const result = await getAllUsers();
      expect(result).toEqual([]);
    });

    it('debe devolver lista con usuarios si existen', async () => {
      const mockUsers = [{ id: '1', name: 'User 1' }, { id: '2', name: 'User 2' }] as any;
      mockedUser.find.mockResolvedValue(mockUsers);
      const result = await getAllUsers();
      expect(result).toEqual(mockUsers);
    });
  });

  // --- getUserById ---
  describe('getUserById', () => {
    it('debe devolver null si el usuario no existe', async () => {
      mockedUser.findOneBy.mockResolvedValue(null);
      const result = await getUserById('no-id');
      expect(result).toBeNull();
    });

    it('debe devolver el usuario si existe', async () => {
      const mockUser = { id: '1', name: 'User' } as any;
      mockedUser.findOneBy.mockResolvedValue(mockUser);
      const result = await getUserById('1');
      expect(result).toEqual(mockUser);
    });
  });

  // --- updateUser ---
  describe('updateUser', () => {
    it('debe devolver null si el usuario no existe', async () => {
      mockedUser.findOneBy.mockResolvedValue(null);
      const result = await updateUser('no-id', { name: 'Nuevo' });
      expect(result).toBeNull();
    });

    it('debe actualizar el usuario y devolverlo', async () => {
      const saveMock = jest.fn().mockResolvedValue({ id: '1', name: 'Nuevo' });
      const mockUser = { id: '1', name: 'Viejo', save: saveMock } as any;
      mockedUser.findOneBy.mockResolvedValue(mockUser);

      const result = await updateUser('1', { name: 'Nuevo' });
      expect(result).toEqual({ id: '1', name: 'Nuevo' });
      expect(saveMock).toHaveBeenCalled();
    });
  });

  // --- deleteUser ---
  describe('deleteUser', () => {
    it('debe devolver false si no se elimina ningún usuario', async () => {
      mockedUser.delete.mockResolvedValue({ affected: 0 } as any);
      const result = await deleteUser('invalid-id');
      expect(result).toBe(false);
    });

    it('debe devolver true si se elimina correctamente', async () => {
      mockedUser.delete.mockResolvedValue({ affected: 1 } as any);
      const result = await deleteUser('valid-id');
      expect(result).toBe(true);
    });
  });
});
