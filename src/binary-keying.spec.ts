import Chance from "chance";
import {TreeMap} from "./tree-map";
import { expect } from "chai";
import {BinaryKeyExtractor} from "./binary-keying";
import {createHash} from 'crypto';
import {BufferKeyExtractor} from "./buffer-keying";

describe('Binary Key Extractor', () => {

    const chance = Chance();

    it('', () => {

        const map = new TreeMap(new BinaryKeyExtractor<string>(
            key => key.length,
            20,
            key => createHash('sha1').update(key).digest(),
            (a, b) => a === b
        ));

        const putKeys = chance.n(
            () => chance.string({
                length: chance.integer({min: 4, max: 100}),
                alpha: true,
                numeric: true,
                symbols: true
            }), 100
        );

        const removeKeys = chance.pickset(
            putKeys, 50
        );

        for (const putKey of putKeys) {
            map.put(putKey, putKey);
        }

        for (const putKey of putKeys) {
            expect(map.get(putKey)).eq(putKey, 'Put not working');
        }

        for (const removeKey of removeKeys) {
            expect(map.remove(removeKey)).oneOf([removeKey, undefined], 'Remove not working');
        }

        for (const removeKey of removeKeys) {
            expect(map.get(removeKey)).eq(undefined, 'Remove not working');
        }

    });

    it('should perform better than native object mapping', () => {

        const map = new TreeMap(new BufferKeyExtractor(
            32,
            [2, 4, 8]
        ));

        const putKeys = chance.n(
            () => chance.string({
                length: 32,
                alpha: true,
                numeric: true,
                symbols: true
            }), 10000
        );

        const removeKeys = chance.pickset(
            putKeys, /*putKeys.length / 2*/ 0
        );

        const actions = chance.shuffle(
            [...putKeys.map(key => ['put', key] as const), ...removeKeys.map(key => ['remove', key] as const)]
        );

        let start = Date.now();

        for (const [action, key] of actions) {
            if (action === 'put') {
                map.put(key + '?', key);
            } else {
                map.remove(key + '?');
            }
        }
        for (const [, key] of actions) {
            (map.get(key + '?') as string | undefined)?.length;
        }

        const treeMapDuration = Date.now() - start;

        const objectMap = {};

        start = Date.now();

        for (const [action, key] of actions) {
            if (action === 'put') {
                objectMap[key + '?'] = key;
            } else {
                delete objectMap[key + '?'];
            }
        }
        for (const [, key] of actions) {
            objectMap[key + '?']?.length;
        }

        const objectMapDuration = Date.now() - start;

        // COMPARE

        expect(treeMapDuration).lessThan(objectMapDuration, 'TreeMap must be better than Object');

    });

});
