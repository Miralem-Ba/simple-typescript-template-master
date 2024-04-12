import { Permission } from './rolePermissionCheck'; // Pfad anpassen
import * as jwt from 'jsonwebtoken';
import { Database } from '../../database/database'; // Pfad anpassen

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn()
}));

jest.mock('../../database/database', () => {
  return {
    Database: jest.fn().mockImplementation(() => {
      return {
        executeSQL: jest.fn()
      };
    })
  };
});

describe('Permission class', () => {
  let permission: Permission;
  const token = 'faketoken';
  let mockDecode: jest.Mock;
  let mockExecuteSQL: jest.Mock;

  beforeEach(() => {
    permission = new Permission(token);
    mockDecode = jwt.decode as jest.Mock;
    mockExecuteSQL = permission.database.executeSQL as jest.Mock;
  });

  it('should return true if the user has the correct role permissions', async () => {
    mockDecode.mockReturnValue({ username: 'testuser' });
    mockExecuteSQL.mockResolvedValueOnce([{ role: 'admin' }])
                   .mockResolvedValueOnce([{ admin: 1 }]);

    const result = await permission.checkRolePermissions('admin');
    expect(result).toBe(true);
  });

  it('should return false if the user does not have the role', async () => {
    mockDecode.mockReturnValue({ username: 'testuser' });
    mockExecuteSQL.mockResolvedValueOnce([]); // Kein Benutzer gefunden

    const result = await permission.checkRolePermissions('admin');
    expect(result).toBe(false);
  });

  it('should return false if the role does not have the required permission', async () => {
    mockDecode.mockReturnValue({ username: 'testuser' });
    mockExecuteSQL.mockResolvedValueOnce([{ role: 'user' }])
                   .mockResolvedValueOnce([{ admin: 0 }]);

    const result = await permission.checkRolePermissions('admin');
    expect(result).toBe(false);
  });

  it('should return false if the jwt token cannot be decoded', async () => {
    mockDecode.mockReturnValue(null);

    const result = await permission.checkRolePermissions('admin');
    expect(result).toBe(false);
  });

  it('should use manually defined username if provided', async () => {
    mockDecode.mockReturnValue({ username: 'defaultuser' });
    mockExecuteSQL.mockResolvedValueOnce([{ role: 'admin' }])
                   .mockResolvedValueOnce([{ admin: 1 }]);

    const result = await permission.checkRolePermissions('admin', 'manualuser');
    expect(mockExecuteSQL).toHaveBeenCalledWith(expect.stringContaining('manualuser'));
    expect(result).toBe(true);
  });
});
