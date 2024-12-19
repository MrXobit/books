import { Module } from "@nestjs/common";
import { fileService } from "./file.service";

@Module({
 providers: [fileService]
}) export class FileModule {}