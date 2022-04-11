import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('product')
@UseGuards(JwtGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtGuard)
  @Post('new-product')
  createProduct(
    @Body() dto: ProductDto,
    @Headers('Authorization') token: string,
  ) {
    return this.productService.create(dto, token);
  }

  @Get()
  getAllProducts() {
    return this.productService.findAll();
  }

  @Get(':id')
  async getOneProduct(@Param() product_id) {
    return this.productService.findOne(product_id.id);
  }

  @Patch(':id')
  async updateProduct(@Param() product_id, @Body() dto: ProductDto) {
    return this.productService.update(product_id.id, dto);
  }

  @Delete(':id')
  async deleteProduct(@Param() product_id) {
    return this.productService.delete(product_id.id);
  }
}
