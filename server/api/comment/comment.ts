// Importieren der benötigten Module.
import { Database } from '../../database/database';
import * as jwt from 'jsonwebtoken';

export class Comment { 
    database: Database // Instanz der Database-Klasse für Datenbankoperationen.

    constructor() {
        this.database = new Database(); // Initialisierung der Datenbankverbindung.
    }

    // Definierte Methode zum Speichern eines Kommentars.
    public saveComment = async (message: string, token: any, post_id: number) => {
        const decodedToken = jwt.decode(token); // Dekodieren des JWT-Tokens, um den Benutzernamen zu extrahieren.
    
        // Überprüfen, ob das Token gültig ist und einen Benutzernamen enthält.
        if (decodedToken && typeof decodedToken === 'object' && 'username' in decodedToken) {
            const username = decodedToken.username;

            // Abrufen der Benutzer-ID anhand des Benutzernamens aus der Datenbank.
            const userId = await this.database.executeSQL(`SELECT id From users WHERE username = "${username}"`);
            
            // Einfügen des Kommentars in die Datenbank mit der Benutzer-ID, Post-ID und dem Kommentartext.
            await this.database.executeSQL(
                `INSERT INTO comment( user_id, tweet_id, comment_content) VALUES (${userId[0].id},${post_id},"${message}")`
            );
        } else {
            // Fehlermeldung, wenn das Token ungültig ist oder der Benutzername fehlt.
            console.error('Invalid token or missing username in decodedToken.');
        }
    }

    // Definierte Methode zum Abrufen aller Kommentare.
    public getComment = async () => {
        // SQL-Abfrage zum Abrufen der Kommentare und zugehöriger Benutzerinformationen.
        const commentDatas = await this.database.executeSQL(
            `SELECT users.id AS user_id,comment.id AS comment_id,comment.tweet_id AS tweet_id , users.username as username, comment.comment_content AS comment_content FROM users JOIN comment ON users.id = comment.user_id;`
        )
        // Direktes Zurückgeben der abgerufenen Kommentardaten.
        const commentoutput = commentDatas
        return commentoutput
    }

    // Asynchrone Methode zum Löschen eines Kommentars (sollte vermutlich postId durch commentId ersetzt werden).
    public deleteComment = async (postId: string) => {
        const deletePost = await this.database.executeSQL(
            `DELETE FROM tweets WHERE tweets.id = ${postId} `
        )
    }
}