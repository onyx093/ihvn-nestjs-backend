import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export class CreateCohortDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsInt()
  @Min(new Date().getFullYear())
  year: number;

  @IsDateString()
  @IsAfterDate('today')
  startDate: Date;

  @IsDateString()
  @IsAfterDate('startDate')
  endDate: Date;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}

export function IsAfterDate(property: string) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAfterDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      validator: {
        validate(value: Date, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = args.object[relatedPropertyName];
          return (
            value >
            (relatedPropertyName === 'today' ? new Date() : relatedValue)
          );
        },
      },
    });
  };
}
