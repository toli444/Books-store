import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Book } from './types/book.type';

@Injectable()
export class BooksService {
  constructor(private readonly httpService: HttpService) {}

  async findAll() {
    const { data } = await firstValueFrom(
      this.httpService.get<Book[]>(`${process.env.BOOKS_STOCK_URL}/books`)
    );

    return data;
  }

  async findById(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<Book[]>(`${process.env.BOOKS_STOCK_URL}/books/${id}`)
    );

    return data;
  }
}
