export default {
  dev: {
    '/api/': {
      target: 'http://172.19.230.208:9080',
      // target: 'http://10.73.48.182:9000',
      changeOrigin: true,
    },
  },
};
