import {CompositeKeyExtractor} from "./composite-keying";
import {TransformKeyExtractor} from "./transform-keying";
import {SimpleKeyExtractor} from "./simple-keying";
import {HashKeyExtractor} from "./hash-keying";

export class BinaryKeyExtractor<KEY> extends CompositeKeyExtractor<KEY, number | Buffer, KEY> {
    constructor(
        length: (key: KEY) => number,
        hashLength: number,
        hash: (key: KEY) => Buffer,
        matcher: (a: KEY, b: KEY) => boolean
    ) {
        super(
            new CompositeKeyExtractor<KEY, number, Buffer>(
                new TransformKeyExtractor<KEY, number, number>(
                    a => length(a) % 64,
                    new SimpleKeyExtractor<number>()
                ),
                new HashKeyExtractor<KEY>(
                    hashLength,
                    hash
                )
            ),
            new SimpleKeyExtractor<KEY>(
                matcher
            )
        );
    }
}
