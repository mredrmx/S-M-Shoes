const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Admin kullanıcısı oluştur
    const existingAdmin = await prisma.user.findUnique({ where: { email: 'a@a' } });
    if (!existingAdmin) {
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
    } else {
      console.log('Admin kullanıcısı zaten mevcut:', existingAdmin.email);
    }

    // Normal kullanıcı oluştur
    const existingUser = await prisma.user.findUnique({ where: { email: 'b@b' } });
    if (!existingUser) {
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
    } else {
      console.log('Normal kullanıcı zaten mevcut:', existingUser.email);
    }
    
    // Normal kullanıcı2 oluştur
    const existingCUser = await prisma.user.findUnique({ where: { email: 'c@c' } });
    if (!existingCUser) {
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
    } else {
      console.log('c@c kullanıcısı zaten mevcut:', existingCUser.email);
    }
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers(); 