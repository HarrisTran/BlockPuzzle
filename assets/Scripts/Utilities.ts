
import { _decorator, Node, ParticleSystem, UITransform, Vec2, Vec3 } from 'cc';
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

export function delay(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay * 1000));
}

export function randomInList<T>(list: T[]) {
    if (list.length === 1) return list[0];
    return list[Math.floor(Math.random() * list.length)];
}


export function bezierTangent(p0: Vec3, p1: Vec3, p2: Vec3, t: number) {
    let p: Vec3 = new Vec3(0);
    p.x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    p.y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
    return p;
}

export function randomControlPoints(p0: Vec3, p1: Vec3, range: number): Vec3 {
    let midPoint = new Vec3(p0.x + (p1.x - p0.x) / 3, p0.y + (p1.y - p0.y) / 3, 0);
    let randomX = Math.random() * 2 * range - range;
    let randomY = Math.random() * 2 * range - range;
    return midPoint.add(new Vec3(randomX, randomY, 0));
}