import { AssignShiftDto } from './dto/assign-shift.dto';
import { UsersService } from './../users/users.service';
import { Shift } from './entities/shift.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift) private shiftsRepository: Repository<Shift>,
    private usersService: UsersService,
  ) {}
  async create(shiftDtos: ShiftDto[]) {
    const savedShifts: Shift[] = [];

    for (let shiftDto of shiftDtos) {
      const shift = this.shiftsRepository.create({ ...shiftDto, user: null });
      const savedShift = await this.shiftsRepository.save(shift);
      savedShifts.push(savedShift);
    }

    return savedShifts;
  }

  findAll() {
    return this.shiftsRepository.find();
  }

  async assign({ userId, shiftIds }: AssignShiftDto) {
    let user = null;
    if (userId) {
      user = await this.usersService.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
    }
    const shifts = await Promise.all(
      shiftIds.map(async (shiftId) => {
        const retrievedShift = await this.findOne(shiftId);
        if (!retrievedShift) {
          throw new NotFoundException(`Shift with id ${shiftId} not found`);
        }
        retrievedShift.user = user;
        const savedShift = await this.shiftsRepository.save(retrievedShift);
        return savedShift;
      }),
    );

    return shifts;
  }

  async findUnassigned() {
    return this.shiftsRepository.find({ where: { userId: IsNull() } });
  }

  findOne(id: number) {
    return this.shiftsRepository.findOne({ where: { id } });
  }

  async findAssigned(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const shifts = await this.shiftsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return shifts;
  }

  async update(id: number, updateShiftDto: UpdateShiftDto) {
    const shift = await this.findOne(id);
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }
    const updatedShift = Object.assign(shift, updateShiftDto);
    return this.shiftsRepository.save(updatedShift);
  }

  async remove(id: number) {
    const shift = await this.findOne(id);
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }
    return this.shiftsRepository.remove(shift);
  }
}
