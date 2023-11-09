# tarantula

An ESLint plugin with a bunch of rules to enchance your team's code convention.

## How to add this plugin

1. Install this plugin by running this script
   `npm install eslint-plugin-tarantula`
2. Add `tarantula` as a plugin in your `.eslintrc` file

```
 // .eslintrc
   {
      "plugins" : [
         // your other plugins
         "tarantula"
      ],
   }
```

3. Add rules you want to set in the `.eslintrc` file

```
  // .eslintrc
  {
     "rules" : {
       // your other rules
       "tarantula/require-image-with-alt" : "warn",
     }
  }
```

4. Run `npm run lint` or `npx eslint` to lint your code

## List of available rules:

- `require-image-with-alt` : Enforce every `<img>` element to have `alt` attribute.
