import { Controller, Get } from "@nestjs/common";

@Controller('bridges')
export class BridgesController {

  @Get('')
  test() {
    return JSON.stringify("test")
  }
}
