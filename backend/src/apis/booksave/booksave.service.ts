import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookSave } from './entities/booksave.entity';
import { CreateBookSaveDto } from './dto/create-booksave.dto';
import { IBookSaveService } from './interface/booksave.interface';

@Injectable()
export class BookSaveService implements IBookSaveService {
  constructor(
    @InjectRepository(BookSave)
    private bookSaveRepository: Repository<BookSave>,
  ) {}

  async create(createBookSaveDto: CreateBookSaveDto): Promise<BookSave> {
    const bookSave = this.bookSaveRepository.create(createBookSaveDto);
    return this.bookSaveRepository.save(bookSave);
  }

  async findAll(): Promise<BookSave[]> {
    return this.bookSaveRepository.find({
      relations: ['user', 'book'],
    });
  }

  async findByUser(userId: number): Promise<BookSave[]> {
    return this.bookSaveRepository.find({
      where: { userId },
      relations: ['book'],
    });
  }

  async findOne(id: number): Promise<BookSave> {
    const bookSave = await this.bookSaveRepository.findOne({
      where: { id },
      relations: ['user', 'book'],
    });

    if (!bookSave) {
      throw new NotFoundException(`BookSave with ID ${id} not found`);
    }

    return bookSave;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.bookSaveRepository.delete(id);
    return result.affected > 0;
  }
}
