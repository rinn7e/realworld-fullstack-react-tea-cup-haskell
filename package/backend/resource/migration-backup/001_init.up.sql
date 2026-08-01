-- migration/001_init.up.sql

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    bio TEXT,
    image TEXT
);

CREATE TABLE "article" (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    body TEXT NOT NULL,
    author_id INTEGER NOT NULL REFERENCES "user"(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE "tag" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE "article_tag" (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES "article"(id),
    tag_id INTEGER NOT NULL REFERENCES "tag"(id),
    UNIQUE(article_id, tag_id)
);

CREATE TABLE "comment" (
    id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    author_id INTEGER NOT NULL REFERENCES "user"(id),
    article_id INTEGER NOT NULL REFERENCES "article"(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE "follow" (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL REFERENCES "user"(id),
    followed_id INTEGER NOT NULL REFERENCES "user"(id),
    UNIQUE(follower_id, followed_id)
);

CREATE TABLE "favorite" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    article_id INTEGER NOT NULL REFERENCES "article"(id),
    UNIQUE(user_id, article_id)
);

