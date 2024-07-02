import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as passport from "passport";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.enableCors();
    app.setGlobalPrefix("api/cronx");
    app.use(passport.initialize());
    app.use(passport.session());

    // Swagger setup
    const config = new DocumentBuilder()
        .setTitle("Enif Ai")
        .setDescription("building blocks")
        .setVersion("1.0")
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-docs", app, document);
    const port = configService.get("PORT");
    await app.listen(port || 4001);
}
bootstrap();
