# OPTIONAL BUT PREFERABLE CONVENTIONS [FOR THIS PROJECT]
## Branch Naming
- `[Branch Type]/[Branch Name]`
- **Branch types**: Setup, Feature, Docs, Fix
- **Branch names**: Please name your branches to be concise but descriptive of what the project is doing
- **Example**: `feature/map-rendering`
## Branching
- Limit branches to resolve one issue, if possible
  - That way merge conflicts will be easier
  - It's probably not good to have 10000 lines of code changed in a single pull request
- If your branch does not have an issue, try to create one to link (if applicable, stuff like setup probably doesn't need it)
## Pull Requests
- Be descriptive of what the PR does, mentioning issues created/tackles/resolved
- Use [keywords](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/using-keywords-in-issues-and-pull-requests) to close issues
- Reviewing's kind of weird with non-Enterprise so I think we can just leave it
## Commits
- IDK just do them
# Issues
- Add labels where applicable
- Assign yourself to issues you're tackling
- Create branches off of issues if possible
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<hr><hr><hr><hr><hr><hr><hr><hr><hr><hr>hi<hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr>

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
