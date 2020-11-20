import Chance from "chance";
import {TreeMap} from "./tree-map";
import {SimpleKeyExtractor} from "./simple-keying";
import { expect } from "chai";

describe('Simple Key Extractor', () => {

    const chance = Chance();

    it('', () => {

        const map = new TreeMap(new SimpleKeyExtractor());

        const putKeys = chance.n(
            () => chance.integer({
                min: 0,
                max: 50
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
            expect(map.remove(removeKey)).oneOf([undefined, removeKey], 'Remove not working');
        }

        for (const removeKey of removeKeys) {
            expect(map.get(removeKey)).eq(undefined, 'Remove not working');
        }

    });

});
