export const formatDate = (datetime: string | Date): string =>
  new Date(datetime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
