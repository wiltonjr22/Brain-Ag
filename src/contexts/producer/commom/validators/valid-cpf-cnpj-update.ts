import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { DocType } from '../../commom/entities/producer.entities';

export function IsValidDocumentUpdateStrict(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidDocumentUpdateStrict',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj = args.object as any;
          const docType: DocType | undefined = obj.docType;
          const document: string | undefined = obj.document;

          // Os dois devem estar presentes juntos ou ausentes juntos
          if ((document && !docType) || (!document && docType)) {
            return false;
          }

          // Se nenhum foi enviado, ok
          if (!document && !docType) return true;

          // Validação conforme docType
          if (docType === DocType.CPF) return cpf.isValid(document);
          if (docType === DocType.CNPJ) return cnpj.isValid(document);

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Para atualizar, os campos document e docType devem ser enviados juntos e válidos';
        },
      },
    });
  };
}
