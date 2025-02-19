import './styles/main.pcss';
import App from './App.ts';

window.addEventListener('click', (evt: MouseEvent) => {
    const target = evt.target as HTMLElement;
    if (target.tagName === 'A') {
        evt.preventDefault();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.useStore();
    app.useRouter();
});
