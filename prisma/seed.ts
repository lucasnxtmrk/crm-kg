// prisma/seed.ts
const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

const grupos = [
  { id: uuidv4(), nome: "Top Influencers", imagem: "/images/grupos/top1.png" },
  { id: uuidv4(), nome: "Esportes", imagem: "/images/grupos/esportes.png" },
];

const plataformas = [
  { id: "genio777", nome: "Gênio777", imagem: "/images/plataformas/genio777.png", cor: "#3B82F6", grupoId: grupos[0].id },
  { id: "pgcoelho", nome: "PG-COELHO", imagem: "/images/plataformas/pgcoelho.png", cor: "#8B5CF6", grupoId: grupos[1].id },
];

const eventos = [
  { id: uuidv4(), nome: "Lançamento Março", plataforma_id: "genio777" },
  { id: uuidv4(), nome: "Especial Copa", plataforma_id: "pgcoelho" },
];

const influenciadoresFamosos = [
  { nome: "Neymar Jr", instagram: "neymarjr", imagem: "/images/avatar/neymar.png" },
  { nome: "Anitta", instagram: "anitta", imagem: "/images/avatar/anitta.png" },
];

async function main() {
  console.log("Resetando dados...");

  // Deleta dados se as tabelas existirem
  try { await prisma.participanteEvento.deleteMany(); } catch { console.log("Tabela participanteEvento ainda não existe."); }
  try { await prisma.eventos.deleteMany(); } catch {}
  try { await prisma.recargas.deleteMany(); } catch {}
  try { await prisma.cadastros_influenciadores.deleteMany(); } catch {}
  try { await prisma.influenciadores.deleteMany(); } catch {}
  try { await prisma.plataformas.deleteMany(); } catch {}
  try { await prisma.grupos.deleteMany(); } catch {}

  console.log("Inserindo grupos e plataformas...");
  await prisma.grupos.createMany({ data: grupos });
  await prisma.plataformas.createMany({ data: plataformas });
  await prisma.eventos.createMany({ data: eventos });

  for (const famoso of influenciadoresFamosos) {
    const novoInfluenciador = await prisma.influenciadores.create({
      data: {
        id: uuidv4(),
        nome: famoso.nome,
        imagem: famoso.imagem,
        instagram: `@${famoso.instagram}`,
        email: faker.internet.email(),
        telefone: faker.phone.number("## #####-####"),
        data_cadastro: faker.date.recent(),
        cpf: faker.string.numeric(11),
        chavepix: faker.internet.email(),
        status: "diamante",
        contratado: faker.datatype.boolean(),
        salario_fixo: faker.datatype.boolean(),
      },
    });

    const plataformaRandom = faker.helpers.arrayElement(plataformas);

    const cadastro = await prisma.cadastros_influenciadores.create({
      data: {
        id: uuidv4(),
        influenciador_id: novoInfluenciador.id,
        plataforma_id: plataformaRandom.id,
        influenciador_plataforma_id: famoso.instagram.toUpperCase(),
      },
    });

    await prisma.recargas.create({
      data: {
        id: uuidv4(),
        cadastro_id: cadastro.id,
        inicio: faker.date.past(),
        termino: faker.date.future(),
        salario: 2500,
        meta: 5000,
        atingido: 3500,
        reembolso: 300,
        depositantes_meta: 80,
        depositantes_atingido: 45,
        tipo: "valor",
        status_meta: "incompleto",
        reembolso_status: "pendente",
      },
    });

    // Adiciona o influenciador no evento
    await prisma.participanteEvento.create({
      data: {
        id: uuidv4(),
        evento_id: eventos[0].id,
        influencer_id: novoInfluenciador.id,
        meta: 10000,
        atingido: faker.number.int({ min: 4000, max: 9000 }),
      },
    });
  }

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
