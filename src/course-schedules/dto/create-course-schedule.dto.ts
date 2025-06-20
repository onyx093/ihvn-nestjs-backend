import { WeekDay } from '@/enums/week-day.enum';
import {
  IsEnum,
  IsNotEmpty,
  Matches,
  registerDecorator,
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

function compareTime(a: string, b: string): number {
  const [aHours, aMinutes] = a.split(':').map(Number);
  const [bHours, bMinutes] = b.split(':').map(Number);
  return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
}

@ValidatorConstraint({ name: 'IsAfterTime', async: false })
export class IsAfterTimeConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return compareTime(value, relatedValue) > 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be after ${args.constraints[0]}`;
  }
}

export function IsAfterTime(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsAfterTimeConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsTimeBetween', async: false })
export class IsTimeBetweenConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [minTime, maxTime] = args.constraints;
    console.log(`Validating time: ${value} between ${minTime} and ${maxTime}`);

    return compareTime(value, minTime) >= 0 && compareTime(value, maxTime) <= 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be between ${args.constraints[0]} and ${args.constraints[1]}`;
  }
}

export function IsTimeBetween(
  minTime: string,
  maxTime: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [minTime, maxTime],
      validator: IsTimeBetweenConstraint,
    });
  };
}

export function IsTimeString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTimeString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid time in HH:MM format`;
        },
      },
    });
  };
}

@ValidatorConstraint({ name: 'IsInWeekDays', async: false })
export class IsInWeekDaysConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [allowedDays] = args.constraints;
    return allowedDays.includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `Day of week must be one of: ${args.constraints[0].join(', ')}`;
  }
}

export function IsInWeekDays(
  allowedDays: number[],
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [allowedDays],
      validator: IsInWeekDaysConstraint,
    });
  };
}

export class CreateCourseScheduleDto {
  @IsEnum(WeekDay, {
    message: 'Invalid day of week. Use 1 (Monday) to 6 (Saturday)',
  })
  @IsNotEmpty({ message: 'Day of week is required' })
  @Validate(IsInWeekDays, [1, 2, 3, 4, 5, 6], {
    message: 'Course schedules can only be created for Monday-Saturday',
  })
  dayOfWeek: WeekDay;

  @IsNotEmpty({ message: 'Start time is required' })
  @IsTimeString()
  @IsTimeBetween('09:00', '16:00')
  @Matches(/^([01]\d|2[0-3]):00$/, {
    message: 'Time must be on the hour (HH:00)',
  })
  startTime: string;

  @IsNotEmpty({ message: 'End time is required' })
  @IsTimeString()
  @IsTimeBetween('09:00', '16:00')
  @Matches(/^([01]\d|2[0-3]):00$/, {
    message: 'Time must be on the hour (HH:00)',
  })
  @IsAfterTime('startTime')
  endTime: string;
}
