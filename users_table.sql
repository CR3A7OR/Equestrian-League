CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userID TEXT NOT NULL,
    balance INTEGER DEFAULT 5, 
    total_races INTEGER DEFAULT 1, 
    wins INTEGER DEFAULT 0, 
    current_streak INTEGER DEFAULT 0, 
    longest_streak INTEGER DEFAULT 0
);

CREATE TABLE guilds (
    GuildID TEXT,
    UserID TEXT,
    FOREIGN KEY (UserID) REFERENCES users(id)
);
