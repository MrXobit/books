import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as dotenv from "dotenv"
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface"
import * as cookieParser from 'cookie-parser';

dotenv.config()
const start = async () => {
  try {
    const PORT = process.env.PORT || 5000
    const app = await NestFactory.create(AppModule)

    const corsOptions: CorsOptions = {
      origin: "https://mrxobit.github.io/books", 
      credentials: true, 
    }
    app.use(cookieParser());
    app.enableCors(corsOptions)

   app.listen(PORT, () => console.log(`server start on port ${PORT}`))
  } catch(e) {
    console.log(e)
  }
}

start()