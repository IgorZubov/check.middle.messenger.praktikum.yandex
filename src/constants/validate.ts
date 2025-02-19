export const regExpPersonName = /^[A-ZА-Я]{1}[A-Za-zА-Яа-я-]+$/;
export const regExpLogin = /^(?!_|-|\s*$)+([a-zA-Zа-яА-Я]|[0-9\-_]*(?!_|-)){3,20}$/;

export const regExpEmail =
    // eslint-disable-next-line no-control-regex
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
export const regExpPassword = /^((?=.*[A-ZА-Я])(?=.*[0-9])).{8,40}$/;
export const regExpPhone = /^(\d|\+){1}[\d]{10,15}$/;
export const regExpMessage = /^(.|\s)*\S(.|\s)*$/;
export const regExpAvatar = /^$/;
export const regExpNotEmpty = /^(?!\s*$).+/;

export const ErrorText = {
    login: 'Неверный формат логина',
    email: 'Неверный формат почты',
    password: 'Неверный формат пароля',
    oldPassword: 'Неверный формат пароля',
    newPassword: 'Неверный формат пароля',
    first_name: 'Неверный формат имени',
    second_name: 'Неверный формат фамилии',
    phone: 'Неверный формат телефона',
    avatar: 'Неверный формат файла',
    display_name: 'Неверный формат никнейма',
    message: 'Введите сообщение',
};

export const InputRegExp = {
    login: regExpLogin,
    email: regExpEmail,
    password: regExpPassword,
    oldPassword: regExpPassword,
    newPassword: regExpPassword,
    first_name: regExpPersonName,
    second_name: regExpPersonName,
    phone: regExpPhone,
    avatar: regExpAvatar,
    display_name: regExpPersonName,
    message: regExpNotEmpty,
};

export type TInputName = keyof typeof InputRegExp;
