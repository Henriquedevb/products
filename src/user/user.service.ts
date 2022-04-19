import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const user = await this.prismaService.user.findMany({
      select: {
        email: true,
        name: true,
        lastName: true,
        products: true,
      },
    });
    return user;
  }

  async enableUser(id: string) {
    await this.prismaService.user.updateMany({
      where: { id },
      data: { isAuthorizedSeller: true },
    });
  }
}
