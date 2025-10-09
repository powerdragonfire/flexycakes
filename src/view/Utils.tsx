import * as React from "react";
import { Node } from "../model/Node";
import { TabNode } from "../model/TabNode";
import { LayoutInternal } from "./Layout";
import { TabSetNode } from "../model/TabSetNode";

/** @internal */
export function isDesktop() {
    const desktop = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    return desktop;
}
/** @internal */
const tabRenderCache: WeakMap<TabNode, { key: string; base: { leading: React.ReactNode; content: React.ReactNode; name: string; buttons: any[] } }> = new WeakMap();

export function getRenderStateEx(
    layout: LayoutInternal,
    node: TabNode,
    iconAngle?: number
) {
    const name = node.getName();
    const icon = node.getIcon();
    const angle = iconAngle ?? 0;
    const onRenderRef = (layout as any).props?.onRenderTab; // function identity
    const cacheKey = `${name}|${icon ?? ''}|${angle}|${onRenderRef ? onRenderRef : 'no'}`;

    let cached = tabRenderCache.get(node);
    if (!cached || cached.key !== cacheKey) {
        // base leading/content
        let leadingContent: React.ReactNode | undefined;
        const titleContent: React.ReactNode = name;
        if (icon !== undefined) {
            if (angle !== 0) {
                leadingContent = <img style={{ width: "1em", height: "1em", transform: "rotate(" + angle + "deg)" }} src={icon} alt="leadingContent" />;
            } else {
                leadingContent = <img style={{ width: "1em", height: "1em" }} src={icon} alt="leadingContent" />;
            }
        }

        const buttons: any[] = [];
        const baseState = { leading: leadingContent, content: titleContent, name, buttons };
        // allow customization of leading contents (icon) and contents
        layout.customizeTab(node, baseState);
        // cache the base, but never reuse the buttons array instance directly
        cached = { key: cacheKey, base: { ...baseState, buttons: [...baseState.buttons] } };
        tabRenderCache.set(node, cached);
        node.setRenderedName(baseState.name);
    }

    // Return a fresh object each render so callers can safely push more buttons
    return { leading: cached.base.leading, content: cached.base.content, name: cached.base.name, buttons: [...cached.base.buttons] };
}

/** @internal */
export function isAuxMouseEvent(event: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement>) {
    let auxEvent = false;
    if (event.nativeEvent instanceof MouseEvent) {
        if (event.nativeEvent.button !== 0 || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
            auxEvent = true;
        }
    }
    return auxEvent;
}

export function enablePointerOnIFrames(enable: boolean, currentDocument: Document) {
    const iframes = [
        ...getElementsByTagName('iframe', currentDocument),
        ...getElementsByTagName('webview', currentDocument),
    ];

    for (const iframe of iframes) {
        (iframe as HTMLElement).style.pointerEvents = enable ? 'auto' : 'none';
    }
};

export function getElementsByTagName(tag: string, currentDocument: Document): Element[] {
    return [...currentDocument.getElementsByTagName(tag)];
}

export function startDrag(
    doc: Document,
    event: React.PointerEvent<HTMLElement>,
    drag: (x: number, y: number) => void,
    dragEnd: () => void,
    dragCancel: () => void) {

    event.preventDefault();

    const pointerMove = (ev: PointerEvent) => {
        ev.preventDefault();
        drag(ev.clientX, ev.clientY);
    };

    const pointerCancel = (ev: PointerEvent) => {
        ev.preventDefault();
        dragCancel();
    };
    const pointerUp = () => {
        doc.removeEventListener("pointermove", pointerMove);
        doc.removeEventListener("pointerup", pointerUp);
        doc.removeEventListener("pointercancel", pointerCancel);
        dragEnd();
    };

    doc.addEventListener("pointermove", pointerMove);
    doc.addEventListener("pointerup", pointerUp);
    doc.addEventListener('pointercancel', pointerCancel);
}

export function canDockToWindow(node: Node) {
    if (node instanceof TabNode) {
        return node.isEnablePopout();
    } else if (node instanceof TabSetNode) {
        for (const child of node.getChildren()) {
            if ((child as TabNode).isEnablePopout() === false) {
                return false;
            }
        }
        return true;
    }
    return false;
}

export function copyInlineStyles(source: HTMLElement, target: HTMLElement): boolean {
    // Get the inline style attribute from the source element
    const sourceStyle = source.getAttribute('style');
    const targetStyle = target.getAttribute('style');
    if (sourceStyle === targetStyle) return false;

    // console.log("copyInlineStyles", sourceStyle);
    
    if (sourceStyle) {
        // Set the style attribute on the target element
        target.setAttribute('style', sourceStyle);
    } else {
        // If the source has no inline style, clear the target's style attribute
        target.removeAttribute('style');
    }
    return true;
}

export function isSafari() {
    const userAgent = navigator.userAgent;
    return userAgent.includes("Safari") && !userAgent.includes("Chrome") && !userAgent.includes("Chromium");
  }
