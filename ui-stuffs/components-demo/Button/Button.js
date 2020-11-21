const Button = ({ onClick, initialText }) => {
  const button = document.createElement('button');
  button.classList.add('step');

  const setText = text => button.innerText = text;
  const getText = () => button.innerText;

  setText(initialText);

  button.addEventListener('click', event => onClick({ setText, getText }, event));

  return { domElement: button, setText, getText };
};
