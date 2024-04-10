import { Database } from '../../database/database';
import * as jwt from 'jsonwebtoken';

export class Post {
    database: Database

    constructor() {
        this.database = new Database();
    }

    public savePost = async (message: string, token: any) => {
        const decodedToken = jwt.decode(token);
        if (decodedToken && typeof decodedToken === 'object' && 'username' in decodedToken) {
            const username = `${decodedToken.username}`;
        
            const userId = await this.database.executeSQL(`SELECT id From users WHERE username = "${username}"`);
            await this.database.executeSQL(
                `INSERT INTO tweets (user_id, content, post_like) VALUES (${userId[0].id}, "${message}", 0)`
            )
        } else {
            console.error('Invalid token or missing username in decodedToken.');
        }   
    }

    public getPost = async () => {
        const postDatas = await this.database.executeSQL(
            `SELECT users.id AS user_id, users.username as username, tweets.id AS tweet_id, tweets.post_like AS post_like, tweets.content FROM users JOIN tweets ON users.id = tweets.user_id;`
        )
        const postoutput = postDatas
        return postoutput
    }

    public deletePost = async (postId: string) => {
        const deleteCommentPost = await this.database.executeSQL(`DELETE FROM comment WHERE tweet_id = ${postId}`)
        const deletePost = await this.database.executeSQL(`DELETE FROM tweets WHERE tweets.id = ${postId} `)
        
    }

    public likePost = async (postId: string) => {
        const likePost = await this.database.executeSQL(
            `UPDATE tweets SET post_like = post_like + 1 WHERE id = ${postId}`
        )
        
    }

    public dislikePost = async (postId: string) => {
        const dislikePost = await this.database.executeSQL(
            `UPDATE tweets SET post_like = post_like - 1 WHERE id = ${postId}`
        )
        
    }

}