import { forwardRef, useImperativeHandle, useRef } from "react";

function Photo({ links: { html }, urls: { regular: url } }, ref) {
  const lastImageRef = useRef();
  const style = {
    backgroundImage: `url(${url})`,
  };

  useImperativeHandle(ref, () => {
    const callback = function (entries, observer) {
      const [entry] = entries;
      ref(entry.isIntersecting, observer);
    };
    const opts = {
      root: null,
      threshold: 0,
    };
    const observer = new IntersectionObserver(callback, opts);

    observer.observe(lastImageRef.current);
  });

  return (
    <div ref={lastImageRef} className="photo" style={style}>
      <div className="photo-overlay">
        <a href={html} className="link">
          Explore
        </a>
      </div>
    </div>
  );
}

export default forwardRef(Photo);
