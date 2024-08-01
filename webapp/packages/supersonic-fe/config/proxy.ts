export default {
  dev: {
    '/api/': {
      target: 'http://172.19.230.208:9080',
      changeOrigin: true,
    },
  },
};
