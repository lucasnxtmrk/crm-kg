-- CreateTable
CREATE TABLE "cadastros_influenciadores" (
    "id" UUID NOT NULL,
    "influenciador_id" UUID NOT NULL,
    "plataforma_id" VARCHAR(50) NOT NULL,
    "influenciador_plataforma_id" VARCHAR(100) NOT NULL,

    CONSTRAINT "cadastros_influenciadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influenciadores" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "imagem" TEXT,
    "instagram" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "telefone" VARCHAR(20),
    "data_cadastro" DATE NOT NULL,
    "cpf" VARCHAR(20) NOT NULL,
    "chavepix" VARCHAR(255),
    "status" VARCHAR(20) NOT NULL,
    "motivo_banimento" TEXT,
    "contratado" BOOLEAN NOT NULL DEFAULT false,
    "salario_fixo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "influenciadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupos" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "imagem" TEXT,

    CONSTRAINT "grupos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plataformas" (
    "id" VARCHAR(50) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "imagem" TEXT,
    "cor" TEXT NOT NULL,
    "grupoId" UUID,

    CONSTRAINT "plataformas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recargas" (
    "id" UUID NOT NULL,
    "cadastro_id" UUID NOT NULL,
    "inicio" DATE NOT NULL,
    "termino" DATE NOT NULL,
    "salario" DECIMAL(10,2) NOT NULL,
    "meta" DECIMAL(10,2) NOT NULL,
    "atingido" DECIMAL(10,2) NOT NULL,
    "reembolso" DECIMAL(10,2) NOT NULL,
    "depositantes_meta" INTEGER NOT NULL,
    "depositantes_atingido" INTEGER NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "status_meta" VARCHAR(20) NOT NULL,
    "reembolso_status" VARCHAR(20) NOT NULL,

    CONSTRAINT "recargas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salarios_mensais" (
    "id" UUID NOT NULL,
    "influenciador_id" UUID NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "salarios_mensais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "plataforma_id" TEXT NOT NULL,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipanteEvento" (
    "id" TEXT NOT NULL,
    "evento_id" UUID NOT NULL,
    "influencer_id" UUID NOT NULL,
    "meta" INTEGER NOT NULL,
    "atingido" INTEGER NOT NULL,

    CONSTRAINT "ParticipanteEvento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "influenciadores_cpf_key" ON "influenciadores"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "salarios_mensais_influenciador_id_ano_mes_key" ON "salarios_mensais"("influenciador_id", "ano", "mes");

-- AddForeignKey
ALTER TABLE "cadastros_influenciadores" ADD CONSTRAINT "cadastros_influenciadores_influenciador_id_fkey" FOREIGN KEY ("influenciador_id") REFERENCES "influenciadores"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cadastros_influenciadores" ADD CONSTRAINT "cadastros_influenciadores_plataforma_id_fkey" FOREIGN KEY ("plataforma_id") REFERENCES "plataformas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plataformas" ADD CONSTRAINT "plataformas_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "grupos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recargas" ADD CONSTRAINT "recargas_cadastro_id_fkey" FOREIGN KEY ("cadastro_id") REFERENCES "cadastros_influenciadores"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salarios_mensais" ADD CONSTRAINT "salarios_mensais_influenciador_id_fkey" FOREIGN KEY ("influenciador_id") REFERENCES "influenciadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_plataforma_id_fkey" FOREIGN KEY ("plataforma_id") REFERENCES "plataformas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipanteEvento" ADD CONSTRAINT "ParticipanteEvento_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipanteEvento" ADD CONSTRAINT "ParticipanteEvento_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "influenciadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
