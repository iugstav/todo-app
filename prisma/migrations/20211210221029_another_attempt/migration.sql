-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_userEmail_fkey";

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
