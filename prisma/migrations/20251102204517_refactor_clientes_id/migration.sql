/*
  Warnings:

  - The primary key for the `Clientes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cliente_id` on the `Clientes` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_registro` on the `Clientes` table. All the data in the column will be lost.
  - You are about to alter the column `total` on the `Pedidos` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- DropForeignKey
ALTER TABLE "public"."Pedidos" DROP CONSTRAINT "Pedidos_cliente_id_fkey";

-- DropIndex
DROP INDEX "public"."Clientes_email_key";

-- AlterTable
ALTER TABLE "Clientes" DROP CONSTRAINT "Clientes_pkey",
DROP COLUMN "cliente_id",
DROP COLUMN "fecha_registro",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ADD CONSTRAINT "Clientes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Pedidos" ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
