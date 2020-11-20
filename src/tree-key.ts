export interface TreeKey<KEY_PART> {
    readonly partCount: number;
    getPart(index: number): KEY_PART;
    matchParts(index: number, a: KEY_PART, b: KEY_PART): boolean;
}
