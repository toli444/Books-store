import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Book } from './types/book.type';

@Injectable()
export class BooksService {
  constructor(private readonly httpService: HttpService) {}

  async findAll() {
    const { data } = await firstValueFrom(
      this.httpService.get<Book[]>('http://localhost:8000/books')
    );

    return data;
  }

  order() {
    return true;
  }
}
