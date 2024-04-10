import { Request, Response, Express } from 'express';
import { Database } from '../database/database';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser'
import { Permission } from './permissions/rolePermissionCheck'; 
import { Post } from './post/post'
import { Comment } from './comment/comment'

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

export class API {
  // Properties
  app: Express
  database: Database
  post: Post
  comment: Comment

  // Constructor
  constructor(app: Express) {
    this.app = app
    this.database = new Database();
    this.post = new Post();
    this.comment = new Comment();

    this.app.post('/login', this.checkUser);
    this.app.post('/register', this.registerUser);
    this.app.post('/permission', this.adminCheck);
    this.app.post('/createPost', this.newPost);
    this.app.delete('/deletePost', this.deletePost);
    this.app.get('/getPost', this.getAllPost);
    this.app.post('/like', this.postLike);
    this.app.post('/dislike', this.postDislike);
    this.app.post('/createComment', this.newComment);
    this.app.get('/getComment', this.getComment)
  }


 
  // Methods
  private adminCheck(req: Request, res: Response) {
    bodyParser.json()(req, res, async () => {
      const { jwtToken } = req.body;

      const permission = new Permission(jwtToken);  
      
      const permissionUser = await permission.checkRolePermissions('deletAllPost');
      

      res.status(200).json({ permission: permissionUser });
    });
  }
  private postLike = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { postId } = req.body;
      console.log(postId)
      this.post.likePost(postId);
    });
  }

  private postDislike = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { postId } = req.body;
      console.log(postId)
      this.post.dislikePost(postId);
    });
  }


  private deletePost = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { postId } = req.body;
      console.log(postId)
      this.post.deletePost(postId);
    });
  }


  private newPost = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { postMessage, jwtToken } = req.body;
      this.post.savePost(postMessage, jwtToken);
    });
  }

  private newComment = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { commentMessage, jwtToken, postId } = req.body;
      this.comment.saveComment( commentMessage, jwtToken, postId);
    });
  }


  private registerUser = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { username, password, email } = req.body;
      await this.database.executeSQL(
        `INSERT INTO users (username, password, email, role) VALUES ("${username}", "${password}", "${email}", "User")`
      );

    });
  }

  private getAllPost = async (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      try {
        const allpost = await this.post.getPost();
        res.status(200).json({ allpost });
      } catch (error) {
        console.error('Fehler beim Abrufen aller Posts', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }

  private getComment = async (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      try {
        const allcomment = await this.comment.getComment();
        res.status(200).json({ allcomment });
      } catch (error) {
        console.error('Fehler beim Abrufen aller Posts', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }


  private checkUser = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { LoginPassword, LoginUsername } = req.body;
  
      console.log('Benutzerüberprüfung für:', LoginUsername);
  
      // Hier überprüfen Sie, ob der Benutzer in der Datenbank existiert
      const userExists = await this.database.executeSQL(
        `SELECT * FROM users WHERE username = "${LoginUsername}" AND password = "${LoginPassword}"`
      );
  
      if (userExists.length > 0) {
        const token = jwt.sign({ username: LoginUsername }, process.env.TOKEN_SECRET || '', { expiresIn: '1h' });
        res.status(200).json({ token: token });
      } else {
        res.status(404).send('Benutzer nicht gefunden');
      }
    });
  }
}