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
 *              multiplier         operation         itemMass
 * multiK - coeff after multiplier
 */
export type ChemStyleId =
  | "agentK"
  | "atom"
  | "bracket"
  | "comma"
  | "comment"
  | "custom"
  | "itemCount"
  | "itemMass"
  | "multiplier"
  | "multiK"
  | "nodeCharge"
  | "operation"
  | "oxidationState"
  | "radical";
