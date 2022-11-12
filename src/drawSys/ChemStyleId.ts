/*
 *           atom            comment           oxitationState
 *   agentK    |      custom   |           itemMass | nodeCharge
 *      |      |         |     |              |    +6    |
 *     ###   #   #     ####    #             235  #   #  2+
 *    #   #  #   #     #   #  ###     #           #   #
 *       #   #####  *  ####  # # #  #####         #   #
 *      #    #   #  |  # #     #      #           #   #
 *     ####  #   #  |  #  #    #      |       92   ###   3
 *                  |                 |        |         |
 *              multiplier         operation atomNumber itemMass
 * multiK - coeff after multiplier
 */
export type ChemStyleId =
  | "agentK"
  | "atom"
  | "atomNumber"
  | "bracket"
  | "bracketCharge"
  | "bracketCount"
  | "comma"
  | "comment"
  | "custom"
  | "itemCount"
  | "itemMass"
  | "multiplier"
  | "multiK"
  | "nodeCharge"
  | "opComment"
  | "operation"
  | "oxidationState"
  | "radical";
