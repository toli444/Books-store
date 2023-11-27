import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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

  @UseGuards(AccessTokenGuard)
  @Get()
  getByIds(@Param('ids') ids: string) {
    return this.booksService.findByIds(ids);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Get('admin')
  adminGet() {
    return this.booksService.findAll();
  }
}
