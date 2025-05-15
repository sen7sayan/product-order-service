import { Controller, Post, Body, Get, Query, Param, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateOrderDto, @Req() req: Request) {
    const user = req.user.id;
    return this.orderService.create(dto, user);
  }

  @Get('user/:customerId')
  async getUserOrders(
    @Param('customerId') customerId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.orderService.getUserOrders(customerId, +page, +limit);
  }

  // Get single order of a specific user
  @Get('user/:customerId/:orderId')
  async getUserOrderById(
    @Param('customerId') customerId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.getUserOrderById(customerId, orderId);
  }
}
