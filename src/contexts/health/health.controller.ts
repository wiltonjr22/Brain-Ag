import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import packageJson from "../../../package.json";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor() { }

  @Get()
  @ApiOperation({ summary: "Health check endpoint" })
  getHealth() {
    const { name, version } = packageJson;
    return `Application: ${name}, Version: ${version}`;
  }
}