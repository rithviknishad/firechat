import sass from "rollup-plugin-sass";
import typescript from "rollup-plugin-typescript2";
import packageJson from "./package.json" assert { type: "json" };

export default {
  input: "src/index.ts",
  output: {
    file: packageJson.main,
    format: "cjs",
    sourcemap: true,
  },
  plugins: [sass({ insert: true }), typescript()],
  external: ["react", "react-dom", "firebase/database"],
};
