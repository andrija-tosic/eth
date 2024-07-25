export const formatTime = (timeMs: number) => {
  const totalSeconds = Math.floor(timeMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `\
${days > 0 ? `${days}d ` : ""}\
${hours > 0 ? `${hours}h ` : ""}\
${minutes > 0 ? `${minutes}m ` : ""}\
${seconds > 0 ? `${seconds}s ` : ""}\
`;
};
