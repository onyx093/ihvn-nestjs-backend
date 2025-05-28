import { Injectable } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PaginationResult } from '@/common/interfaces/pagination-result.interface';

@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(Instructor)
    private instructorRepository: Repository<Instructor>
  ) {}
  create(createInstructorDto: CreateInstructorDto) {
    return 'This action adds a new instructor';
  }

  async findAll(
    paginationDto: PaginationDto
  ): Promise<PaginationResult<Instructor>> {
    const { page, limit } = paginationDto;
    const [data, total] = await this.instructorRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: string): Promise<Instructor | null> {
    return this.instructorRepository.findOne({
      where: { id },
    });
  }

  update(id: string, updateInstructorDto: UpdateInstructorDto) {
    return `This action updates a #${id} instructor`;
  }

  remove(id: string) {
    return `This action removes a #${id} instructor`;
  }
}
