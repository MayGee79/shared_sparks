-- CreateTable
CREATE TABLE "Metric" (
    "id" TEXT NOT NULL,
    "type" "MetricType" NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Metric_type_idx" ON "Metric"("type");
