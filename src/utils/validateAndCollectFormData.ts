export function validateAndCollectFormData(form: HTMLFormElement): { isValid: boolean; formData: { [key: string]: string } } {
  let isValid = true;
  const formData: { [key: string]: string } = {};

  Array.from(form.elements).forEach(element => {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const fieldName = element.name;

      const hasClass = String(element.classList).includes("input--invalid");

      if (hasClass) {
        isValid = false;
        console.log(`Ошибка валидации поля ${fieldName}`);
      } else {
        formData[fieldName] = element.value;
      }
    }
  });

  return { isValid, formData };
}
