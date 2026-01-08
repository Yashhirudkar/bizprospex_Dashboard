import { useState, useRef } from "react";

const TooltipCell = ({
  children,
  text,
  maxWidth = "max-w-[250px]",
  autoCloseMs = 900,
}) => {
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);

  if (!text) return "-";

  const handleMouseEnter = () => {
    setShow(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setShow(false);
    }, autoCloseMs);
  };

  return (
    <div
      className={`relative ${maxWidth}`}
      onMouseEnter={handleMouseEnter}
    >
      <div className="line-clamp-2 truncate cursor-pointer">
        {children || text}
      </div>

      {show && (
        <div
          className="absolute z-50 bg-gray-900 text-white text-xs rounded-md px-3 py-2
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
