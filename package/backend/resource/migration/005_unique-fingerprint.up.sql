ALTER TABLE "visitor" ADD COLUMN "fingerprint" VARCHAR NOT NULL;
ALTER TABLE "visitor" ADD CONSTRAINT "unique_visitor_fingerprint" UNIQUE("fingerprint");
