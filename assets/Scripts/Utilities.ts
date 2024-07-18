
import { _decorator, Node, UITransform, Vec2, Vec3 } from 'cc';
export class Bound {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;

    public constructor(xMin: number, xMax: number, yMin: number, yMax: number) {
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;
    }


}

export function mergeBounds(...args: Bound[]): Bound {
    if (!args || args.length === 0) {
        return null;
    }

    let result = new Bound(args[0].xMin, args[0].xMax, args[0].yMin, args[0].yMax);
    for (let bound of args) {
        result.xMin = Math.min(result.xMin, bound.xMin);
        result.xMax = Math.max(result.xMax, bound.xMax);
        result.yMin = Math.min(result.yMin, bound.yMin);
        result.yMax = Math.max(result.yMax, bound.yMax);
    }

    return result;
}

export function getWorldBound(node: Node): Bound {
    let uiTransform = node.getComponent(UITransform);

    if (uiTransform) {
        let bound = new Bound(
            node.worldPosition.x - uiTransform.contentSize.width / 2,
            node.worldPosition.x + uiTransform.contentSize.width / 2,
            node.worldPosition.y - uiTransform.contentSize.height / 2,
            node.worldPosition.y + uiTransform.contentSize.height / 2);
        return bound;
    }
    else {
        return new Bound(node.worldPosition.x, node.worldPosition.x, node.worldPosition.y, node.worldPosition.y);
    }
}

export function isVec2InBounds(position: Vec2, bound: Bound) {
    return isBetween(position.x, bound.xMin, bound.xMax) && isBetween(position.y, bound.yMin, bound.xMax);
}

export function isVec3InBounds(position: Vec3, bound: Bound) {
    return isBetween(position.x, bound.xMin, bound.xMax) && isBetween(position.y, bound.yMin, bound.xMax);
}

export function isBetween(value: number, bound1: number, bound2: number): boolean {
    return Math.min(bound1, bound2) <= value && value <= Math.max(bound1, bound2);
}