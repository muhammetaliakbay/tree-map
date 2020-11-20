import {KeyExtractor} from "./key-extractor";
import {TreeKey} from "./tree-key";

class CompositeTreeKey<KEY, FIRST_KEY_PART, LAST_KEY_PART> implements TreeKey<FIRST_KEY_PART | LAST_KEY_PART> {
    readonly partCount: number;

    constructor(
        readonly firstKey: TreeKey<FIRST_KEY_PART>,
        readonly lastKey: TreeKey<LAST_KEY_PART>
    ) {
        this.partCount = firstKey.partCount + lastKey.partCount;
    }

    private normalize(index: number): [TreeKey<FIRST_KEY_PART | LAST_KEY_PART>, number] {
        if (index < this.firstKey.partCount) {
            return [this.firstKey, index];
        } else {
            return [this.lastKey, index - this.firstKey.partCount];
        }
    }

    matchParts(index: number, a: FIRST_KEY_PART | LAST_KEY_PART, b: FIRST_KEY_PART | LAST_KEY_PART): boolean {
        const [nKey, nIndex] = this.normalize(index);
        return nKey.matchParts(nIndex, a, b);
    }

    getPart(index: number): FIRST_KEY_PART | LAST_KEY_PART {
        const [nKey, nIndex] = this.normalize(index);
        return nKey.getPart(nIndex);
    }
}

export class CompositeKeyExtractor<KEY, FIRST_KEY_PART, LAST_KEY_PART>
    implements KeyExtractor<KEY, FIRST_KEY_PART | LAST_KEY_PART> {
    constructor(
        readonly firstKeying: KeyExtractor<KEY, FIRST_KEY_PART>,
        readonly lastKeying: KeyExtractor<KEY, LAST_KEY_PART>
    ) {
    }

    extractKey(key: KEY): TreeKey<FIRST_KEY_PART | LAST_KEY_PART> {
        return new CompositeTreeKey(this.firstKeying.extractKey(key), this.lastKeying.extractKey(key));
    }
}
