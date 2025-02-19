export const getFormFieldValue = (form: HTMLFormElement, fieldName: string) => {
  return (form.elements.namedItem(fieldName) as HTMLInputElement)?.value || "";
};
