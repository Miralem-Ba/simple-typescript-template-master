// Importieren der notwendigen Module und Klassen
import express, { Express, Request, Response } from 'express'
import { API } from './api'
import http from 'http'
import { resolve, dirname } from 'path'
import { Database } from './database'

// Definition der Backend-Klasse
class Backend {

  // Klassenattribute
  private _app: Express
  private _api: API
  private _database: Database
  private _env: string

  // Getter-Methoden für die Attribute
  public get app(): Express {
    return this._app
  }

  public get api(): API {
    return this._api
  }

  public get database(): Database {
    return this._database
  }

  // Konstruktor der Klasse
  constructor() {
    // Initialisierung der Attribute
    this._app = express() // Erstellen einer Express-App
    this._database = new Database() // Instanziierung der Datenbank
    this._api = new API(this._app) // API-Initialisierung mit der Express-App
    this._env = process.env.NODE_ENV || 'development' // Festlegen der Umgebungsvariablen

    // Setup-Methoden aufrufen
    this.setupStaticFiles() // Einrichten der statischen Dateien
    this.setupRoutes() // Einrichten der Routen
    this.startServer() // Starten des Servers
  }

  // Einrichten der statischen Dateien
  private setupStaticFiles(): void {
    this._app.use(express.static('client')) // Verzeichnis für statische Dateien festlegen
  }

  // Einrichten der Routen
  private setupRoutes(): void {
    this._app.get('/', (req: Request, res: Response) => { // Route für die Startseite
      const __dirname = resolve(dirname('')) // Ermitteln des aktuellen Verzeichnisses 
      res.sendFile(__dirname + '/client/index.html') // Senden der Index-HTML-Datei
    })
  }

  // Starten des Servers
  private startServer(): void {
    if (this._env === 'production') { // Überprüfen, ob die Produktionsumgebung aktiv ist
      http.createServer(this.app).listen(3000, () => { // Erstellen und Starten des HTTP-Servers
        console.log('Server is listening!') // Konsolenausgabe beim Starten des Servers
      })
    }
  }
}

// Instanziierung der Backend-Klasse
const backend = new Backend()
export const viteNodeApp = backend.app // Exportieren der Express-App für die Verwendung außerhalb dieser Datei