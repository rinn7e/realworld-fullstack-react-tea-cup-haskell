CREATE INDEX idx_article_created_at ON "article"("created_at" DESC);
CREATE INDEX idx_article_author_id ON "article"("author_id");
CREATE INDEX idx_favorite_article_id ON "favorite"("article_id");
CREATE INDEX idx_comment_article_id ON "comment"("article_id");
CREATE INDEX idx_article_tag_article_id ON "article_tag"("article_id");
