import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { BooksService } from './books.service';
import { Roles } from '../auth/roles/roles.decorator';
import { UserRoles } from '../users/types/user.type';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  get() {
    return this.booksService.findAll();
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Post('order')
  order() {
    return this.booksService.order();
  }
}
