import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productRepo.create(dto);
    await this.productRepo.save(product);
    return {
      statusCode: 201,
      message: 'Product created successfully',
      data: product,
    };
  }

  async findAll(page: number, limit: number) {
    const [data, total] = await this.productRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      statusCode: 200,
      message: 'Products fetched successfully',
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Product not found',
        error: 'Not Found',
      });
    }

    return {
      statusCode: 200,
      message: 'Product fetched successfully',
      data: product,
    };
  }
}
