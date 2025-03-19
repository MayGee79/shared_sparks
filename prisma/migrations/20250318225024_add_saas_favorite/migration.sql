-- CreateTable
CREATE TABLE "SaasFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "saasId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaasFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SaasFavorite_userId_saasId_key" ON "SaasFavorite"("userId", "saasId");

-- AddForeignKey
ALTER TABLE "SaasFavorite" ADD CONSTRAINT "SaasFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaasFavorite" ADD CONSTRAINT "SaasFavorite_saasId_fkey" FOREIGN KEY ("saasId") REFERENCES "SaaS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
