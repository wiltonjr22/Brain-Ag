import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function AddSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Brain-Ag API')
    .setDescription('API documentation for brain-ag application')
    .setVersion('0.0.1')

  if (process.env.NODE_ENV !== "production") {
    config.addTag("Development Environment");
  }

  const document = SwaggerModule.createDocument(app, config.build());

  SwaggerModule.setup("swagger", app, document);
}