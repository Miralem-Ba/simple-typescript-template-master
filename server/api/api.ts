// Import der benötigten Bibliotheken und Module.
import { Request, Response, Express } from 'express';
import { Database } from '../database/database';
import * as jwt from 'jsonwebtoken'; // Für die Erstellung und Verifizierung von JWTs.
import * as dotenv from 'dotenv'; // Für den Zugriff auf Umgebungsvariablen.
import bodyParser from 'body-parser' // Für das Parsen von Request Bodies.
import { Permission } from './permissions/rolePermissionCheck'; // Zum Überprüfen von Benutzerberechtigungen.
import { Post } from './post/post' // Klassen für Post-Operationen.
import { Comment } from './comment/comment' // Klassen für Kommentar-Operationen.

// Konfiguration laden.
dotenv.config();

// Umgebungsvariable TOKEN_SECRET für JWTs.
process.env.TOKEN_SECRET;

// Definition der API-Klasse.
export class API {

  // Klassenattribute.
  app: Express
  database: Database
  post: Post
  comment: Comment

  // Konstruktor: Initialisiert die API und setzt Routen auf.
  constructor(app: Express) {
    this.app = app
    this.database = new Database();
    this.post = new Post();
    this.comment = new Comment();

    // Definition der Routen und zugehörigen Handler.
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

// Überprüft, ob ein Benutzer Admin-Berechtigungen hat, speziell die Berechtigung zum Löschen aller Beiträge.
  private adminCheck(req: Request, res: Response) {
    bodyParser.json()(req, res, async () => {
      const { jwtToken } = req.body; // Extrahiert das JWT-Token aus dem Request-Body.
      const permission = new Permission(jwtToken);  // Erstellt eine neue Permission-Instanz mit dem gegebenen Token.
      const permissionUser = await permission.checkRolePermissions('deletAllPost');// Überprüft die Berechtigung für 'deletAllPost'.
      res.status(200).json({ permission: permissionUser }); // Gibt das Ergebnis der Berechtigungsüberprüfung zurück.
    });
  }

  // Fügt einem Post ein "Like" hinzu.
  private postLike = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { postId } = req.body; // Extrahiert die Post-ID aus dem Request-Body.
      console.log(postId) // Loggt die Post-ID.
      this.post.likePost(postId);// Ruft likePost-Funktion auf die gegebene Post-ID.
    });
  }

  // Entfernt ein "Like" von einem Post.
  private postDislike = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { postId } = req.body; // Extrahiert die Post-ID aus dem Request-Body.
      console.log(postId) // Loggt die Post-ID.
      this.post.dislikePost(postId); // Ruft dislikePost-Funktion auf die gegebene Post-ID.
    });
  }

  // Löscht einen Post basierend auf der Post-ID.
  private deletePost = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { postId } = req.body; // Extrahiert die Post-ID aus dem Request-Body.
      console.log(postId) // Loggt die Post-ID.
      this.post.deletePost(postId); // Ruft deletePost-Funktion auf die gegebene Post-ID.
    });
  }

  // Erstellt einen neuen Post.
  private newPost = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { postMessage, jwtToken } = req.body; // Extrahiert Nachricht und Token aus dem Request-Body.
      this.post.savePost(postMessage, jwtToken);
    });
  }

  // Speichert einen neuen Kommentar.
  private newComment = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { commentMessage, jwtToken, postId } = req.body; // Extrahiert die Kommentarnachricht, JWT-Token und Post-ID aus dem Request Body
      this.comment.saveComment( commentMessage, jwtToken, postId); // Speichert den neuen Kommentar in der Datenbank.
    });
  }

   
  // Registriert einen neuen Benutzer.
  private registerUser = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { username, password, email } = req.body; // Extrahiert Benutzername, Passwort und E-Mail aus dem Request Body.
      await this.database.executeSQL(  // Fügt den neuen Benutzer in die Datenbank ein.
        `INSERT INTO users (username, password, email, role) VALUES ("${username}", "${password}", "${email}", "User")`
      );
    });
  }

  // Ruft alle Posts ab.
  private getAllPost = async (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      try {
        const allpost = await this.post.getPost(); // Ruft alle Posts ab und speichert sie in 'allpost'.
        res.status(200).json({ allpost }); // Sendet die abgerufenen Posts als JSON zurück.
      } catch (error) {
        console.error('Fehler beim Abrufen aller Posts', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }

  // Ruft alle Kommentare ab.
  private getComment = async (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      try {
        const allcomment = await this.comment.getComment(); // Ruft alle Kommentare ab und speichert sie in 'allcomment'.
        res.status(200).json({ allcomment }); // Sendet die abgerufenen Kommentare als JSON zurück.
      } catch (error) {
        console.error('Fehler beim Abrufen aller Posts', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }

  // Überprüft, ob Benutzerdaten in der Datenbank vorhanden sind und erstellt ein JWT-Token.
  private checkUser = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { LoginPassword, LoginUsername } = req.body; // Extrahiert Benutzername und Passwort aus dem Request Body.
      console.log('Benutzerüberprüfung für:', LoginUsername);
  
      // Überprüft, ob ein Benutzer mit den angegebenen Anmeldedaten existiert
      const userExists = await this.database.executeSQL(
        `SELECT * FROM users WHERE username = "${LoginUsername}" AND password = "${LoginPassword}"`
      );
  
      // Wenn der Benutzer existiert, wird ein JWT-Token erstellt und zurückgesendet.
      if (userExists.length > 0) {
        const token = jwt.sign({ username: LoginUsername }, process.env.TOKEN_SECRET || '', { expiresIn: '1h' });
        res.status(200).json({ token: token });
      } else {
        // Sendet eine Fehlermeldung, wenn der Benutzer nicht gefunden wird.
        res.status(404).send('Benutzer nicht gefunden');
      }
    });
  }
}