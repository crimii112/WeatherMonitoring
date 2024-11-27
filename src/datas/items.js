export const items = [
  {
    name: '풍속',
    unit: '(m/s)',
    value: 'ws',
    domain: ['auto', 'auto'],
    tickCount: 10,
  },
  { name: '풍향', unit: '(°)', value: 'wd', domain: [0, 360], tickCount: 10 },
  {
    name: '온도',
    unit: '(℃)',
    value: 'tmp',
    domain: ['auto', 'auto'],
    tickCount: 10,
  },
  { name: '습도', unit: '(%)', value: 'hum', domain: [0, 100], tickCount: 11 },
  {
    name: '기압',
    unit: '(hPa)',
    value: 'pressure',
    domain: [950, 1050],
    tickCount: 11,
  },
];
