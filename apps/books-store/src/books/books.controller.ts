import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { BooksService } from './books.service';
import { Roles } from '../auth/roles/roles.decorator';
import { UserRoles } from '../users/types/user.type';
import { RoleGuard } from '../common/guards/role.guard';

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
  @Get('admin')
  adminGet() {
    return this.booksService.findAll();
  }
}
