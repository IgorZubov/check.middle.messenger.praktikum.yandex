export interface IValidationReturn {
  isValid: boolean;
  errorMessage: string;
}

export const validation = (name: string, value: string): IValidationReturn => {
  switch (name) {
    case "login": {
      const pattern = /^(?=.*[a-zA-Z])([a-zA-Z0-9_-]{3,20})$/;

      if (pattern.test(value)) {
        return { isValid: true, errorMessage: "" };
      } else {
        return {
          isValid: false,
          errorMessage: "Логин должен содержать от 3 до 20 символов и состоять только из букв, цифр, подчеркиваний или дефисов.",
        };
      }
    }

    case "password": {
      const minLength = 8;
      const maxLength = 40;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasDigit = /\d/.test(value);

      if (value.length < minLength || value.length > maxLength) {
        return {
          isValid: false,
          errorMessage: `Пароль должен быть от ${minLength} до ${maxLength} символов.`,
        };
      }

      if (!hasUpperCase) {
        return {
          isValid: false,
          errorMessage: "Пароль должен содержать хотя бы одну заглавную букву.",
        };
      }

      if (!hasDigit) {
        return {
          isValid: false,
          errorMessage: "Пароль должен содержать хотя бы одну цифру.",
        };
      }

      return { isValid: true, errorMessage: "" };
    }

    case "name": {
      const pattern = /^[A-ZА-Я][a-zа-яA-ZА-Я-]*$/;
      if (pattern.test(value)) {
        return { isValid: true, errorMessage: "" };
      } else {
        return {
          isValid: false,
          errorMessage: "Имя должно начинаться с заглавной буквы и содержать только буквы и дефисы.",
        };
      }
    }

    case "email": {
      const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (pattern.test(value)) {
        return { isValid: true, errorMessage: "" };
      } else {
        return {
          isValid: false,
          errorMessage: "Email должен быть в формате example@example.com.",
        };
      }
    }

    case "phone": {
      const pattern = /^\+?\d{10,15}$/;
      if (pattern.test(value)) {
        return { isValid: true, errorMessage: "" };
      } else {
        return {
          isValid: false,
          errorMessage: "Телефон должен содержать от 10 до 15 цифр и может начинаться с '+'.",
        };
      }
    }

    case "not_empty": {
      const pattern = /^.+$/;
      if (pattern.test(value.trim())) {
        return { isValid: true, errorMessage: "" };
      } else {
        return {
          isValid: false,
          errorMessage: "Это поле не может быть пустым.",
        };
      }
    }

    default:
      return { isValid: false, errorMessage: "Неизвестный тип валидации." };
  }
};
