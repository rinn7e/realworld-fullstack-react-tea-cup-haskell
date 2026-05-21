ALTER TABLE "visitor" ADD COLUMN "user_id" INT8 NULL;
ALTER TABLE "visitor" ADD CONSTRAINT "visitor_user_id_fkey" FOREIGN KEY("user_id") REFERENCES "user"("id") ON DELETE SET NULL;
