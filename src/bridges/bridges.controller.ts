import { Controller, Get, Param } from "@nestjs/common";
import { BridgesService } from "./bridges.service";
import { Bridge } from "./schemas/bridge.schema";

@Controller('bridges')
export class BridgesController {
  constructor(private readonly bridgeService: BridgesService) {}

  @Get('')
  async getAllBridges() : Promise<Bridge[]> {
    return await this.bridgeService.getAllBridges();
  }

  @Get('/:id')
  async findBridgeById(@Param('id') id: string): Promise<Bridge> {
    return this.bridgeService.getBridgeById(id);
  }
}
