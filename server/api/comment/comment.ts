import { Database } from '../../database/database';
import * as jwt from 'jsonwebtoken';

export class Comment {
    database: Database

    constructor() {
        this.database = new Database();
    }

    public saveComment = async (message: string, token: any, post_id: number) => {
        const decodedToken = jwt.decode(token);
    
        if (decodedToken && typeof decodedToken === 'object' && 'username' in decodedToken) {
            const username = decodedToken.username;
    
            const userId = await this.database.executeSQL(`SELECT id From users WHERE username = "${username}"`);
            await this.database.executeSQL(
                `INSERT INTO comment( user_id, tweet_id, comment_content) VALUES (${userId[0].id},${post_id},"${message}")`
            );
        } else {
            console.error('Invalid token or missing username in decodedToken.');
        }
    }

    public getComment = async () => {
        const commentDatas = await this.database.executeSQL(
            `SELECT users.id AS user_id,comment.id AS comment_id,comment.tweet_id AS tweet_id , users.username as username, comment.comment_content AS comment_content FROM users JOIN comment ON users.id = comment.user_id;`
        )
        const commentoutput = commentDatas
        return commentoutput
    }

    public deleteComment = async (postId: string) => {
        const deletePost = await this.database.executeSQL(
            `DELETE FROM tweets WHERE tweets.id = ${postId} `
        )
        
    }

}