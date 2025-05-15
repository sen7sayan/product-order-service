import { Controller, Post, Body, Get, Query, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import * as jwt from 'jsonwebtoken';
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService,

  ) {}
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateOrderDto, @Req() req: Request) {
    // const user = req.user.id;

    return this.orderService.create(dto);
  }


    // @Param('customerId') customerId: string,
    // @Query('page') page: string = '1',
    // @Query('limit') limit: string = '10',


  @MessagePattern('order_detail_queue')
  async getUserOrders( @Payload() payload: any,
  
  ) {
    console.log(payload)
 const authHeader = payload.data.authHeader;
  if (!authHeader) {
    throw new UnauthorizedException('Token missing');
  }

   const token = authHeader.replace('Bearer ', '');
   try { 
    const page =  payload.data.page || 1;
    const limit =  payload.data.limit || 10;
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return this.orderService.getUserOrders( decoded.id, +page, +limit);
   } catch (error) {
    throw new UnauthorizedException('Invalid or expired token');
   }
    
  }

  // Get single order of a specific user
   @MessagePattern('single_order_queue')
  async getUserOrderById(
   @Payload() payload: any
  ) {
    const authHeader = payload.data.authHeader;
  if (!authHeader) {
    throw new UnauthorizedException('Token missing');
  }

   const token = authHeader.replace('Bearer ', '');
   try { 
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return this.orderService.getUserOrderById(decoded.id, payload.data.id);
   } catch (error) {
    throw new UnauthorizedException('Invalid or expired token');
   }
    
  }


   @MessagePattern('create_order')
  async handleCreateOrder(@Payload() payload: any) {
  const authHeader = payload.orderData.authHeader;
  if (!authHeader) {
    throw new UnauthorizedException('Token missing');
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return await this.orderService.createFromEvent({ ...payload, userId: decoded.id });
  } catch (err) {
    console.error('Token verification failed:', err.message);
    throw new UnauthorizedException('Invalid or expired token');
  }
}


}
