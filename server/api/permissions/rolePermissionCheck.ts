import * as jwt from 'jsonwebtoken';
import { Database } from '../../database/database';

export class Permission {
    private jwtToken: any;
    database: Database

    constructor(jwtToken: any) {
        this.database = new Database();
        this.jwtToken = jwtToken
    }
    public async checkRolePermissions(role: string, manuallyDefinedUsername?: string): Promise<boolean> {
        const decodedToken = jwt.decode(this.jwtToken);
        if (decodedToken !== null && typeof decodedToken === 'object') {
            const username = manuallyDefinedUsername || decodedToken.username;
            
            const userrole = await this.database.executeSQL(`SELECT role From users WHERE username = "${username}"`);

            if (userrole[0] && userrole[0].role) {
                const check = await this.database.executeSQL(`SELECT ${role} FROM roles_permissions WHERE rolename = "${userrole[0].role}"`);
                const roleValue = check[0][role];
            
                if (roleValue === 1) {
                    return true;
                } else {
                    return false;
                }
              } else {
                console.error('Rolleninformation nicht gefunden');
                return false;
              }
            

        } else {
            return false;
        }
      }
    
}