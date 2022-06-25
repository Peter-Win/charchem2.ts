import { Int } from "../../types";
import { ChemNode } from "../../core/ChemNode";
import { ChemObj } from "../../core/ChemObj";
import { ChemExpr } from "../../core/ChemExpr";
import { ChemBond } from "../../core/ChemBond";
import { makeElemList } from "../../inspectors/makeElemList";
import { makeTextFormula } from "../../inspectors/makeTextFormula";
import { makeBrutto } from "../../inspectors/makeBrutto";
import { calcCharge } from "../../inspectors/calcCharge";
import { compile } from "../compile";
import { rulesCharChem } from "../../textRules/rulesCharChem";

const chargeCheck = (node: ChemNode): ChemObj =>
  node.charge ? compile(makeElemList(node).toString()) : node;

const nodeCvt = (node: ChemNode): ChemObj =>
  node.autoMode ? makeBrutto(node) : chargeCheck(node);

const nodeText = (node: ChemNode): string =>
  `${node.index}:${makeTextFormula(nodeCvt(node), rulesCharChem)}`;

const makeNodesText = (expr: ChemExpr) =>
  expr.getAgents()[0]!.nodes.map((it) => nodeText(it));

const bondTextStd = (it: ChemBond) =>
  `${it.nodes[0]?.index}` +
  `(${it.soft ? "~" : ""}${Math.round(it.dir!.polarAngleDeg())}` +
  `${it.n !== 1.0 ? `*${Math.round(it.n)}` : ""})` +
  `${it.nodes[1]?.index}`;

const list2s = <T>(
  list: T[],
  fn: (it: T) => string | number | undefined
): string => `[${list.map(fn).join(", ")}]`;

const bondTextExt = (bond: ChemBond) =>
  `${bond.linearText()}${list2s(bond.nodes, (it) => it?.index)}`;

const bondText = (bond: ChemBond) =>
  bond.nodes.length === 2 ? bondTextStd(bond) : bondTextExt(bond);

const bondInfo = (i: Int, it: ChemBond) => `${i}:${bondText(it)}`;

/**
 * format: <bondIndex>:<srcNodeIndex>([~if soft]<angle>[*<multiplicity> if!=1])<dstNodeIndex>
 */
const makeBondsInfo = (expr: ChemExpr) =>
  expr.getAgents()[0]!.bonds.map((it, i) => bondInfo(i, it));

const substringAfter = (s: string, c: string) => s.slice(s.indexOf(c) + 1);

const diff = (actualList: string[], needList: string[]): string[] =>
  actualList.reduce((list, s, i) => {
    const need = needList[i];
    if (s !== need) {
      list.push(
        `${s}≠${
          need && need.indexOf(":") >= 0 ? substringAfter(need, ":") : need
        }`
      );
    }
    return list;
  }, [] as string[]);

describe("ComplexCases", () => {
  it("Pyrrole", () => {
    const expr = compile(
      '-_pp_pN<_(y.5,Tv)H>_p_pp; $L(.45)#H|"1"; #3\\0"2"; #2/0"3"; #1`\\0"4"; #6`/0"5"'
    );
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(
      agent.bonds.map((it) => `${it.linearText()}${it.soft ? "*" : ""}`)
    ).toEqual([
      "-",
      "_pp",
      "_p",
      "v",
      "_p",
      "_pp",
      "|",
      "\\0",
      "/0",
      "`\\0",
      "`/0",
    ]);
    const node0 = agent.nodes[0];
    expect(
      new Set(Array.from(node0!.bonds).map((it) => it.linearText()))
    ).toEqual(new Set(["_pp", "-", "`\\0"]));
    expect(
      agent.nodes.map((it) => makeTextFormula(nodeCvt(it), rulesCharChem))
    ).toEqual([
      "CH",
      "CH",
      "CH",
      "N",
      "H",
      "CH",
      '"1"',
      '"2"',
      '"3"',
      '"4"',
      '"5"',
    ]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("C4H5N");
  });
  it("AdenosineTriphosphate", () => {
    //                                 H2N 27
    //                                   |26
    //                          25 N \21/ \\
    //   3 O   7 O   11O        24//  ||   N 28
    //     || 4  || 8  || 12 13   \   ||   |
    // HO--P--O--P--O--P--O--+ 20  N /22\N//29
    //  0  |1    |5    |9    | /O\ |23
    //     OH    OH    OH   14\ _ / 19:a
    //     2     6     10    15| |17
    //                     16 HO OH 18
    const expr = compile(
      "HO-P|OH; O||#-3-O-P|OH;O||#-3-O-P|OH;O||#-3-O-|_(x1,y1,W+,TW+)<|HO>_(x1,T-)<|OH>_(x1,y-1,W-,TW-):a_(x-1.5,y-0.7,T<)O_(x-1.5,y0.7,T<<);||_pN<|#a>_p_ppN_p/<`|H2N>\\\\N|`//N`\\"
    );
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const needBonds = [
      "0-1",
      "1|2",
      "3||1",
      "1-4",
      "4-5",
      "5|6",
      "7||5",
      "5-8",
      "8-9",
      "9|10",
      "11||9",
      "9-12",
      "12-13",
      "13|14",
      "14W+15",
      "15|16",
      "15-17",
      "17|18",
      "17W-19",
      "19<20",
      "20<<14",
      "21||22",
      "22_p23",
      "23|19",
      "23_p24",
      "24_pp25",
      "25_p21",
      "21/26",
      "26`|27",
      "26\\\\28",
      "28|29",
      "29`//30",
      "30`\\22",
    ];

    const bondTxt = (bond: ChemBond): string =>
      `${bond.nodes[0]?.index}${bond.linearText()}${bond.nodes[1]?.index}`;
    const realBonds = Array.from(agent.bonds).map((it) => bondTxt(it));
    expect(
      realBonds.reduce((acc, s, index) => {
        const need = needBonds[index];
        if (s !== need) acc.push(`${s}≠${need}`);
        return acc;
      }, [] as string[])
    ).toEqual([]);
    const needNodes = [
      "0:HO",
      "1:P",
      "2:OH",
      "3:O",
      "4:O",
      "5:P",
      "6:OH",
      "7:O",
      "8:O",
      "9:P",
      "10:OH",
      "11:O",
      "12:O",
      "13:CH2",
      "14:CH",
      "15:CH",
      "16:HO",
      "17:CH",
      "18:OH",
      "19:CH",
      "20:O",
      "21:C",
      "22:C",
      "23:N",
      "24:CH",
      "25:N",
      "26:C",
      "27:H2N",
      "28:N",
      "29:CH",
      "30:N",
    ];
    const realNodes = agent.nodes.map(
      (it) => `${it.index}:${makeTextFormula(nodeCvt(it), rulesCharChem)}`
    );
    expect(
      realNodes.reduce((acc, s, index) => {
        if (needNodes[index] !== s)
          acc.push(`${s}≠${substringAfter(needNodes[index]!, ":")}`);
        return acc;
      }, [] as string[])
    ).toEqual([]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("C10H16N5O13P3");
  });
  it("BetaCyfluthrin", () => {
    const expr = compile(
      "$slope(45)Cl-C<`|Cl>\\\\CH\\|<|CH3><`/H3C>_q3_q3; $slope()#-1-C<//O>\\O-C<`|H><|C%N>-\\\\-//<-F>`\\`-`/;#-1-/O-\\\\-//`\\`=`/"
    );
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    //    Cl 2
    // 0  |
    // Cl-C 1                        29===28
    //     \\                         /   \
    //      CH 3   O 10        23O---24    27
    //       \4   //            /    \\   //
    //       | \8-C 9 H 13 22===     25---26
    //       |5/   \  |12   / 21\
    //    7/ |   11 O-C---- 16    ---F 20
    //  H3C  CH3 6    |    \\   //19
    //             14 C%N  17---18
    //                  15
    const needBonds = [
      "0:0(~0)1",
      "1:1(-90)2",
      "2:1(45*2)3",
      "3:3(45)4",
      "4:4(90)5",
      "5:5(90)6",
      "6:5(135)7",
      "7:5(-30)8",
      "8:8(-150)4",
      "9:8(0)9",
      "10:9(-60*2)10",
      "11:9(60)11",
      "12:11(~0)12",
      "13:12(-90)13",
      "14:12(90)14",
      "15:14(~0*3)15",
      "16:12(0)16",
      "17:16(60*2)17",
      "18:17(0)18",
      "19:18(-60*2)19",
      "20:19(0)20",
      "21:19(-120)21",
      "22:21(180*2)22",
      "23:22(120)16",
      "24:21(-60)23",
      "25:23(0)24",
      "26:24(60*2)25",
      "27:25(0)26",
      "28:26(-60*2)27",
      "29:27(-120)28",
      "30:28(180*2)29",
      "31:29(120)24",
    ];
    expect(diff(makeBondsInfo(expr), needBonds)).toEqual([]);
    const actualNodes = agent.nodes.map(
      (it) => `${it.index}:${makeTextFormula(nodeCvt(it), rulesCharChem)}`
    );
    const needNodes = [
      "0:Cl",
      "1:C",
      "2:Cl",
      "3:CH",
      "4:CH",
      "5:C",
      "6:CH3",
      "7:H3C",
      "8:CH",
      "9:C",
      "10:O",
      "11:O",
      "12:C",
      "13:H",
      "14:C",
      "15:N",
      "16:C",
      "17:CH",
      "18:CH",
      "19:C",
      "20:F",
      "21:C",
      "22:CH",
      "23:O",
      "24:C",
      "25:CH",
      "26:CH",
      "27:CH",
      "28:CH",
      "29:CH",
    ];
    expect(diff(actualNodes, needNodes)).toEqual([]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("C22H18Cl2FNO3");
  });
  it("Clothianidin", () => {
    //    O2N 5
    //       \
    //        N 4
    //        ||
    //        C         14 S     Cl 13
    //       /3\         /   \12/
    // H3C--N   N--H2C---9    ||
    //   0  |1  |6   8   \\   N
    //      H 2 H 7       10 / 11
    const expr = compile(
      "H3C-N<|H>/C<`||N`\\O2`N>\\N<|H>-H2C-_(A54,N2)_qN`||</Cl>_qS_q"
    );
    expect(expr.getMessage()).toBe("");
    const needBonds = [
      "0:0(~0)1",
      "1:1(90)2",
      "2:1(-60)3",
      "3:3(-90*2)4",
      "4:4(-150)5",
      "5:3(60)6",
      "6:6(90)7",
      "7:6(~0)8",
      "8:8(0)9",
      "9:9(54*2)10",
      "10:10(-18)11",
      "11:11(-90*2)12",
      "12:12(-30)13",
      "13:12(-162)14",
      "14:14(126)9",
    ];
    expect(diff(makeBondsInfo(expr), needBonds)).toEqual([]);
    const needNodes = [
      "0:H3C",
      "1:N",
      "2:H",
      "3:C",
      "4:N",
      "5:O2N",
      "6:N",
      "7:H",
      "8:H2C",
      "9:C",
      "10:CH",
      "11:N",
      "12:C",
      "13:Cl",
      "14:S",
    ];
    expect(diff(makeNodesText(expr), needNodes)).toEqual([]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("C6H8ClN5O2S");
  });
  it("Carbofuran", () => {
    //   5
    // 6/\\0/4    14
    // ||  |  3\ /
    // 7\//1\O / \
    //  8|   2    15
    //   O   O 11
    //  9 \ //
    //  10 |
    //    HN 12
    //      \ 13
    const expr = compile(
      "|_qO_q:a_q_q`\\\\`/||\\/`/|O\\/O`/|HN\\;$slope(45)`/#a\\"
    );
    expect(expr.getMessage()).toBe("");
    const needBonds = [
      "0:0(90)1",
      "1:1(18)2",
      "2:2(-54)3",
      "3:3(-126)4",
      "4:4(162)0",
      "5:0(-150*2)5",
      "6:5(150)6",
      "7:6(90*2)7",
      "8:7(30)8",
      "9:8(-30*2)1",
      "10:8(90)9",
      "11:9(30)10",
      "12:10(-30*2)11",
      "13:10(90)12",
      "14:12(30)13",
      "15:14(135)3",
      "16:3(45)15",
    ];
    expect(diff(makeBondsInfo(expr), needBonds)).toEqual([]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("C12H15NO3");
  });
  it("TrilonB", () => {
    //                   O 14
    //                  ||
    // 2 O   O-0    12 /13\
    //    \\/         |    OH 15
    //     |1    9    N         16
    //    3 \   / \  /11\ 17  [Na+]2
    //      4 N    10    |18
    // 8 HO   |         /\\
    //     \ / 5    20 O- O 19
    //      6
    //      ||
    //      O 7
    const expr = compile(
      "O^-`/`\\O\\|\\N|`/|O`|`\\HO;#N/\\/N<`|/`|O|\\OH_(x1,y1,N0,TSpace)[Na^+]2>\\|\\O`\\`/O^-"
    );
    expect(expr.getMessage()).toBe("");
    const needNodes = [
      "0:O^-",
      "1:C",
      "2:O",
      "3:CH2",
      "4:N",
      "5:CH2",
      "6:C",
      "7:O",
      "8:HO",
      "9:CH2",
      "10:CH2",
      "11:N",
      "12:CH2",
      "13:C",
      "14:O",
      "15:OH",
      "16:Na^+",
      "17:CH2",
      "18:C",
      "19:O",
      "20:O^-",
    ];
    expect(diff(makeNodesText(expr), needNodes)).toEqual([]);
    const needBonds = [
      "0:0(150)1",
      "1:1(-150*2)2",
      "2:1(90)3",
      "3:3(30)4",
      "4:4(90)5",
      "5:5(150)6",
      "6:6(90*2)7",
      "7:6(-150)8",
      "8:4(-30)9",
      "9:9(30)10",
      "10:10(-30)11",
      "11:11(-90)12",
      "12:12(-30)13",
      "13:13(-90*2)14",
      "14:13(30)15",
      "15:15(45*0)16",
      "16:11(30)17",
      "17:17(90)18",
      "18:18(30*2)19",
      "19:18(150)20",
    ];
    expect(diff(makeBondsInfo(expr), needBonds)).toEqual([]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("C10H14N2Na2O8");
  });
  it("Anthracene", () => {
    //   13   6   1
    // 12/ \7/ \0/ \ 2
    //  |   |   |   |
    // 11\ /8\ /5\ / 3
    //   10   9   4
    const expr = compile("/\\|`/`\\`|_o`\\`/|\\/_o;#-2`/`\\`|/\\|0_o");
    expect(expr.getMessage()).toBe("");
    const needBonds = [
      "0:0(-30)1",
      "1:1(30)2",
      "2:2(90)3",
      "3:3(150)4",
      "4:4(-150)5",
      "5:5(-90)0",
      "6:o[0, 1, 2, 3, 4, 5]",
      "7:0(-150)6",
      "8:6(150)7",
      "9:7(90)8",
      "10:8(30)9",
      "11:9(-30)5",
      "12:o[5, 0, 6, 7, 8, 9]",
      "13:8(150)10",
      "14:10(-150)11",
      "15:11(-90)12",
      "16:12(-30)13",
      "17:13(30)7",
      "18:o[8, 10, 11, 12, 13, 7]",
    ];
    expect(diff(makeBondsInfo(expr), needBonds)).toEqual([]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("C14H10");
  });
  it("Isobacteriochlorin", () => {
    // _(a54,N)
    const expr = compile(
      "|_q:a2_qN_qq<_(a54):a>_q; `-_q<_(a54,N2)#a>_qN_qq<_(a54,N):b>_q; `||_q<_(a54,N2)#b>_qN<`-H>_q<_(a54,N2):c>_q; -_qq<_(a54)#c>_qN<`|H>_q<_(a54)=#a2>_qq"
    );
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(makeBrutto(expr))).toBe("C20H18N4");
  });
  it("MalonicAcid", () => {
    //       OH 0
    //      /
    // O=== 1      O 5
    // 2    \    //
    //       3---4
    //            \
    //             OH 6
    // Bond #1 is result of merge of two pseudo-soft bond descriptions
    const expr = compile("OH`/`-O-\\-<//O>\\OH");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const node0 = agent.nodes[0]!;
    // all nodes in same chain
    expect(
      agent.nodes.filter((it) => it.chain !== node0.chain).map((it) => it.index)
    ).toEqual([]);
    // all nodes in same sub chain
    expect(
      agent.nodes
        .filter((it) => it.subChain !== node0.subChain)
        .map((it) => it.index)
    ).toEqual([]);
    const needNodes = ["0:OH", "1:C", "2:O", "3:CH2", "4:C", "5:O", "6:OH"];
    expect(diff(makeNodesText(expr), needNodes)).toEqual([]);
    const needBonds = [
      "0:0(120)1",
      "1:1(180*2)2",
      "2:1(60)3",
      "3:3(0)4",
      "4:4(-60*2)5",
      "5:4(60)6",
    ];
    expect(diff(makeBondsInfo(expr), needBonds)).toEqual([]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("C3H4O4");
  });
  it("Pulegone", () => {
    // Merge bonds after bracket declaration
    //            O 4  6 7
    //            ||   C(CH3)2
    //          2/3 \5//
    //          |    |
    //      0  /1\  /8
    //      H3C    9
    const expr = compile("H3C/`|/`|O|\\/C<(CH3)2>`/|`/`\\");
    expect(expr.getMessage()).toBe("");
    const needBonds = [
      "0:0(-30)1",
      "1:1(-90)2",
      "2:2(-30)3",
      "3:3(-90*2)4",
      "4:3(30)5",
      "5:5(-30*2)6",
      "6:5(90)8",
      "7:8(150)9",
      "8:9(-150)1",
    ];
    expect(diff(makeBondsInfo(expr), needBonds)).toEqual([]);
    const needNodes = [
      "0:H3C",
      "1:CH",
      "2:CH2",
      "3:C",
      "4:O",
      "5:C",
      "6:C",
      "7:CH3",
      "8:CH2",
      "9:CH2",
    ];
    expect(diff(makeNodesText(expr), needNodes)).toEqual([]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("C10H16O");
  });
  it("HydrogenHexachlororhenateIV", () => {
    const expr = compile(
      "$ver(1.0)[Re^4+$slope(60)$L(1.4)<--hCl^-></hCl^-><`\\hCl`^-><`-hCl`^-><`/hCl`^-><\\hCl^->]^2-; H^+_(x%w:3,y.5,N0)#Re; H^+_(x%w:3,y-.5,N0)#Re"
    );
    expect(expr.getMessage()).toBe("");
    const needNodes = [
      "0:Re^4+",
      "1:Cl^-",
      "2:Cl^-",
      "3:Cl^-",
      "4:Cl^-",
      "5:Cl^-",
      "6:Cl^-",
      "7:H^+",
      "8:H^+",
    ];
    expect(diff(makeNodesText(expr), needNodes)).toEqual([]);
    expect(calcCharge(expr)).toBe(0.0);
    expect(makeTextFormula(makeBrutto(expr))).toBe("H2Cl6Re");
  });
  it("DihexacyanoferrateII", () => {
    const expr = compile(
      "$ver(1.0)[Fe^2+@:b(a,c)<_(A&a,L1.3,H)C&c^-_(a0,N3)N>@(-90)@b(-30,`)@b(30)@b(90)@b(150,`)@b(-150)]<_(x%w:-4,N0,y-%h:.8)K^+><_(x%w,y%h,N0)Fe^3+>"
    );
    expect(expr.getMessage()).toBe("");
    const needNodes = [
      "0:Fe^2+",
      "1:C^-",
      "2:N",
      "3:C^-",
      "4:N",
      "5:C^-",
      "6:N",
      "7:C^-",
      "8:N",
      "9:C^-",
      "10:N",
      "11:C^-",
      "12:N",
      "13:K^+",
      "14:Fe^3+",
    ];
    expect(diff(makeNodesText(expr), needNodes)).toEqual([]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("C6Fe2KN6");
  });
  it("5837", () => {
    const expr = compile(
      "`\\`-_(a54)_q_p6_pp6_p6_pp6_p6_p6_qHN_q_qq; #1-<\\\\O>/N_(a54)<_q_q_q_q>_(a54,w+)<_pp6O>_q6N<_(y-.5)H>_(a60,d-)<_p6_q6_p6<_pp6O>_q6OH>_q6<_pp6O>_q6HN_p6<_(a60,d+)>_q6<_qq6O>_p6NH_(a-60,d-)<_p6_p6<_p6NH2>_qq6O>_q6<_qq6O>_p6NH_(a-60,w-)<_q6_q6_p6_q6_p6H2N>_p6<_qq6O>_p6NH_(a-60,w-)<_q6<_q6>_p6>_p6<_pp6O>_q6HN_p6_q6<_qq6O>_p6NH2; #1`/wHN\\<=O>`/<\\-_(a54)_qNH_q_qN<_(y-.5)H>_q>`-dHN`/<\\\\O>`-<`\\/<=O>`\\HO>`/wNH`-<`\\\\O>`/<\\`/\\`/\\NH2>`-dHN`/<\\\\O>`-<`\\/<=O>`\\H2N>`/wNH`-<`\\\\O>_(a-60,d-)_(a54)N<_q_q_q_q>_(a54)<_pp6O>_q6<_p6_p6<_qq6O>_p6NH2>_(a-60,w+)NH_p6<_pp6O>_q6<_p6_p6_pp6_q6_qq6_q6_qq6_q6>_(a-60,w+)NH_p6<_pp6O>_q6<_q6_(a-50)<_pp6O>_q6OH>_(a60,d+)HN_q6<_qq6O>_p6<_p6_p6_(a54,N2)_qN<_(y-.5)H>_q_qq<_q>_p6_pp6_p6_pp6_p6>_(a-60,w+)NH_p6<_pp6O>_q6<_p6_p6<_pp6O>_q6HO>_(a-60,w+)N<_(y-.5)H>_p6:a_pp6O; `-_q<_(a54,d+)#a>_qN<_q_q>|`/O/\\</\\|O`|/NH2>|dN<_(y.5)H>`/`\\O\\|<\\/`|O|\\NH2>`/dHN|\\O`\\`/<`\\`|HO>|wN<_(y.5)H>`/`\\O\\|<\\/`|O|\\NH2>`/dHN|\\O`\\`/<`\\w>|NH`/`\\O\\|`/HN|\\O`\\`/<`\\`|/`||`\\`//|\\\\>|wNH`/`\\O\\|<\\d>`/HN|\\O`\\_(a-60,w-)_(a54)_q_q_qN<_q>_(a54)<_qq6O>_p6<_p6_q6<_pp6O>_q6OH>_(a-60,w+)N<_(y.5)H>_q6<_qq6O>_p6<_p6_p6<_p6>_q6>_(a-60,w+)N<_(y-.5)H>_p6<_pp6O>_q6<_q6_p6_q6<_qq6O>_p6NH2>_(a60,d+)N<_(y-.5)H>_q6<_qq6O>_p6<_p6_p6_(a54)N<_(y.5)H>_q_qHN_q_q>_(a-60,w+)N<_(y-.5)H>_p6<_pp6O>_q6<_p6_p6<_pp6O>_q6OH>_(a-60,w+)HN_p6<_pp6O>_(a-60,d-)_(a54)N<_q_q_q_q>\\|O`|/<_(y-1.6)/\\//`|`\\\\`/||>\\dN<_(y.5)H>/`|O|\\<|`/`\\`//|\\\\/`||>/wN<_(y-.5)H>\\|O`|/\\N<_(y.5)H>/`|O|\\</`|<`\\>/>|dHN\\<//O>_(a60,d-)_(a54)N<_q_q_q_q>_(a54)<_pp6O>_q6<_p6_p6<_qq6O>_p6N_(y.5)H2>_(a-60,w+)NH_p6<_pp6O>_(a-60,w-)_(a54)_q_q_qN<_q>/`|O|\\<|<`/>\\>/wN<_(y-.5)H>\\|O`|/<`|d`\\HO>\\N<_(y.5)H>/`|O|\\<|w`/<_p7>_q6>/N<_(y.5)H>\\|O`|/<`|d`\\`|O|`/H2N>\\N<_(y.5)H>/`|O|\\<|<\\dOH>`/>/wN<_(y-.5)H>\\|O`|/\\N<_(y.5)H>/`|O|\\/\\/\\/\\/\\/\\/\\"
    );
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(makeBrutto(expr))).toBe("C248H363N65O72");
  });
});
