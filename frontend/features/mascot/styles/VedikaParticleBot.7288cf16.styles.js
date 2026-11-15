export const s0 = ({inline,width,height}) => ({
        position: 'relative',
        width: inline ? width : '100%',
        height: height,
        minHeight: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        overflow: 'visible'
      });
