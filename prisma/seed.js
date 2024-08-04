import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function seed() {
  // Limpa os registros existentes
  // await deleteAll();

  // Adiciona novos registros
  await addUsers();
  // await addRecords();

  console.log('Seed completed.');
  await db.$disconnect();
}

async function deleteAll() {
  // Deleta todos os registros e usuários
  await db.record.deleteMany({});
  await db.user.deleteMany({});
}

async function addUsers() {
  // Cria usuários com senhas criptografadas
  const users = [
    { name: 'adm', password: 'senha', type: 1 },
    // { name: 'user', password: 'userPass', type: 2 },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await db.user.create({
      data: {
        name: user.name,
        password: hashedPassword,
        type: user.type,
      },
    });
  }
}

async function addRecords() {
  // Adiciona registros
  const records = [
    {
      name: 'Junior Almeida Santos',
      details: 'Atraso por centro cirúrgico',
      type: 1,
      status: 1,
      clinic: 1,
      confirmedAt: null,
      permanence: null,
    },
    // Adicione mais registros conforme necessário
  ];

  for (const record of records) {
    await db.record.create({
      data: record,
    });
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
