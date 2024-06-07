import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Bridge } from "./schemas/bridge.schema";
import { Model } from "mongoose";

@Injectable()
export class BridgesService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @InjectModel(Bridge.name)
    private bridgeModel: Model<Bridge>
  ) {
  }

  private intervalId: NodeJS.Timeout;
  private timeout = 20000;
  private url = "https://web.seattle.gov/Travelers/api/Map/GetBridgeData";

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
    console.log("checking bridges....");
    try {
      const response = await fetch(this.url);
      const responseData = await response.json();
      const data = JSON.parse(responseData);
      for (const bridge of data) {
        this.bridgeModel.find({ name: bridge.DisplayName })
          .then(bridges => {
            if (bridges.length === 0) {
              console.log('No documents found for bridge:', bridge.DisplayName);
              this.bridgeModel.create(data)
                .then(savedDocument => {
                  console.log('Document saved successfully:', savedDocument);
                })
                .catch(err => console.error(err));
            } else if (bridge.Status && bridge.Status === 'Open' && bridges[0].status !== 'Open') {
              console.log('Bridge Open:', bridges[0].name);
              this.bridgeModel.findOneAndUpdate(
                {name: bridge.DisplayName},
                {$set: {lastOpen: Date.now(), status: bridge.Status}},
                {new: true}
              ).then(updatedDocument => {
                if (!updatedDocument) {
                  console.log('Document not found.');
                  return;
                }
                console.log('Document updated successfully:', updatedDocument);
              })
                .catch(err => {
                  console.error('Error updating document:', err);
                });
            } else if (bridge.Status && bridge.Status === 'Closed' && bridges[0].status !== 'Closed') {
              this.bridgeModel.findOneAndUpdate(
                {name: bridge.DisplayName},
                { $set: {status: bridge.Status, lastClosed: Date.now()} },
                { new: true }
              )
                .then(updatedDocument => {
                  if (!updatedDocument) {
                    console.log('Document not found.');
                    return;
                  }
                  console.log('Document updated successfully:', updatedDocument);
                })
                .catch(err => {
                  console.error('Error updating document:', err);
                });
            }
          })
          .catch(err => {
            console.error('Error finding bridge', err);
          });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
