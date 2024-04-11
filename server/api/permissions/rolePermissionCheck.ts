// Importieren der notwendigen Module.
import * as jwt from 'jsonwebtoken';
import { Database } from '../../database/database';

export class Permission {
    private jwtToken: any; // Private Eigenschaft, die das JWT-Token speichert.
    database: Database // Datenbankinstanz für SQL-Operationen.

    constructor(jwtToken: any) { // Konstruktor: Initialisiert eine neue Instanz der Permission-Klasse.
        this.database = new Database(); // Erstellen einer neuen Datenbankinstanz.
        this.jwtToken = jwtToken // Speichern des bereitgestellten JWT-Tokens.
    }

    // Definierte Methode zur Überprüfung der Rollenberechtigungen eines Benutzers.
    public async checkRolePermissions(role: string, manuallyDefinedUsername?: string): Promise<boolean> {
        const decodedToken = jwt.decode(this.jwtToken); // Dekodieren des JWT-Tokens, um Benutzerinformationen zu extrahieren.
        if (decodedToken !== null && typeof decodedToken === 'object') { // Überprüfen, ob das Token erfolgreich dekodiert wurde und ein Objekt ist.
            const username = manuallyDefinedUsername || decodedToken.username; // Ermitteln des Benutzernamens entweder aus dem Token oder aus einem manuell definierten Wert.
            const userrole = await this.database.executeSQL(`SELECT role From users WHERE username = "${username}"`);

            if (userrole[0] && userrole[0].role) {
                const check = await this.database.executeSQL(`SELECT ${role} FROM roles_permissions WHERE rolename = "${userrole[0].role}"`);
                const roleValue = check[0][role]; // Extrahieren des Wertes der gesuchten Berechtigung.
            
                if (roleValue === 1) { // Rückgabe von true, wenn die Berechtigung vorhanden ist (angenommen, 1 steht für true).
                    return true;
                } else {
                    return false;
                }
              } else {
                console.error('Rolleninformation nicht gefunden'); // Protokollieren eines Fehlers, wenn keine Rolleninformationen gefunden wurden.
                return false;
              }
            

        } else {
            return false; // Rückgabe von false, wenn das Token nicht dekodiert werden konnte oder kein Objekt ist.
        }
      }
    
}