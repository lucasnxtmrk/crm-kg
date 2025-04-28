const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

const influenciadoresFamosos = [
  { nome: "Neymar Jr", instagram: "neymarjr", imagem: "/images/avatar/neymar.png" },
  { nome: "Anitta", instagram: "anitta", imagem: "/images/avatar/anitta.png" },
  { nome: "Reginaldo Rossi", instagram: "reginaldorossi", imagem: "/images/avatar/reginaldorossi.png" },
  { nome: "Gusttavo Lima", instagram: "gusttavolima", imagem: "/images/avatar/gusttavolima.png" },
  { nome: "Gisele Bündchen", instagram: "giselebundchen", imagem: "/images/avatar/gisele.png" },
  { nome: "Larissa Manoela", instagram: "larissamanoela", imagem: "/images/avatar/larissa.png" },
  { nome: "Whindersson Nunes", instagram: "whinderssonnunes", imagem: "/images/avatar/whindersson.png" },
];

async function main() {
  console.log("Resetando o banco...");

  // Limpar tudo
  await prisma.recargas.deleteMany();
  await prisma.cadastros_influenciadores.deleteMany();
  await prisma.influenciadores.deleteMany();
  await prisma.plataformas.deleteMany();

  console.log("Inserindo plataformas...");

  // Inserir plataformas
  await prisma.plataformas.createMany({
    data: [
      { id: "genio777", nome: "Gênio777", imagem: "/images/plataformas/genio777.png", cor: "#3B82F6" },
      { id: "pgcoelho", nome: "PG-COELHO", imagem: "/images/plataformas/pgcoelho.png", cor: "#8B5CF6" },
      { id: "piupiu", nome: "Piu-piu PQ", imagem: "/images/plataformas/piupiu.png", cor: "#FBBF24" },
      { id: "sergipeboi", nome: "Sergipe Boi", imagem: "/images/plataformas/sergipeboi.png", cor: "#F97316" },
    ],
  });

  const plataformas = await prisma.plataformas.findMany();

  console.log("Inserindo influenciadores famosos...");

  for (const famoso of influenciadoresFamosos) {
    const novoInfluenciador = await prisma.influenciadores.create({
      data: {
        id: uuidv4(),
        nome: famoso.nome,
        imagem: famoso.imagem,
        instagram: `@${famoso.instagram}`,
        email: faker.internet.email(),
        telefone: faker.phone.number("(##) #####-####"),
        data_cadastro: faker.date.recent(90),
        cpf: faker.number.int({ min: 10000000000, max: 99999999999 }).toString(),
        chavepix: faker.internet.email(),
        status: faker.helpers.arrayElement(["bronze", "prata", "ouro", "diamante"]),
        motivo_banimento: null,
      },
    });

    const plataformaRandom = faker.helpers.arrayElement(plataformas);

    const novoCadastro = await prisma.cadastros_influenciadores.create({
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
        cadastro_id: novoCadastro.id,
        inicio: faker.date.past(),
        termino: faker.date.future(),
        salario: faker.number.int({ min: 2000, max: 5000 }),
        meta: faker.number.int({ min: 3000, max: 8000 }),
        atingido: faker.number.int({ min: 1000, max: 7000 }),
        reembolso: faker.number.int({ min: 0, max: 500 }),
        depositantes_meta: faker.number.int({ min: 20, max: 100 }),
        depositantes_atingido: faker.number.int({ min: 10, max: 90 }),
        tipo: faker.helpers.arrayElement(["valor", "depositantes"]),
        status_meta: faker.helpers.arrayElement(["completo", "incompleto"]),
        reembolso_status: faker.helpers.arrayElement(["pendente", "pago"]),
      },
    });
  }

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
