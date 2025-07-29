import { Module } from "@nestjs/common";
import { DatabasesModule } from "./database/databases.modules";

@Module({
  imports: [DatabasesModule],
  exports: [DatabasesModule],
})
export class ResourcesModule { }