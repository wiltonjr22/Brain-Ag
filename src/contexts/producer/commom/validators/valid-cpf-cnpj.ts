import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { DocType } from '../../commom/entities/producer.entities';

export function IsValidDocument(
  docTypeField: string = 'docType',
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidDocument',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as any;
          const docType: DocType = object[docTypeField];

          if (!value || !docType) return false;

          if (docType === DocType.CPF) return cpf.isValid(value);
          if (docType === DocType.CNPJ) return cnpj.isValid(value);

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Documento inválido para o tipo informado (CPF ou CNPJ)';
        },
      },
    });
  };
}
