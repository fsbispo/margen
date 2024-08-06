export function formatDate(date: Date | null | undefined): string {
  if (!date) 
      return ''; 

  const config: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
  };

  const formattedDate = new Intl.DateTimeFormat('pt-BR', config).format(new Date(date));
  return formattedDate.replace(',', '');
}

export const secondsToHHMMSS = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(secs).padStart(2, '0')
  ].join(':');
};
