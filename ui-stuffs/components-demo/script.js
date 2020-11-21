const bubbleSortVisualise = (containerId, arr) => {
  const container = document.getElementById(containerId);
  container.classList.add("container");
  container.innerHTML = '';
  container.appendChild(
    BubbleSortVisualization({ elements: arr }).domElement
  );
};

bubbleSortVisualise("bubble-sort", [5, 1, 2, 6, 3, 4, 7, 9, 8, 10]);
bubbleSortVisualise("bubble-sort1", [5, 1, 2, 92138, 12321, 44444]);
