/* eslint-disable import/prefer-default-export */

const parseDuration = (duration: string) => {
    const [days, hours, minutes, seconds, milliseconds] = duration.split('*').map(Number);
    return (days || 1) * (hours || 1) * (minutes || 1) * (seconds || 1) * (milliseconds || 1);
  };

export {
  parseDuration,
};
