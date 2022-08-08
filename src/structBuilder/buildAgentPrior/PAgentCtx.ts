import { ChemAgent } from "../../core/ChemAgent";
import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { AgentCmd } from "./AgentCmd";
import { Clusters } from "./Clusters";
import { NodeInfo } from "../NodeInfo";
import { ChemBackground } from "../../core/ChemBackground";

export class PAgentCtx {
  readonly agentFrame: FigFrame;

  readonly nodesInfo: NodeInfo[] = [];

  readonly cmdStack: AgentCmd[] = [];

  readonly clusters: Clusters = new Clusters();

  readonly backs: ChemBackground[] = [];

  constructor(
    public readonly agent: ChemAgent,
    public readonly props: ChemImgProps
  ) {
    this.agentFrame = new FigFrame();
  }
}
