import { protocols } from "../config";
import DeBridge from "./DeBridge";
import Lifi from './LiFi';
import Odos from "./Odos";
import RhinoFi from "./RhinoFi";
import Uniswap from "./Uniswap";

export const parsers = {
  [protocols.rhinofi.identifier]: new RhinoFi(),
  [protocols.uniswap.identifier]: new Uniswap(),
  [protocols.lifi.identifier]: new Lifi(),
  [protocols.odos.identifier]: new Odos(),
  [protocols.debridge.identifier]: new DeBridge()
};
