const onClick = () => chrome.runtime.sendMessage({ message: 'hello from config.ts' });

const root = document.querySelector('body');
const btn = document.getElementById('btn');

btn?.addEventListener('click', () => window.alert('hi'));
