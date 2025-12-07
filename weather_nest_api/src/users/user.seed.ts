import { UsersService } from './users.service';

export async function createDefaultUser(usersService: UsersService) {
  const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.DEFAULT_ADMIN_PASSWORD || '123456';

  const exists = await usersService.findByEmail(email);
  
  if (!exists) {
    console.log('Criando usuário admin padrão...');
    await usersService.create({ email, password, role: 'admin' });
  } else {
    console.log('Usuário admin já existe');
  }
}
