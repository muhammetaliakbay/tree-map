import {KeyExtractor} from "./key-extractor";
import {TreeKey} from "./tree-key";

export class BufferKeyExtractor implements KeyExtractor<Buffer | string, Buffer | string> {
    private partOffsets: number[] = [];
    private partEnds: number[] = [];
    private partCount: number;
    constructor(
        keyLength: number,
        partLengths: number[]
    ) {
        let offset = 0;
        for (const partLength of partLengths) {
            const end = offset + partLength;

            this.partOffsets.push(offset);
            this.partEnds.push(end);

            offset = end;
        }

        if (keyLength - offset > 0) {
            this.partOffsets.push(offset);
            this.partEnds.push(keyLength);
        }

        this.partCount = this.partOffsets.length;
    }

    extractKey(key: Buffer | string): TreeKey<Buffer | string> {
        return {
            partCount: this.partCount,
            getPart: this.keyPart.bind(this, key),
            matchParts(index: number, a: Buffer | string, b: Buffer | string): boolean {
                if (typeof a !== typeof b) {
                    return false;
                } else if (a instanceof Buffer) {
                    return a.equals(b as Buffer);
                } else {
                    return a === b;
                }
            }
        };
    }

    private keyPart(key: Buffer | string, index: number): Buffer | string | undefined {
        const offset = this.partOffsets[index];
        const end = this.partEnds[index];

        if (key instanceof Buffer) {
            return key.subarray(offset, end);
        } else {
            return key.substring(offset, end);
        }
    }
}
