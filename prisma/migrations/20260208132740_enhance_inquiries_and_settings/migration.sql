-- DropForeignKey
ALTER TABLE "Inquiry" DROP CONSTRAINT "Inquiry_propertyId_fkey";

-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'PROPERTY',
ALTER COLUMN "propertyId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "contactPhone" TEXT NOT NULL DEFAULT '+919999900000',
    "whatsapp" TEXT NOT NULL DEFAULT '+919999900000',
    "email" TEXT NOT NULL DEFAULT 'info@property.com',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
