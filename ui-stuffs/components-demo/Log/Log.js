const Log = () => {
  const logContainer = document.createElement('div');
  logContainer.classList.add('log');

  const appendLine = line => {
    logContainer.innerHTML += `${line} <br/>`;
    logContainer.scrollTop = logContainer.scrollHeight;
  };

  return { domElement: logContainer, appendLine };
};
