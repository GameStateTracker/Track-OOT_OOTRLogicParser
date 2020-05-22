
declare global {
    type JSONLogic = {
        type: string,
        el?: string | JSONLogic | JSONLogic[],
        value?: string | number,
        category?: string
    };
    type JSONLogicMap = { [index: string]: JSONLogic };
    type JSONLogicNodes = { [index: string]: JSONLogicMap };
}

export default interface AbstractLiteral {

    toJSON(): JSONLogic;

}