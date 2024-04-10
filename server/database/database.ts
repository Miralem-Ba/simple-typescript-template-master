import mariadb from 'mariadb'
import { Pool } from 'mariadb'
import { USER_TABLE, TWEET_TABLE, USER_ROLE, adminRoleQuery, userRoleQuery, COMMENT_TABLE} from './schema'

export class Database {
  // Properties
  private _pool: Pool
  // Constructor
  constructor() {
    this._pool = mariadb.createPool({
      database: process.env.DB_NAME || 'minitwitter',
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'minitwitter',
      password: process.env.DB_PASSWORD || 'supersecret123',
      port:3306,
      connectionLimit: 5,
    })
    this.initializeDBSchema()
  }
  // Methods
  private initializeDBSchema = async () => {
    
    await this.executeSQL(USER_TABLE)
    await this.executeSQL(TWEET_TABLE)
    await this.executeSQL(USER_ROLE)
    await this.executeSQL(adminRoleQuery)
    await this.executeSQL(userRoleQuery)
    await this.executeSQL(COMMENT_TABLE)
  }

  public executeSQL = async (query: string) => {
    try {
      const conn = await this._pool.getConnection()
      const res = await conn.query(query)
      conn.end()
      return res
    } catch (err) {
      console.log(err)
    }
  }
}