import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import * as cookieParser from "cookie-parser";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

dotenv.config();

const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);

    const corsOptions: CorsOptions = {
      origin: process.env.CLIENT_URL || '*', // Дозволяємо лише клієнту
      credentials: true,
    };
    

    app.use(cookieParser());
    app.enableCors(corsOptions);

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
