import { Children, Fragment, useRef } from "react";

function Accordion({ children, groupName = "my-accordion-group" }) {
  const inputRef = useRef(null);
  const childrenArray = Children.toArray(children);
  const title = childrenArray[0];
  const contentElements = childrenArray.slice(1);

  const handleAccordionClick = () => {
    if (inputRef.current) {
      inputRef.current.checked = !inputRef.current.checked;
    }
  };
  return (
    <div className="collapse-arrow bg-base-100 border-base-300 collapse border">
      <input type="radio" name={groupName} ref={inputRef} className="pointer-events-none" />
      <div
        className="collapse-title text-lg font-semibold md:text-xl"
        onClick={handleAccordionClick}
      >
        {title}
      </div>
      <div className="prose collapse-content text-base-content">
        {contentElements.map((child, index) => (
          <Fragment key={index}>{child}</Fragment>
        ))}
      </div>
    </div>
  );
}

export default Accordion;
