import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsAfterDate', async: false })
export class IsAfterDateConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    return (
      new Date(value) >
      (relatedPropertyName === 'today' ? new Date() : new Date(relatedValue))
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be after ${args.constraints[0]}`;
  }
}

export function IsAfterDate(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsAfterDateConstraint,
    });
  };
}

export class CreateCohortDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  /*   @IsInt()
  @Min(new Date().getFullYear())
  year: number; */

  @IsDateString()
  @IsAfterDate('today')
  startDate: Date;

  @IsDateString()
  @IsAfterDate('startDate')
  endDate: Date;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each courseId must be a valid UUID' })
  courseIds?: string[];

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
