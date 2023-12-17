import adapter from '@sveltejs/adapter-node';
import vitePreprocess from 'vite-preprocess';

const config = {
  kit: {
    adapter: adapter({
      out: "build"
    }),
  },
  preprocess: vitePreprocess()
};

export default config;
