import {KeyExtractor} from "./key-extractor";
import {TreeKey} from "./tree-key";

interface TreeNode<KEY_PART, VALUE> {
    keyPart: KEY_PART;
    children: TreeNode<KEY_PART, VALUE>[];
    value: VALUE;
    parent: TreeNode<KEY_PART, VALUE>
}

export class TreeMap<KEY, KEY_PART, VALUE> {
    private root: TreeNode<KEY_PART, VALUE> = {
        keyPart: undefined,
        children: [],
        value: undefined,
        parent: undefined
    };

    constructor(
        protected keyExtractor: KeyExtractor<KEY, KEY_PART>
    ) {
    }

    private getTreeNode(key: TreeKey<KEY_PART>, fill: boolean | (() => boolean) = false) {
        let node = this.root;
        for (const {keyPart, index} of this.keyPartIterable(key)) {
            let childNode = node.children.find(
                ({keyPart: b}) => key.matchParts(index, keyPart, b)
            );

            if (childNode === undefined) {
                if (typeof fill === 'function') {
                    fill = fill();
                }

                if (fill) {
                    childNode = {
                        children: [],
                        value: undefined,
                        keyPart,
                        parent: node
                    };
                    node.children.push(childNode);
                } else {
                    return undefined;
                }
            }

            node = childNode;
        }
        return node;
    }

    put(key: KEY, value: VALUE): VALUE | undefined {
        if (value == null) {
            return this.remove(key);
        } else {
            const node = this.getTreeNode(this.keyExtractor.extractKey(key), true);
            const oldValue = node.value;
            node.value = value;
            return oldValue;
        }
    }

    private cleanUpside(node: TreeNode<KEY_PART, VALUE>) {
        if (node.parent != null && node.value == null && node.children.length === 0) {
            node.parent.children.splice(
                node.parent.children.indexOf(node), 1
            );

            this.cleanUpside(node.parent);
        }
    }

    remove(key: KEY): VALUE | undefined {
        const node = this.getTreeNode(this.keyExtractor.extractKey(key), false);
        const oldValue = node?.value;

        if (node != null) {
            node.value = undefined;
            this.cleanUpside(node);
        }

        return oldValue;
    }

    get(key: KEY): VALUE | undefined {
        const node = this.getTreeNode(this.keyExtractor.extractKey(key), false);
        return node?.value;
    }

    getOrPut(key: KEY, gen: () => VALUE): VALUE {
        let genValue: VALUE | undefined = undefined;
        const node = this.getTreeNode(
            this.keyExtractor.extractKey(key), () => {
                genValue = gen();
                return genValue != null;
            }
        );
        if (node == null) {
            return genValue;
        } else {
            return node.value ??= genValue;
        }
    }

    private keyPartIterator(key: TreeKey<KEY_PART>): Iterator<{keyPart: KEY_PART, index: number}> {
        let index = 0;
        return {
            next: () =>  {
                if (index < key.partCount) {
                    return {
                        done: false,
                        value: {
                            keyPart: key.getPart(index),
                            index: index ++
                        }
                    };
                } else {
                    return {
                        done: true,
                        value: undefined
                    };
                }
            }
        };
    }

    private keyPartIterable(key: TreeKey<KEY_PART>): Iterable<{keyPart: KEY_PART, index: number}> {
        return {
            [Symbol.iterator]: this.keyPartIterator.bind(this, key)
        };
    }
}
