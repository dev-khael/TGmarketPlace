import { Injectable } from '@nestjs/common';
import { Order, PrismaClient, Product, User, Vendor } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { AddProductDto } from './dto/add-product.dto';
import { RemoveProductDto } from './dto/remove-product.dto';
import { EditProductDto } from './dto/edit-product.dto';
import { join } from 'path';
import fs from 'fs/promises';
import { UpdateOrderDto } from './dto/update-order.dto';
@Injectable()
export class VendorService {
  constructor(private prisma: PrismaClient) {}

  async createVendor(createVendorDto: CreateVendorDto) {
    try {
      const user = await this.checkifvendor(createVendorDto.email);
      console.log(user);
      if (user.isVendor) {
        throw new Error('User is already a vendor');
      }

      const newVendor = await this.prisma.vendor.create({
        data: {
          ...createVendorDto,
          user_id: user.id,
        },
      });
      await this.prisma.user.update({
        where: {
          email: createVendorDto.email,
        },
        data: {
          isVendor: true,
        },
      });
      return newVendor;
    } catch (error) {
      throw new Error(error);
    }
  }

  async checkifvendor(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      console.log(user.isVendor);
      if (user.isVendor) {
        return user;
      }
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async addProduct(addProductDto: AddProductDto, image: Express.Multer.File) {
    try {
      console.log(addProductDto);
      const vendor = await this.getVendorDetails(addProductDto.email);
      console.log(vendor);
      if (!vendor) {
        throw new Error('User is not a vendor');
      }
      const imageUrl = (await image)
        ? join('/uploads/images', image.filename)
        : '';

      const product = await this.prisma.product.create({
        data: {
          price: +addProductDto.price,

          name: addProductDto.name,
          description: addProductDto.description,
          stock: +addProductDto.stock,
          vendor_id: vendor.id,
          ProductImage: {
            create: {
              image_url: imageUrl.replaceAll('\\', '/'),
            },
          },
        },
      });
      return product;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getVendorDetails(email: string): Promise<Vendor> {
    try {
      const vendor = await this.prisma.vendor.findUnique({
        where: {
          email: email,
        },
      });
      console.log(vendor);
      return vendor;
    } catch (error) {
      throw new Error(error);
    }
  }

  async removeProduct(removeProductDto: RemoveProductDto) {
    try {
      const vendor = await this.getVendorDetails(removeProductDto.email);
      if (!vendor) {
        throw new Error('User is not a vendor');
      }
      const hasOrder = await this.prisma.order.findFirst({
        where: {
          vendor_id: vendor.id,
        },
      });

      if (hasOrder) {
        throw new Error('Cannot delete product with an associated order');
      }
      const product = await this.prisma.productImage.deleteMany({
        where: {
          product_id: removeProductDto.id,
        },
      });
      await this.prisma.product.delete({
        where: {
          id: removeProductDto.id,
        },
      });
      return product;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getVendorProducts(email: string): Promise<Product[]> {
    try {
      const vendor = await this.getVendorDetails(email);
      console.log(vendor);
      if (!vendor) {
        throw new Error('User is not a vendor');
      }
      const products = await this.prisma.product.findMany({
        where: {
          vendor_id: vendor.id,
        },
        include: {
          ProductImage: {
            select: {
              image_url: true,
            },
          },
        },
      });
      return products;
    } catch (error) {
      throw new Error(error);
    }
  }

  async editProduct(id: number, editProductDto: EditProductDto) {
    try {
      const vendor = await this.getVendorDetails(editProductDto.email);
      if (!vendor) {
        throw new Error('User is not a vendor');
      }
      const product = await this.prisma.product.update({
        where: {
          id: id,
        },
        data: {
          price: editProductDto.price,
          name: editProductDto.name,
          description: editProductDto.description,
          stock: editProductDto.stock,
        },
      });
      await this.prisma.productImage.updateMany({
        where: {
          product_id: id,
        },
        data: {
          image_url: editProductDto.image_url,
        },
      });
      return product;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updatePaidOrders(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        include: {
          Vendor: true,
        },
      });

      if (updateOrderDto.orderItems.length === 0) {
        throw new Error('Please select at least one item');
      }
      console.log(updateOrderDto.orderItems);

      for (let i = 0; i < updateOrderDto.orderItems.length; i++) {
        const item = updateOrderDto.orderItems[i];
        await this.prisma.order.update({
          where: {
            id: item.id,
          },
          data: {
            payment_status: 'Paid',
          },
        });
      }

      return 'Order paid successfully';
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateDeliveredOrders(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        include: {
          Vendor: true,
        },
      });

      if (updateOrderDto.orderItems.length === 0) {
        throw new Error('Please select at least one item');
      }

      for (let i = 0; i < updateOrderDto.orderItems.length; i++) {
        const item = updateOrderDto.orderItems[i];
        await this.prisma.order.update({
          where: {
            id: item.id,
          },
          data: {
            delivery_status: 'Delivered',
          },
        });
      }

      return 'Order delivered successfully';
    } catch (error) {
      throw new Error(error);
    }
  }

  async viewOrderasvendor(id: number): Promise<Order[]> {
    try {
      const vendor = await this.prisma.vendor.findFirst({
        where: {
          user_id: id,
        },
      });
      const order = await this.prisma.order.findMany({
        where: {
          vendor_id: vendor.id,
        },
        include: {
          OrderItem: true,
          productimage: true,
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [
          {
            payment_status: 'asc',
          },
          {
            createdAt: 'asc',
          },
        ],
      });
      order.sort((a, b) => {
        if (a.payment_status === 'pending' && b.payment_status !== 'pending') {
          return -1; // a comes before b
        } else if (
          a.payment_status !== 'pending' &&
          b.payment_status === 'pending'
        ) {
          return 1; // b comes before a
        } else {
          return 0; // no change in order
        }
      });

      return order;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUnpaidOrders(email: string): Promise<Order[]> {
    try {
      const vendor = await this.getVendorDetails(email);
      if (!vendor) {
        throw new Error('User is not a vendor');
      }
      const order = await this.prisma.order.findMany({
        where: {
          vendor_id: vendor.id,
          payment_status: 'pending',
        },
        include: {
          OrderItem: true,
          productimage: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      return order;
    } catch (error) {
      throw new Error(error);
    }
  }
}
