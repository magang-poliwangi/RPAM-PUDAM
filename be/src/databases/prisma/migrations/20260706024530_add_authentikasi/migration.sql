-- CreateTable
CREATE TABLE "authentikasi" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "authentikasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authentikasi_token_key" ON "authentikasi"("token");

-- AddForeignKey
ALTER TABLE "authentikasi" ADD CONSTRAINT "authentikasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
