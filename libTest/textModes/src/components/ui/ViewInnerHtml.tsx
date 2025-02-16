import * as React from "react";

type PropsViewInnerHtml = React.HTMLAttributes<HTMLDivElement> & {
  html: string;
}

/** 
 * @param props.html This value can only be used from safe sources. This includes code generation functions. It does not include text input elements.
 * @returns 
 */
export const ViewInnerHtml: React.FC<PropsViewInnerHtml> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const {html, ...divProps} = props;
  React.useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = html;
    }
  }, [html]);
  return <div ref={ref} {...divProps} />
}