import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: ProductDto, payload: string) {
    try {
      const token = payload.replace('Bearer ', '').trim();
      const user = this.jwtService.decode(token);

      const user_id = user['user_id'];

      const product = await this.prismaService.product.create({
        data: {
          userId: user_id,
          productTitle: dto.product_title,
          category: dto.category,
          description: dto.description,
          price: dto.price,
        },
      });
      return product;
    } catch (error) {
      throw new UnprocessableEntityException('Erro ao salvar os dados');
    }
  }

  findAll() {
    return this.prismaService.product.findMany();
  }

  async findOne(product_id: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id: product_id },
    });

    return product;
  }

  async update(product_id: string, dto: ProductDto) {
    const product = await this.prismaService.product.update({
      where: { id: product_id },
      data: {
        productTitle: dto.product_title,
        category: dto.category,
        description: dto.description,
        price: dto.price,
      },
    });

    return product;
  }

  async delete(product_id: string) {
    await this.prismaService.product.delete({
      where: { id: product_id },
    });
  }
}
