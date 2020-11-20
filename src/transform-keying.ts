import {KeyExtractor} from "./key-extractor";
import {TreeKey} from "./tree-key";

export class TransformKeyExtractor<KEY, MIDDLE_KEY, KEY_PART> implements KeyExtractor<KEY, KEY_PART> {
    constructor(
        readonly transformer: (a: KEY) => MIDDLE_KEY,
        readonly keyExtractor: KeyExtractor<MIDDLE_KEY, KEY_PART>
    ) {
    }

    extractKey(key: KEY): TreeKey<KEY_PART> {
        return this.keyExtractor.extractKey(
            this.transformer(key)
        )
    }
}
