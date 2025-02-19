import postcssNested from 'postcss-nested';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';

export default {
    map: false,
    plugins: [
        autoprefixer(),
        postcssNested(),
        postcssPresetEnv(),
    ],
};
