const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Admin kullanıcısı oluştur
    const adminPassword = await bcrypt.hash('a', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'a@a',
        password: adminPassword,
        name: 'Admin',
        surname: 'User',
        role: 'ADMIN'
      }
    });
    
    console.log('Admin kullanıcısı oluşturuldu:', admin);

    // Normal kullanıcı oluştur
    const userPassword = await bcrypt.hash('b', 10);
    const user = await prisma.user.create({
      data: {
        email: 'b@b',
        password: userPassword,
        name: 'Normal',
        surname: 'User',
        role: 'USER'
      }
    });
    
    console.log('Normal kullanıcı oluşturuldu:', user);
    
    // Normal kullanıcı2 oluştur
    const cPassword = await bcrypt.hash('c', 10);
    const cUser = await prisma.user.create({
      data: {
        email: 'c@c',
        password: cPassword,
        name: 'Test',
        surname: 'Kullanıcı',
        role: 'USER'
      }
    });
    console.log('c@c kullanıcısı oluşturuldu:', cUser);
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers(); 