import { useState } from 'react';
import { GoChevronDown, GoChevronLeft } from 'react-icons/go';

function ExpandablePanel({ header, content }) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  let formattedContent = null;

  if (expanded) {
    formattedContent = (
      <div className="p-2 border-t">
        <div className="whitespace-pre-line">
          {content.map((string, index) => (
            <div key={index}>{'"' + string + '"'}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 border rounded">
      <div className="flex p-2 justify-between items-center">
        <div className="flex flex-row items-center justify-between">
          {header}
        </div>
        <div onClick={handleClick} className="cursor-pointer">
          {expanded ? <GoChevronDown /> : <GoChevronLeft />}
        </div>
      </div>
      {formattedContent}
    </div>
  );
}

export default ExpandablePanel;
