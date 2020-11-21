const Elem = (tagName, children, attrs) => {
  const elem = document.createElement(tagName);
  elem.appendChild(children);

  for (const attr in attrs) {
    elem.setAttribute(attr, attrs[attr]);
  }

  return elem;
};

const Fragment = (...children) =>
  children.reduce(
    (frag, child) => {
      frag.appendChild(`domElement` in child ? child.domElement : child);
      return frag;
    },
    document.createDocumentFragment()
  );
