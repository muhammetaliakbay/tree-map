import {KeyExtractor} from "./key-extractor";
import {TreeKey} from "./tree-key";

class SimpleTreeKey<KEY> implements TreeKey<KEY> {
    constructor(
        readonly key: KEY,
        readonly matcher: (a: KEY, b: KEY) => boolean = (a, b) => a === b
    ) {
    }

    partCount = 1;

    getPart(index: number): KEY {
        return this.key;
    }

    matchParts(index: number, a: KEY, b: KEY): boolean {
        return this.matcher(a, b);
    }
}

export class SimpleKeyExtractor<KEY> implements KeyExtractor<KEY, KEY> {
    constructor(
        readonly matcher: (a: KEY, b: KEY) => boolean = (a, b) => a === b
    ) {
    }

    extractKey(key: KEY): TreeKey<KEY> {
        return new SimpleTreeKey(key, this.matcher);
    }
}
