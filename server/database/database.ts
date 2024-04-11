// Import der notwendigen Module und SQL-Anweisungen aus der Schema-Datei.
import mariadb from 'mariadb'
import { Pool } from 'mariadb'
import { USER_TABLE, TWEET_TABLE, USER_ROLE, adminRoleQuery, userRoleQuery, COMMENT_TABLE} from './schema'

export class Database {
  // Klassenattribut für die Datenbankverbindung.
  private _pool: Pool

  // Konstruktor der Klasse.
  constructor() {
    // Erstellen eines Verbindungspools zur Datenbank mit Konfigurationsdetails.
    this._pool = mariadb.createPool({
      database: process.env.DB_NAME || 'minitwitter', // Name der Datenbank
      host: process.env.DB_HOST || 'localhost', // Hostname des Datenbankservers
      user: process.env.DB_USER || 'minitwitter', // Benutzername für die Datenbankverbindung
      password: process.env.DB_PASSWORD || 'supersecret123', // Passwort für die Datenbankverbindung
      port:3306, // Portnummer des Datenbankservers
      connectionLimit: 5, // Maximale Anzahl der Verbindungen im Pool
    })

    // Aufruf der Methode zur Initialisierung des Datenbankschemas.
    this.initializeDBSchema()
  }

  // Methode zur Initialisierung des Datenbankschemas.
  private initializeDBSchema = async () => {
    // Ausführen der SQL-Anweisungen zur Schemaerstellung.
    await this.executeSQL(USER_TABLE)
    await this.executeSQL(TWEET_TABLE)
    await this.executeSQL(USER_ROLE)
    await this.executeSQL(adminRoleQuery)
    await this.executeSQL(userRoleQuery)
    await this.executeSQL(COMMENT_TABLE)
  }

  // Methode zur Ausführung von SQL-Anweisungen.
  public executeSQL = async (query: string) => {
    try {
      // Eine Verbindung aus dem Pool holen.
      const conn = await this._pool.getConnection()
      // Die übergebene SQL-Anweisung ausführen.
      const res = await conn.query(query)
      // Die Verbindung nach der Ausführung beenden.
      conn.end()
      return res
    } catch (err) {
      // Fehler bei der Ausführung ausgeben.
      console.log(err)
    }
  }
}