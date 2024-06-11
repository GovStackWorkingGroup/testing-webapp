/* eslint-disable import/prefer-default-export */

const parseDuration = (duration: string) => {
    const [days, hours, minutes, seconds, milliseconds] = duration.split('*').map(Number);
    return (days || 1) * (hours || 24) * (minutes || 60) * (seconds || 60) * (milliseconds || 1000);
  };

export {
  parseDuration,
};
