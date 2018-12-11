import * as Expo from "expo";
import { EventSubscription } from "fbemitter";

declare module "expo" {
  export namespace DangerZone {
    export namespace DeviceMotion {
      export interface DeviceMotionEvent {
        acceleration: {
          x: number;
          y: number;
          z: number;
        };
        accelerationIncludingGravity: {
          x: number;
          y: number;
          z: number;
        };
        rotation: {
          alpha: number;
          beta: number;
          gamma: number;
        };
        rotationRate: {
          alpha: number;
          beta: number;
          gamma: number;
        };
        orientation: 0 | 90 | 180 | -90;
      }
      export function addListener(
        listener: (event: DeviceMotionEvent) => void
      ): EventSubscription;
      export function removeAllListeners(): void;
      export function setUpdateInterval(intervalMs: number): void;
    }
  }

  export namespace ScreenOrientation {
    export function allowAsync(orientation: keyof Orientations): Promise<void>;
  }
}
