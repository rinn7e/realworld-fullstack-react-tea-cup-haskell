-- Users (Password is 'testtest' hashed with dummy Argon2-like string)
INSERT INTO "user" (username, email, password, bio, image, role) VALUES 
('admin', 'admin@example.com', '$argon2id$v=19$m=65536,t=2,p=1$H7tvUgoTi3VL0NerwrSLJw$XHCJPdObaSFp34QfvR1tKIwb/QVLJblO64V8XRoIy4w', 'System Administrator', 'https://api.realworld.io/images/demo-avatar.png', 'AdminRole'),
('jake', 'jake@jake.jake', '$argon2id$v=19$m=65536,t=2,p=1$H7tvUgoTi3VL0NerwrSLJw$XHCJPdObaSFp34QfvR1tKIwb/QVLJblO64V8XRoIy4w', 'I work at statefarm', 'https://api.realworld.io/images/smiley-cyrus.jpeg', 'AdminRole'),
('anna', 'anna@example.com', '$argon2id$v=19$m=65536,t=2,p=1$H7tvUgoTi3VL0NerwrSLJw$XHCJPdObaSFp34QfvR1tKIwb/QVLJblO64V8XRoIy4w', 'I love Haskell', 'https://api.realworld.io/images/demo-avatar.png', 'RegularRole'),
('gerard', 'gerard@example.com', '$argon2id$v=19$m=65536,t=2,p=1$H7tvUgoTi3VL0NerwrSLJw$XHCJPdObaSFp34QfvR1tKIwb/QVLJblO64V8XRoIy4w', 'Coffee enthusiast and coder', 'https://api.realworld.io/images/smiley-cyrus.jpeg', 'RegularRole'),
('john_doe', 'john@doe.com', '$argon2id$v=19$m=65536,t=2,p=1$H7tvUgoTi3VL0NerwrSLJw$XHCJPdObaSFp34QfvR1tKIwb/QVLJblO64V8XRoIy4w', 'Just another developer', NULL, 'RegularRole');

-- Tags
INSERT INTO "tag" (name) VALUES ('haskell'), ('servant'), ('webdev'), ('functional-programming'), ('tutorial'), ('react'), ('nodejs'), ('postgres');

-- Articles
INSERT INTO "article" (slug, title, description, body, author_id, created_at, updated_at) VALUES 
('how-to-train-your-dragon', 'How to train your dragon', 'Ever wonder how?', 'It takes a lot of patience and some fish.', 2, NOW(), NOW()),
('how-to-train-your-dragon-2', 'How to train your dragon 2', 'So stuck?', 'It takes even more patience and a bigger dragon.', 2, NOW(), NOW()),
('servant-is-awesome', 'Servant is awesome', 'Type-safe APIs in Haskell', 'Servant is a library for declaring web APIs at the type-level.', 3, NOW(), NOW()),
('intro-to-fp', 'Introduction to Functional Programming', 'Learn the basics of FP', 'Functional programming is a programming paradigm where programs are constructed by applying and composing functions.', 3, NOW(), NOW()),
('building-realworld-haskell', 'Building a RealWorld App with Haskell', 'A step-by-step guide', 'In this article, we explore the implementation of the Conduit API using Servant and Persistent.', 4, NOW(), NOW()),
('postgres-performance-tips', 'Postgres Performance Tips', 'Make your queries faster', 'Indexing, vacuuming, and analyzing are key to a healthy database.', 5, NOW(), NOW()),
('react-vs-vue-2026', 'React vs Vue in 2026', 'Which one to choose?', 'Both frameworks have evolved significantly, but React remains dominant in the enterprise.', 4, NOW(), NOW());

-- Article Tags
INSERT INTO "article_tag" (article_id, tag_id) VALUES 
(1, 1), (1, 3), 
(3, 1), (3, 2), (3, 4),
(4, 4), (4, 5),
(5, 1), (5, 2), (5, 3),
(6, 8), (6, 3),
(7, 6), (7, 3);

-- Comments
INSERT INTO "comment" (body, author_id, article_id, created_at, updated_at) VALUES 
('Great article! Really helped me understand Servant.', 4, 3, NOW(), NOW()),
('I prefer Vue actually, but good read.', 5, 7, NOW(), NOW()),
('Nice tips on Postgres, thanks!', 3, 6, NOW(), NOW()),
('When is the next part coming out?', 2, 5, NOW(), NOW());

-- Favorites
INSERT INTO "favorite" (user_id, article_id) VALUES 
(2, 3), (2, 4), (2, 5),
(3, 5), (3, 7),
(4, 1), (4, 6);

-- Follows
INSERT INTO "follow" (follower_id, followed_id) VALUES 
(2, 3), (2, 4),
(3, 2), (3, 4),
(4, 2), (4, 3), (4, 5);

-- Audit and Moderator Logs (35+ events across the last 24 hours)
INSERT INTO "log" (level, message, source, timestamp, user_id) VALUES
('INFO', 'Database initialized successfully with mock records.', 'SYSTEM', NOW() - INTERVAL '24 hours', NULL),
('INFO', 'New user registered: jake', 'AUTH', NOW() - INTERVAL '23 hours 50 minutes', 2),
('INFO', 'New user registered: anna', 'AUTH', NOW() - INTERVAL '23 hours 45 minutes', 3),
('INFO', 'New user registered: gerard', 'AUTH', NOW() - INTERVAL '23 hours 40 minutes', 4),
('INFO', 'New user registered: john_doe', 'AUTH', NOW() - INTERVAL '23 hours 35 minutes', 5),
('INFO', 'User jake logged in from IP 192.168.1.100', 'AUTH', NOW() - INTERVAL '23 hours', 2),
('INFO', 'User jake created new article: how-to-train-your-dragon', 'ARTICLE', NOW() - INTERVAL '22 hours 45 minutes', 2),
('INFO', 'User anna logged in from IP 192.168.1.101', 'AUTH', NOW() - INTERVAL '22 hours 30 minutes', 3),
('INFO', 'User anna created new article: servant-is-awesome', 'ARTICLE', NOW() - INTERVAL '22 hours', 3),
('WARNING', 'Failed login attempt for email: admin@example.com (Invalid Password)', 'AUTH', NOW() - INTERVAL '21 hours 10 minutes', NULL),
('INFO', 'Administrator admin logged in from IP 192.168.1.100', 'AUTH', NOW() - INTERVAL '21 hours 8 minutes', 1),
('INFO', 'User gerard created new article: postgres-performance-tips', 'ARTICLE', NOW() - INTERVAL '20 hours', 5),
('INFO', 'User john_doe commented on servant-is-awesome', 'COMMENT', NOW() - INTERVAL '19 hours 30 minutes', 4),
('INFO', 'User anna favorited building-realworld-haskell', 'ARTICLE', NOW() - INTERVAL '18 hours', 3),
('INFO', 'User gerard favorited react-vs-vue-2026', 'ARTICLE', NOW() - INTERVAL '17 hours 15 minutes', 4),
('WARNING', 'Rate limit warning: IP 192.168.1.102 hit user endpoint too frequently', 'SYSTEM', NOW() - INTERVAL '16 hours', NULL),
('INFO', 'User jake followed user anna', 'AUTH', NOW() - INTERVAL '15 hours', 2),
('INFO', 'User anna followed user jake', 'AUTH', NOW() - INTERVAL '14 hours 30 minutes', 3),
('INFO', 'User gerard followed user jake', 'AUTH', NOW() - INTERVAL '14 hours 15 minutes', 4),
('INFO', 'User jake created new article: how-to-train-your-dragon-2', 'ARTICLE', NOW() - INTERVAL '13 hours', 2),
('INFO', 'User anna created new article: intro-to-fp', 'ARTICLE', NOW() - INTERVAL '12 hours', 3),
('INFO', 'User john_doe favorited servant-is-awesome', 'ARTICLE', NOW() - INTERVAL '11 hours 30 minutes', 4),
('INFO', 'User gerard commented on react-vs-vue-2026', 'COMMENT', NOW() - INTERVAL '10 hours', 5),
('INFO', 'User anna commented on postgres-performance-tips', 'COMMENT', NOW() - INTERVAL '9 hours 15 minutes', 3),
('INFO', 'User jake commented on building-realworld-haskell', 'COMMENT', NOW() - INTERVAL '8 hours', 2),
('INFO', 'Administrator admin accessed security dashboard', 'SYSTEM', NOW() - INTERVAL '7 hours', 1),
('WARNING', 'Slow query warning: GET /api/articles took 420ms', 'SYSTEM', NOW() - INTERVAL '6 hours', NULL),
('INFO', 'User jake favorited how-to-train-your-dragon-2', 'ARTICLE', NOW() - INTERVAL '5 hours 15 minutes', 2),
('INFO', 'User gerard favorited postgres-performance-tips', 'ARTICLE', NOW() - INTERVAL '4 hours 30 minutes', 4),
('INFO', 'User anna updated profile details', 'AUTH', NOW() - INTERVAL '3 hours', 3),
('INFO', 'User jake updated article: how-to-train-your-dragon-2', 'ARTICLE', NOW() - INTERVAL '2 hours 15 minutes', 2),
('INFO', 'User gerard logged out.', 'AUTH', NOW() - INTERVAL '1 hour 30 minutes', 4),
('INFO', 'Database transaction log rotated cleanly.', 'SYSTEM', NOW() - INTERVAL '1 hour', NULL),
('INFO', 'User jake logged in from IP 192.168.1.120', 'AUTH', NOW() - INTERVAL '30 minutes', 2),
('INFO', 'Administrator admin promoted user jake to Admin role.', 'AUTH', NOW() - INTERVAL '15 minutes', 1),
('INFO', 'User jake verified new Admin role status.', 'AUTH', NOW() - INTERVAL '10 minutes', 2),
('INFO', 'Administrator admin ran security log purge check.', 'SYSTEM', NOW() - INTERVAL '5 minutes', 1);
