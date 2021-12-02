const createElementSVG =
  <K extends keyof SVGElementTagNameMap> (tag: K) =>
    document.createElementNS("http://www.w3.org/2000/svg", tag);