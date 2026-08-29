DROP TABLE IF EXISTS user;

CREATE TABLE user
(
    id          BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary key',
    version     INT         NOT NULL DEFAULT 0 COMMENT 'Optimistic lock version',
    is_deleted  TINYINT(1)  NOT NULL DEFAULT 0 COMMENT 'Deletion status (0: active, 1: deleted)',
    create_time DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create time',
    update_time DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time',

    username    VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'Username',
    password    VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'Password',
    email       VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'Email',

    UNIQUE KEY uk_username (username),

    KEY idx_created (create_time),
    KEY idx_updated (update_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='User info';
