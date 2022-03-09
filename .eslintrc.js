module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true
    },
    settings: {
        react: {
          createClass: "createReactClass", // Regex for Component Factory to use, default to "createReactClass"
          pragma: "React",  // Pragma to use, default to "React"
          fragment: "Fragment",  // Fragment to use (may be a property of <pragma>), default to "Fragment"
          version: "detect", // React version. "detect" automatically picks the version you have installed.
          flowVersion: "0.53"
        },
        propWrapperFunctions: [
            // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
            "forbidExtraProps",
            {"property": "freeze", "object": "Object"},
            {"property": "myFavoriteWrapper"}
        ],
        linkComponents: [
          // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
          "Hyperlink",
          {"name": "Link", "linkAttribute": "to"}
        ]
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        "ecmaFeatures": {
            "jsx": true
        },
        project: ["tsconfig.json", "tsconfig.node.json"]
    },
    plugins: ["@typescript-eslint", "react"],
    ignorePatterns: ['**/*.js'],
    rules: {
        "no-void": 0,
        "react/prop-types": 0,
        'prettier/prettier': 0,
        quotes: ["error", "double"],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/indent": ["warn", 2],
        "@typescript-eslint/member-delimiter-style": [
            "warn",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/no-unused-expressions": "warn",
        "@typescript-eslint/quotes": [
            "warn",
            "double"
        ],
        "@typescript-eslint/semi": [
            "warn",
            "always"
        ],
        "brace-style": [
            "warn",
            "1tbs"
        ],
        "curly": [
            "warn",
            "multi-line"
        ],
        "max-len": [
            "error",
            {
                "code": 200
            }
        ],
        "no-caller": "warn",
        "no-constant-condition": "warn",
        "no-control-regex": "warn",
        "no-eval": "error",
        "no-extra-semi": "error",
        "no-invalid-regexp": "error",
        "no-irregular-whitespace": "warn",
        "no-multiple-empty-lines": [
            "warn",
            {
                "max": 1
            }
        ],
        "no-octal": "warn",
        "no-octal-escape": "warn",
        "no-regex-spaces": "warn",
        "no-restricted-syntax": [
            "error",
            "ForInStatement"
        ],
        "no-trailing-spaces": "warn",
        "@typescript-eslint/no-empty-interface": [
            "error",
            {
                "allowSingleExtends": true
            }
        ],
        "react/display-name": "off" // DisplayName allows you to name your component. This name is used by React in debugging messages.
    }
};
