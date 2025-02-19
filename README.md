# Проект ya-middle-messenger
## Описание
- Проект уровня middle мессенджер


## Ссылки
- [Макет](https://www.figma.com/design/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=0-1&node-type=canvas&t=MCYvBYcriLqDxmgU-0)
- [Демо проекта](https://ansnekit.netlify.app/)


## Страницы
### Страницы открываются в навигации в Header navigation link
- [Логин](https://ansnekit.netlify.app)
- [Регистрация](https://ansnekit.netlify.app/sign-up)
- [Чаты](https://ansnekit.netlify.app/messenger)
- [Профиль](https://ansnekit.netlify.app/settings)
- [Редактирование профиля](https://ansnekit.netlify.app/profile-edit)
- [404 ошибка](https://ansnekit.netlify.app/*)
- [500 ошибка](https://ansnekit.netlify.app/server-error)


## Технологии
- NodeJs LTS 20
- NPM 10.9
- Handlebars 4.7
- PostCSS
- Сборщик Vite
- Typescript 5.5


## Команды
Запуск проекта `npm run dev`

Сборка статики `npm run build`

Сборка для production `npm run start`

## Функционал
#### Добавлен роутинг с проверкой авторизации

- / — страница входа

- /sign-up — страница регистрации

- /settings — настройки профиля пользователя

- /profile-edit - Редактирование профиля

- /messenger — чат

#### Добавлено глобальное хранишище Store

#### Подключено HTTP API чатов, авторизации и пользователей. [Документация](https://ya-praktikum.tech/api/v2/swagger/#/)

Реализован с АПИ следующий функционал:
- Авторизация (регистрация, авторизация, выход из системы);
- Работа с информацией пользователя (изменять данные пользователя, изменять аватар, изменять пароль);
- Работа с чатами (список чатов пользователя, создать новый чат, добавить пользователя в чат, удалить пользователя из чата)

#### Подключено АПИ WebSocket
С вебсокетами работает отправка/получение сообщений в чате [Документация](https://ya-praktikum.tech/api/v2/openapi/ws)

##### Для обработки АПИ написаны сервисы. Для подписки на события и реализации реактивности используется шина событий EventBus

#### Подключены компоненты модального окна и контекстного меню
