export const isSubStr = (text: string, pos: number, subStr: string): boolean => {
    for (let i = 0; i<subStr.length; i++) {
        if (text[pos+i] !== subStr[i]) return false;
    }
    return true;
}