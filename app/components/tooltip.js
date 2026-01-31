import { useState, useRef } from "react";

const TooltipCell = ({
  children,
  text,
  maxWidth = "max-w-[250px]",
  openDelayMs = 2000,   // open after 2 sec
  autoCloseMs = 5000,   // auto close
  leaveDelayMs = 1000,  // 👈 stay 1 sec after mouse leave
}) => {
  const [show, setShow] = useState(false);

  const openTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  if (!text) return "-";

  const handleMouseEnter = () => {
    clearTimeout(openTimerRef.current);
    clearTimeout(closeTimerRef.current);
    clearTimeout(leaveTimerRef.current);

    openTimerRef.current = setTimeout(() => {
      setShow(true);

      closeTimerRef.current = setTimeout(() => {
        setShow(false);
      }, autoCloseMs);
    }, openDelayMs);
  };

  const handleMouseLeave = () => {
    clearTimeout(openTimerRef.current);
    clearTimeout(closeTimerRef.current);

    // 👇 delay hide by 1 second
    leaveTimerRef.current = setTimeout(() => {
      setShow(false);
    }, leaveDelayMs);
  };

  return (
    <div
      className={`relative ${maxWidth}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="line-clamp-2 truncate cursor-pointer">
        {children || text}
      </div>

      {show && (
        <div
          className="absolute z-50 bg-gray-500 text-white text-xs rounded-md px-3 py-1
                     max-w-xs break-words shadow-lg select-text
                     -top-2 left-0 translate-y-[-100%]"
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default TooltipCell;
