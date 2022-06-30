import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const path = require("path");

function _resolve(dir: string) {
  return path.resolve(__dirname, dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  //配置目录别名
  resolve: {
    alias: {
      "/@": _resolve("src"),
      "/@components": _resolve("src/components"),
      "/@assets": _resolve("src/assets")
    },
  },
  plugins: [vue()],
});
