import {TreeKey} from "./tree-key";

export interface KeyExtractor<KEY, KEY_PART> {
    extractKey(key: KEY): TreeKey<KEY_PART>;
}
