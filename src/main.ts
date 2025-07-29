import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import AddSwagger from "./resources/swagger/add-swagger";
import { HttpExceptionFilter } from "./resources/errors-handler";


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(ConfigService);
  const port = process.env.PORT ?? 3000;

  app.enableCors({
    origin: configService.get("ALLOWED_ORIGINS", "*").split(","),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  AddSwagger(app);

  await app.listen(port, () =>
    Logger.log(
      `Listening for API calls on port \x1b[33m${port} 💻\x1b[37m`,
      "NestApplication"
    )
  );
}
bootstrap();