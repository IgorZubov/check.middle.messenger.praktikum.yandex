import './style.scss';
import { ChatPage } from './pages/Chat';
import { ChatList } from './components/ChatList';
import { ErrorPage } from './pages/Error';
import { AuthPage } from './pages/Аuthorization';
import { Input } from './components/Input';
import { Link } from './components/Link';
import { Button } from './components/Button';
import { SettingsPage } from './pages/Settings';
import Router from './framework/Router';
import { connect } from './framework/HOC';

const router = new Router('app');

const props_page_404 = {
  status: 404,
  error: 'Страница не найдена'
}
const props_page_500 = {
  status: 500,
  error: 'Внутренняя ошибка сервера'
};
const props_page_auth = {
  title: 'Вход',
  inputs: [
    new Input({ titleInp: 'Логин', wrapInp: 'input-wrap', input: { type: 'text', name: 'login' } }),
    new Input({ titleInp: 'Пароль', wrapInp: 'input-wrap', input: { type: 'password', name: 'password' } }),
  ],
  submit_btn: new Button({ class: 'submit-btn', text: 'Авторизоваться' }),
  links: [
    new Link({ text: 'Нет аккаунта?', to: '/sign-up' }),
    new Link({ text: 'Забыли пароль?' }),
  ],
};
const props_page_register = {
  title: 'Регистрация',
  inputs: [
    new Input({ titleInp: 'Имя', wrapInp: 'input-wrap', input: { type: 'text', name: 'first_name' } }),
    new Input({ titleInp: 'Фамилия', wrapInp: 'input-wrap', input: { type: 'text', name: 'second_name' } }),
    new Input({ titleInp: 'Логин', wrapInp: 'input-wrap', input: { type: 'text', name: 'login' } }),
    new Input({ titleInp: 'Номер телефона', wrapInp: 'input-wrap', input: { type: 'tel', name: 'phone' } }),
    new Input({ titleInp: 'Email', wrapInp: 'input-wrap', input: { type: 'email', name: 'email' } }),
    new Input({ titleInp: 'Пароль', wrapInp: 'input-wrap', input: { type: 'password', name: 'password' } }),
  ],
  submit_btn: new Button({ class: 'submit-btn', text: 'Зарегистрироваться' }),
  links: [
    new Link({ text: 'Уже есть аккаунт?', to: '/' }),
  ]
};
const props_page_settings = {
  name: '',
  profile_settings: [
    new Input({ titleInp: 'Name: ', wrapInp: 'settings-input-wrap', input: { type: 'text', name: 'first_name', value: '' } }),
    new Input({ titleInp: 'Surname: ', wrapInp: 'settings-input-wrap', input: { type: 'text', name: 'second_name', value: '' } }),
    new Input({ titleInp: 'Nickname: ', wrapInp: 'settings-input-wrap', input: { type: 'text', name: 'display_name', value: '' } }),
    new Input({ titleInp: 'Email: ', wrapInp: 'settings-input-wrap', input: { type: 'email', name: 'email', value: '' } }),
    new Input({ titleInp: 'Phone: ', wrapInp: 'settings-input-wrap', input: { type: 'tel', name: 'phone', value: '' } }),
    new Input({ titleInp: 'Login: ', wrapInp: 'settings-input-wrap', input: { type: 'text', name: 'login', value: '' } }),
  ],
  buttons_settings: [
    new Button({ theme: 'blue', class: 'settings-btn', text: 'Save new Data' }),
    new Button({ theme: 'red', class: 'settings-btn', text: 'Quit', linkTo: '/' }),
    new Button({ theme: 'blue', class: 'settings-btn', text: 'Change Password', linkTo: '/change-password' }),
  ]
};
const props_page_changePassword = {
  name: '',
  profile_settings: [
    new Input({ titleInp: 'Old password: ', wrapInp: 'settings-input-wrap', input: { type: 'password', name: 'oldPassword', value: '' } }),
    new Input({ titleInp: 'New password: ', wrapInp: 'settings-input-wrap', input: { type: 'password', name: 'newPassword', value: '' } }),
  ],
  buttons_settings: [
    new Button({ theme: 'blue', class: 'settings-btn', text: 'Save New Password' }),
    new Button({ theme: 'red', class: 'settings-btn', text: 'Back', linkTo: 'back' }),
  ]
};
const chatList = new ChatList({
  chats: [
    // new ChatItem({
    //   id: 1,
    //   isRead: true,
    //   online: true,
    //   activeChat: true,
    //   interlocutorName: 'Steven',
    //   messages: [
    //     new Message({id: 1, message: 'Welcome to the my Messanger :)', author: 'Steven'}),
    //     new Message({id: 2, message: 'Hello, thanks', author: 'Me'}),
    //     new Message({id: 3, message: 'It looks cool', author: 'Me'}),
    //     new Message({id: 4, message: 'Yes, I am glad to hear that', author: 'Steven'}),
    //   ]
    // })
  ]
})
const props_page_chat = {
  chatList,
  interlocutorName: '',
  online: 'online',
  messages: '',
};

const errorPage = connect(ErrorPage);
const authPage = connect(AuthPage);
const settingsPage = connect(SettingsPage);
const chatPage = connect(ChatPage);
router
  .use('/404', errorPage(props_page_404))
  .use('/500', errorPage(props_page_500))
  .use('/', authPage(props_page_auth))
  .use('/sign-up', authPage(props_page_register))
  .use('/settings', settingsPage(props_page_settings))
  .use('/change-password', settingsPage(props_page_changePassword))
  .use('/messenger', chatPage(props_page_chat))

  .start();
