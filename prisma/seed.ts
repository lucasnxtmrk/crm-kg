import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const grupos = [
  { id: uuidv4(), nome: "Top Influencers", imagem: "/images/grupos/top1.png" },
  { id: uuidv4(), nome: "Esportes", imagem: "/images/grupos/esportes.png" },
];

const plataformas = [
  { id: "genio777", nome: "Gênio777", imagem: "/images/plataformas/genio777.png", cor: "#3B82F6", grupoId: grupos[0].id },
  { id: "pgcoelho", nome: "PG-COELHO", imagem: "/images/plataformas/pgcoelho.png", cor: "#8B5CF6", grupoId: grupos[0].id },
  { id: "piupiu", nome: "PiuPiu", imagem: "/images/plataformas/piupiu.png", cor: "#22C55E", grupoId: grupos[1].id },
  { id: "sergipeboi", nome: "Sergipe Boi", imagem: "/images/plataformas/sergipeboi.png", cor: "#F97316", grupoId: grupos[1].id },
];

const eventos = [
  { id: uuidv4(), nome: "Campanha Março", plataformaIds: ["genio777", "pgcoelho"] },
  { id: uuidv4(), nome: "Campanha Abril", plataformaIds: ["piupiu", "sergipeboi"] },
];

async function main() {
  console.log("Resetando dados...");
  await prisma.participanteEvento.deleteMany();
  await prisma.salarios_mensais.deleteMany();
  await prisma.recargas.deleteMany();
  await prisma.cadastros_influenciadores.deleteMany();
  await prisma.influenciadores.deleteMany();
  await prisma.eventoPlataforma.deleteMany();
  await prisma.eventos.deleteMany();
  await prisma.plataformas.deleteMany();
  await prisma.grupos.deleteMany();
  await prisma.usuarios.deleteMany();

  await prisma.grupos.createMany({ data: grupos });
  await prisma.plataformas.createMany({ data: plataformas });

  for (const evento of eventos) {
    await prisma.eventos.create({
      data: {
        id: evento.id,
        nome: evento.nome,
        data_evento: faker.date.recent(),
        plataformas: {
          create: evento.plataformaIds.map((pid) => ({ plataformaId: pid })),
        },
      },
    });
  }

  await prisma.usuarios.create({
    data: {
      nome: "Super Admin",
      email: "admin@kg.com",
      senha: "123456", // ✅ Substituir por hash no futuro
      role: "SUPERADMIN",
    },
  });

  for (let i = 0; i < 10; i++) {
    const nome = faker.person.fullName();
    const influenciador = await prisma.influenciadores.create({
      data: {
        id: uuidv4(),
        nome,
        imagem: "/images/avatar/avatar.png",
        instagram: `@${nome.split(" ")[0].toLowerCase()}official`,
        email: faker.internet.email(),
        telefone: faker.phone.number("## #####-####"),
        data_cadastro: faker.date.past(),
        cpf: faker.string.numeric(11),
        chavepix: faker.internet.email(),
        status: faker.helpers.arrayElement(["diamante", "ouro", "prata"]),
        contratado: true,
        salario_fixo: faker.datatype.boolean(),
      },
    });

    const plataforma = faker.helpers.arrayElement(plataformas);
    const cadastro = await prisma.cadastros_influenciadores.create({
      data: {
        id: uuidv4(),
        influenciador_id: influenciador.id,
        plataforma_id: plataforma.id,
        influenciador_plataforma_id: influenciador.instagram.replace("@", "").toUpperCase(),
      },
    });

    const salario = parseFloat(faker.finance.amount(1500, 3000, 2));
    const meta = parseFloat(faker.finance.amount(5000, 9000, 2));
    const atingido = parseFloat(faker.finance.amount(meta * 0.6, meta * 1.2, 2));

    await prisma.recargas.create({
      data: {
        id: uuidv4(),
        cadastro_id: cadastro.id,
        inicio: faker.date.recent(),
        termino: faker.date.soon(),
        salario,
        meta,
        atingido,
        reembolso: faker.number.int({ min: 0, max: 500 }),
        depositantes_meta: faker.number.int({ min: 50, max: 100 }),
        depositantes_atingido: faker.number.int({ min: 30, max: 80 }),
        tipo: "valor",
        status_meta: atingido >= meta ? "completo" : "incompleto",
        reembolso_status: atingido >= meta ? "pago" : "pendente",
      },
    });

    for (let m = 1; m <= 4; m++) {
      await prisma.salarios_mensais.create({
        data: {
          id: uuidv4(),
          influenciador_id: influenciador.id,
          ano: 2025,
          mes: m,
          valor: faker.number.float({ min: 1800, max: 3200, precision: 0.01 }),
        },
      });
    }

    await prisma.participanteEvento.create({
      data: {
        id: uuidv4(),
        evento_id: eventos[0].id,
        influencer_id: influenciador.id,
        meta: Math.floor(meta),
        atingido: Math.floor(atingido),
      },
    });
  }

  console.log("\u2705 Seed completo com dados realistas!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });