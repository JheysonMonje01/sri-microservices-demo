-- CreateEnum
CREATE TYPE "RolSistema" AS ENUM ('CLIENTE_COMUN', 'CONTADOR', 'ADMIN');

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "tipo" "RolSistema" DEFAULT 'CLIENTE_COMUN';
