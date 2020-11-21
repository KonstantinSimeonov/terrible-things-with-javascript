const BubbleSortVisualization = ({ elements }) => {
  let arr = elements.slice();
  const hlist = HighlightList({ elements: arr });
  const sortLog = Log();

  let swapCounter = 0;
  let i = 0;
  let isHighlight = true;

  const bubbleSortStep = target => {
    if (target.getText() === "Reset") {
      swapCounter = 0;
      i = 0;
      isHighlight = true;
      arr = elements.slice();
    }

    target.setText("Next");
    if (i === arr.length - 1) {
      if (swapCounter === 0) {
        hlist.highlightAll();
        target.setText("Reset");
        sortLog.appendLine("Array is Sorted!");
        return;
      }

      i = 0;
      swapCounter = 0;
    }

    hlist.highlightItems([i, i + 1]);
    sortLog.appendLine(`Comparing ${arr[i]} with ${arr[i + 1]}...`);

    if (isHighlight) {
      isHighlight = false;
      return;
    }
    isHighlight = true;

    if (arr[i] > arr[i + 1]) {
      swap(arr, i, i + 1);
      hlist.swapItemsAt(i, i + 1);
      ++swapCounter;
    } else {
      sortLog.appendLine("No need for swap!");
    }
    ++i;
  };

  const visualisationContainer = Elem(
    'div',
    Fragment(
      Elem('div', hlist.domElement, { class: 'Array' }),
      Button({ onClick: bubbleSortStep, initialText: 'Start' })
    ),
    { class: 'bigDiv' }
  );

  return { domElement: Fragment(sortLog.domElement, visualisationContainer) };
}
