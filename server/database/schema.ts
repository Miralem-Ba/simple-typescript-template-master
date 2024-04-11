// SQL-Anweisung zum Erstellen der Benutzertabelle, wenn sie noch nicht existiert.
// Diese Tabelle speichert Benutzerdaten wie ID, Benutzername, E-Mail, Passwort und Rolle.
const USER_TABLE = `
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT, 
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
`
// SQL-Anweisung zum Erstellen der Rolle-Berechtigungen-Tabelle,
// die definiert, welche Rollen welche Berechtigungen haben.
const USER_ROLE = `
CREATE TABLE IF NOT EXISTS roles_permissions (
    id INT NOT NULL AUTO_INCREMENT,
    rolename VARCHAR(255) NOT NULL,
    deletAllPost BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);
`;

// SQL-Anweisung zum Einfügen der Admin-Rolle in die Rollen-Berechtigungen-Tabelle,
// sofern sie nicht bereits existiert. Admins können alle Beiträge löschen.
const adminRoleQuery = `
    INSERT IGNORE INTO roles_permissions (rolename, deletAllPost)
    VALUES ('Admin', true);
`;

// SQL-Anweisung zum Einfügen der Benutzer-Rolle in die Rollen-Berechtigungen-Tabelle,
// sofern sie nicht bereits existiert. Normale Benutzer können nicht alle Beiträge löschen.
const userRoleQuery = `
    INSERT IGNORE INTO roles_permissions (rolename, deletAllPost)
    VALUES ('User', false);
`;

// SQL-Anweisung zum Erstellen der Tweets-Tabelle, wenn sie noch nicht existiert.
// Diese Tabelle speichert die Tweets der Benutzer.
const TWEET_TABLE = `
CREATE TABLE IF NOT EXISTS tweets (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    post_like INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`
// SQL-Anweisung zum Erstellen der Kommentar-Tabelle, wenn sie noch nicht existiert.
// Diese Tabelle speichert Kommentare zu Tweets.
const COMMENT_TABLE = `
CREATE TABLE IF NOT EXISTS comment (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    tweet_id INT NOT NULL,
    comment_content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (tweet_id) REFERENCES tweets(id)
);
`
// Exportieren der SQL-Anweisungen, damit sie in anderen Teilen der Anwendung verwendet werden können.
export { USER_TABLE, TWEET_TABLE, USER_ROLE, adminRoleQuery, userRoleQuery, COMMENT_TABLE }