import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { Between, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PaginationResult } from '@/common/interfaces/pagination-result.interface';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>
  ) {}

  async generateReferenceNumber(
    manager: EntityManager,
    year: number
  ): Promise<string> {
    const prefix = 'IHVN';

    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${year}-12-31T23:59:59Z`);

    const count = await manager.getRepository(Student).count({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });

    const serial = (count + 1).toString().padStart(3, '0'); // e.g. "001", "002"
    return `${prefix}-${year}-${serial}`;
  }

  create(createStudentDto: CreateStudentDto) {
    return 'This action adds a new student';
  }

  async findAll(
    paginationDto: PaginationDto
  ): Promise<PaginationResult<Student>> {
    const { page, limit } = paginationDto;
    const [data, total] = await this.studentRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { referenceNumber: 'ASC' },
      relations: { user: true },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Student | null> {
    return this.studentRepository.findOne({
      where: { id },
    });
  }

  update(id: string, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: string) {
    return `This action removes a #${id} student`;
  }
}
