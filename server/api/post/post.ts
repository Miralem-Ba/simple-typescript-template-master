// Import der Database-Klasse und des JWT-Moduls.
import { Database } from '../../database/database';
import * as jwt from 'jsonwebtoken';

export class Post {
    // Eigenschaft, die eine Instanz der Database-Klasse enthält.
    database: Database

    constructor() {
        // Im Konstruktor wird eine neue Database-Instanz erstellt.
        this.database = new Database();
    }

    // Speichert einen neuen Post in der Datenbank.
    public savePost = async (message: string, token: any) => {
        // Zuerst wird das JWT-Token dekodiert.
        const decodedToken = jwt.decode(token);
        // Überprüft, ob das dekodierte Token ein Objekt ist und einen Benutzernamen enthält.
        if (decodedToken && typeof decodedToken === 'object' && 'username' in decodedToken) {
            // Extrahiert den Benutzernamen aus dem Token.
            const username = `${decodedToken.username}`;

            // Sucht die ID des Benutzers in der Datenbank, basierend auf dem Benutzernamen.
            const userId = await this.database.executeSQL(`SELECT id From users WHERE username = "${username}"`);
            // Speichert den neuen Post in der Datenbank mit der Benutzer-ID, der Nachricht und setzt Likes auf 0.
            await this.database.executeSQL(
                `INSERT INTO tweets (user_id, content, post_like) VALUES (${userId[0].id}, "${message}", 0)`
            )
        } else {
            // Gibt einen Fehler aus, wenn das Token ungültig ist oder keinen Benutzernamen enthält.
            console.error('Invalid token or missing username in decodedToken.');
        }   
    }

    // Ruft alle Posts aus der Datenbank ab, zusammen mit Benutzerinformationen.
    public getPost = async () => {
        // Führt eine SQL-Abfrage aus, die Posts mit zugehörigen Benutzerinformationen abruft.
        const postDatas = await this.database.executeSQL(
            `SELECT users.id AS user_id, users.username as username, tweets.id AS tweet_id, tweets.post_like AS post_like, tweets.content FROM users JOIN tweets ON users.id = tweets.user_id;`
        )
        // Gibt die abgerufenen Daten direkt zurück.
        const postoutput = postDatas
        return postoutput
    }

    // Löscht einen Post anhand seiner ID.
    public deletePost = async (postId: string) => {
        // Löscht zuerst alle Kommentare, die zum Post gehören.
        const deleteCommentPost = await this.database.executeSQL(`DELETE FROM comment WHERE tweet_id = ${postId}`)
        // Löscht dann den Post selbst.
        const deletePost = await this.database.executeSQL(`DELETE FROM tweets WHERE tweets.id = ${postId} `)
        
    }

    // Erhöht die Anzahl der Likes eines Posts.
    public likePost = async (postId: string) => {
        // Aktualisiert den Like-Zähler des Posts in der Datenbank um 1.
        const likePost = await this.database.executeSQL(
            `UPDATE tweets SET post_like = post_like + 1 WHERE id = ${postId}`
        )
        
    }

    // Verringert die Anzahl der Likes eines Posts.
    public dislikePost = async (postId: string) => {
        // Aktualisiert den Like-Zähler des Posts in der Datenbank um 1 nach unten.
        const dislikePost = await this.database.executeSQL(
            `UPDATE tweets SET post_like = post_like - 1 WHERE id = ${postId}`
        )   
    }
}