/*
  Warnings:

  - You are about to drop the `categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."categoria";

-- DropTable
DROP TABLE "public"."user";

-- CreateTable
CREATE TABLE "Clientes" (
    "cliente_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("cliente_id")
);

-- CreateTable
CREATE TABLE "Productos" (
    "producto_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(65,30) NOT NULL,
    "tematica_dino" TEXT,

    CONSTRAINT "Productos_pkey" PRIMARY KEY ("producto_id")
);

-- CreateTable
CREATE TABLE "Pedidos" (
    "pedido_id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "fecha_pedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "total" DECIMAL(65,30) NOT NULL,
    "direccion_envio" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "codigo_postal" TEXT,

    CONSTRAINT "Pedidos_pkey" PRIMARY KEY ("pedido_id")
);

-- CreateTable
CREATE TABLE "DetallesPedido" (
    "detalle_id" SERIAL NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DetallesPedido_pkey" PRIMARY KEY ("detalle_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_email_key" ON "Clientes"("email");

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("cliente_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesPedido" ADD CONSTRAINT "DetallesPedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "Pedidos"("pedido_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesPedido" ADD CONSTRAINT "DetallesPedido_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Productos"("producto_id") ON DELETE RESTRICT ON UPDATE CASCADE;
