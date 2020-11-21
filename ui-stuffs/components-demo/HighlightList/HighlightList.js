const HighlightList = ({ elements }) => {
  const list = document.createElement('ul');
  list.classList.add('hlist');
  const listItems = elements.map(e => {
    const li = document.createElement('li');
    li.classList.add('hlist-item');
    li.innerHTML = e;
    list.appendChild(li);
    return li;
  });

  const highlightItems = indexes => {
    listItems.forEach((li, i) => {
      li.classList.toggle('highlighted', indexes.includes(i));
    });
  };

  const highlightAll = () => {
    listItems.forEach(li => li.classList.add('highlighted'));
  };

  const swapItemsAt = (x, y) => {
    const tmp = listItems[x].innerHTML;
    listItems[x].innerHTML = listItems[y].innerHTML;
    listItems[y].innerHTML = tmp;
  };

  return { domElement: list, highlightItems, swapItemsAt, highlightAll };
};
