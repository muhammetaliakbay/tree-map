import Chance from "chance";
import {TreeMap} from "./tree-map";
import { expect } from "chai";
import {randomBytes} from "crypto";
import {BufferKeyExtractor} from "./buffer-keying";

describe('Buffer Key Extractor', () => {

    const chance = Chance();

    it('', () => {

        const map = new TreeMap(new BufferKeyExtractor(32, [2, 4, 8]));

        const putKeys = chance.n(
            () => randomBytes(32), 100
        );

        const removeKeys = chance.pickset(
            putKeys, 50
        );

        for (const putKey of putKeys) {
            map.put(putKey, putKey);
        }

        for (const putKey of putKeys) {
            expect(map.get(putKey)).satisfy(putKey.equals.bind(putKey), 'Put not working');
        }

        for (const removeKey of removeKeys) {
            map.remove(removeKey);
        }

        for (const removeKey of removeKeys) {
            expect(map.get(removeKey)).eq(undefined, 'Remove not working');
        }

    });

});
