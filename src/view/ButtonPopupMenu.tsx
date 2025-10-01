import * as React from "react";
import { CLASSES } from "../Types";
import { LayoutInternal } from "./Layout";
import { TabSetNode } from "../model/TabSetNode";
import { BorderNode } from "../model/BorderNode";
import { useEffect, useRef } from "react";

/** @internal */
export function showButtonPopup(
    triggerElement: Element,
    parentNode: TabSetNode | BorderNode,
    items: { index: number; button: React.ReactNode }[],
    layout: LayoutInternal,
) {
    const layoutDiv = layout.getRootDiv();
    const classNameMapper = layout.getClassName;
    const currentDocument = triggerElement.ownerDocument;
    const triggerRect = triggerElement.getBoundingClientRect();
    const layoutRect = layoutDiv?.getBoundingClientRect() ?? new DOMRect(0, 0, 100, 100);

    const elm = currentDocument.createElement("div");
    elm.className = classNameMapper(CLASSES.FLEXLAYOUT__POPUP_MENU_CONTAINER);
    if (triggerRect.left < layoutRect.left + layoutRect.width / 2) {
        elm.style.left = triggerRect.left - layoutRect.left + "px";
    } else {
        elm.style.right = layoutRect.right - triggerRect.right + "px";
    }

    if (triggerRect.top < layoutRect.top + layoutRect.height / 2) {
        elm.style.top = triggerRect.top - layoutRect.top + "px";
    } else {
        elm.style.bottom = layoutRect.bottom - triggerRect.bottom + "px";
    }

    layout.showOverlay(true);

    if (layoutDiv) {
        layoutDiv.appendChild(elm);
    }

    const onHide = () => {
        layout.hideControlInPortal();
        layout.showOverlay(false);
        if (layoutDiv) {
            layoutDiv.removeChild(elm);
        }
        elm.removeEventListener("pointerdown", onElementPointerDown);
        currentDocument.removeEventListener("pointerdown", onDocPointerDown);
    };

    const onElementPointerDown = (event: Event) => {
        event.stopPropagation();
    };

    const onDocPointerDown = (_event: Event) => {
        onHide();
    };

    elm.addEventListener("pointerdown", onElementPointerDown);
    currentDocument.addEventListener("pointerdown", onDocPointerDown);

    layout.showControlInPortal(<ButtonPopupMenu
        currentDocument={currentDocument}
        parentNode={parentNode}
        onHide={onHide}
        items={items}
        classNameMapper={classNameMapper}
        layout={layout}
    />, elm);
}

/** @internal */
interface IButtonPopupMenuProps {
    parentNode: TabSetNode | BorderNode;
    items: { index: number; button: React.ReactNode }[];
    currentDocument: Document;
    onHide: () => void;
    classNameMapper: (defaultClassName: string) => string;
    layout: LayoutInternal;
}

/** @internal */
const ButtonPopupMenu = (props: IButtonPopupMenuProps) => {
    const { items, onHide, classNameMapper } = props;
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Set focus when the component mounts
        if (divRef.current) {
            divRef.current.focus();
        }
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Escape") {
            onHide();
        }
    };

    const itemElements = items.map((item, i) => {
        const classes = classNameMapper(CLASSES.FLEXLAYOUT__POPUP_MENU_ITEM);
        return (
            <div key={i}
                className={classes}
                data-layout-path={"/button-popup-menu/item" + i}
                onClick={(e) => { e.stopPropagation(); onHide(); }}
            >
                {item.button}
            </div>
        );
    });

    return (
        <div className={classNameMapper(CLASSES.FLEXLAYOUT__POPUP_MENU)}
            ref={divRef}
            tabIndex={0}  // Make div focusable
            onKeyDown={handleKeyDown}
            data-layout-path="/button-popup-menu"
        >
            {itemElements}
        </div>);
};
