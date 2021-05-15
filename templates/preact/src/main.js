import { render } from 'preact';
import App from './App';

let root = document.querySelector('#app');
document.body.appendChild(root);
render(<App />, root);
