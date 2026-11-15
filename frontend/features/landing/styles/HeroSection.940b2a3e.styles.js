export const s0 = ({stageCursorPos,cursorInStage}) => ({
                transform: `translate3d(${stageCursorPos.x}px, ${stageCursorPos.y}px, 0)`,
                opacity: cursorInStage ? 1 : 0
              });

export const s1 = ({cursorInStage}) => ({ opacity: cursorInStage ? 0 : 1 });
