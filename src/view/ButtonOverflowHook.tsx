import * as React from "react";

/** @internal */
export const useButtonOverflow = (
    buttonBarRef: React.RefObject<HTMLElement | null>,
    buttons: React.ReactNode[]
) => {
    const [hiddenButtons, setHiddenButtons] = React.useState<number[]>([]);
    const [isShowHiddenButtons, setShowHiddenButtons] = React.useState<boolean>(false);
    
    const updateTimerRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
    const hiddenButtonsRef = React.useRef<number[]>([]);
    hiddenButtonsRef.current = hiddenButtons;

    React.useLayoutEffect(() => {
        checkForOverflow();
    });

    const checkForOverflow = () => {
        if (updateTimerRef.current !== undefined) {
            return; // already scheduled
        }

        updateTimerRef.current = setTimeout(() => {
            const newHiddenButtons = findHiddenButtons();
            const showHidden = newHiddenButtons.length > 0;

            if (showHidden !== isShowHiddenButtons) {
                setShowHiddenButtons(showHidden);
            }

            if (!arraysEqual(newHiddenButtons, hiddenButtonsRef.current)) {
                setHiddenButtons(newHiddenButtons);
            }

            updateTimerRef.current = undefined;
        }, 100);
    };

    const findHiddenButtons: () => number[] = () => {
        const hidden: number[] = [];
        
        if (!buttonBarRef.current || buttons.length === 0) {
            return hidden;
        }

        const bar = buttonBarRef.current;
        const barRect = bar.getBoundingClientRect();
        
        // Check each button to see if it's outside the visible area
        let buttonIndex = 0;
        Array.from(bar.children).forEach((child) => {
            // Skip the overflow button itself
            const dataPath = child.getAttribute('data-layout-path');
            if (dataPath && dataPath.includes('/button/icon-overflow')) {
                return;
            }

            const childRect = child.getBoundingClientRect();
            
            // Check if button extends beyond the container boundaries
            if (childRect.right > barRect.right || childRect.left < barRect.left) {
                hidden.push(buttonIndex);
            }
            
            buttonIndex++;
        });

        return hidden;
    };

    return { hiddenButtons, isShowHiddenButtons };
};

function arraysEqual(arr1: number[], arr2: number[]) {
    return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);
}
