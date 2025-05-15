import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../product/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateOrderDto,customerId: string) {
    let totalPrice = 0;
    const orderItems: OrderItem[] = [];

    for (const item of dto.orderItems) {
      const product = await this.productRepo.findOne({ where: { id: item.productId } });

      if (!product) throw new NotFoundException(`Product not found: ${item.productId}`);
      if (product.stock < item.quantity)
        throw new BadRequestException(`Insufficient stock for ${product.name}`);

      const unitPrice = +product.price;
      const itemTotal = unitPrice * item.quantity;
      totalPrice += itemTotal;

      const orderItem = this.orderItemRepo.create({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotal,
      });

      orderItems.push(orderItem);
      product.stock -= item.quantity;
      await this.productRepo.save(product);
    }

    const order = this.orderRepo.create({
      customerId,
      totalPrice,
      orderItems,
    });

    const saved = await this.orderRepo.save(order);

    return {
      statusCode: 201,
      message: 'Order placed successfully',
      data: saved,
    };
  }

  async getUserOrders(customerId: string, page = 1, limit = 10) {
    const [orders, total] = await this.orderRepo.findAndCount({
      where: { customerId },
      relations: ['orderItems'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      statusCode: 200,
      page,
      limit,
      total,
      data: orders,
    };
  }

  async getUserOrderById(customerId: string, orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, customerId },
      relations: ['orderItems'],
    });

    if (!order) throw new NotFoundException('Order not found');

    return {
      statusCode: 200,
      data: order,
    };
  }
}
