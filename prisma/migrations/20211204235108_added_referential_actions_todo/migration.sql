-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_project_name_fkey";

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_project_name_fkey" FOREIGN KEY ("project_name") REFERENCES "projects"("name") ON DELETE CASCADE ON UPDATE CASCADE;
