import { BadRequestException, Injectable, NotFoundException, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Bridge } from "./schemas/bridge.schema";
import mongoose, { AnyObject, Model } from "mongoose";

@Injectable()
export class BridgesService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @InjectModel(Bridge.name)
    private bridgeModel: Model<Bridge>
  ) {
  }

  private intervalId: NodeJS.Timeout;
  private readonly timeout = 20000;
  private readonly url = "https://web.seattle.gov/Travelers/api/Map/GetBridgeData";

  onModuleDestroy(): any {
    clearInterval(this.intervalId);
  }

  onModuleInit(): any {
    this.checkBridges();
    this.startInterval();
  }

  private startInterval() {
    this.intervalId = setInterval(() => {
      this.checkBridges();
    }, this.timeout);
  }

  private async checkBridges() {
    try {
      const response = await fetch(this.url);
      const responseData = await response.json();
      const data = JSON.parse(responseData);
      for (const bridge of data) {
        this.bridgeModel.find({ name: bridge.DisplayName })
          .then(bridges => {
            if (bridges.length === 0) {
              console.log("No documents found for bridge:", bridge.DisplayName);
              this.bridgeModel.create(data)
                .then(savedDocument => {
                  console.log("Document saved successfully:", savedDocument);
                })
                .catch(err => console.error(err));
            } else if (bridge.Status && bridge.Status === "Open" && bridges[0].status !== "Open") {
              console.log("Bridge Open:", bridges[0].name);
              this.updateBridge(bridge, { lastOpen: Date.now() });
            } else if (bridge.Status && bridge.Status === "Closed" && bridges[0].status !== "Closed") {
              this.updateBridge(bridge, { lastClosed: Date.now() });
            }
          })
          .catch(err => {
            console.error("Error finding bridge", err);
          });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getAllBridges(): Promise<Bridge[]> {
    return await this.bridgeModel
      .find()
      .sort({ _id: 1 })
      .exec();
  }

  async getBridgeById(id: string) {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException("Invalid id.");
    }
    const bridge = await this.bridgeModel.findById(id).exec();
    if (!bridge) {
      throw new NotFoundException("Bridge not found!");
    }
    return bridge;
  }

  async updateBridge(bridge: any, updateObject: AnyObject) {
    try {
      const updatedDocument = await this.bridgeModel.findOneAndUpdate(
        { name: bridge.DisplayName },
        { $set: { ...updateObject, status: bridge.Status } },
        { new: true }
      );

      if (!updatedDocument) {
        console.log("Document not found.");
        return;
      }
      console.log("Document updated successfully:", updatedDocument);
    } catch (err) {
      console.error("Error updating document:", err);
    }
  }
}
