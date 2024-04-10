const USER_TABLE = `
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);
`

const USER_ROLE = `
CREATE TABLE IF NOT EXISTS roles_permissions (
    id INT NOT NULL AUTO_INCREMENT,
    rolename VARCHAR(255) NOT NULL,
    deletAllPost BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);
`;

const adminRoleQuery = `
    INSERT IGNORE INTO roles_permissions (rolename, deletAllPost)
    VALUES ('Admin', true);
`;

const userRoleQuery = `
    INSERT IGNORE INTO roles_permissions (rolename, deletAllPost)
    VALUES ('User', false);
`;

const TWEET_TABLE = `
CREATE TABLE IF NOT EXISTS tweets (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    post_like INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`
const COMMENT_TABLE = `
CREATE TABLE IF NOT EXISTS comment (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    tweet_id INT NOT NULL,
    comment_content VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (tweet_id) REFERENCES tweets(id)
);
`
export { USER_TABLE, TWEET_TABLE, USER_ROLE, adminRoleQuery, userRoleQuery, COMMENT_TABLE }
