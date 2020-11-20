import {BufferKeyExtractor} from "./buffer-keying";
import {TransformKeyExtractor} from "./transform-keying";
import {KeyExtractor} from "./key-extractor";

export class HashKeyExtractor<KEY> extends TransformKeyExtractor<KEY, Buffer, Buffer> {
    constructor(
        hashLength: number,
        hash: (key: KEY) => Buffer
    ) {
        super(
            hash,
            new BufferKeyExtractor(
                hashLength,
                hashLength >= 32 ? [2, 2, 2] : (
                    hashLength >= 8 ? [2, 2] : [2]
                )
            ) as KeyExtractor<Buffer, Buffer>
        );
    }
}
