/*
  Warnings:

  - Added the required column `product_name` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "product_name" VARCHAR(50) NOT NULL;
