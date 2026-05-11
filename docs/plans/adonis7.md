## Recipe

```
npm create adonisjs@latest cms -- --kit=vue
```

switch to postgres

```bash
node ace add @adonisjs/mail --transports=mailgun
node ace add @adonisjs/cache
npm install pg
npm install pinia @aws-sdk/client-s3 marked @google-analytics/data
npm install gpt-tokenizer openai zod firebase-admin firebase
npm install -D tailwindcss@3.4.19 postcss autoprefixer @japa/api-client nock
npx tailwindcss init -p
```

```
npm install 'git+https://github.com/story-cms/kit.git#sco-2053-fix-setup-recipe'
node ace configure @story-cms/kit
npm run format
```

```
rm database/migrations/*users_table.ts \
  app/controllers/new_account_controller.ts \
  app/controllers/session_controller.ts \
  app/transformers/user_transformer.ts \
  app/validators/user.ts \
  inertia/pages/home.vue \
  inertia/pages/auth/login.vue \
  inertia/pages/auth/signup.vue
```

```
createdb fresh_desktop
cp .env.example .env
node ace generate:key
edit .env
node ace migration:run
```

```
cp .env.example .env.test
sed -i '' 's/^SESSION_DRIVER=.*/SESSION_DRIVER=memory/' .env.test
sed -i '' 's/^APP_KEY=.*/APP_KEY=just-a-local-public-secret/' .env.test
sed -i '' 's|^DB_CONNECTION=.*|DB_CONNECTION=postgresql://postgres:password@localhost/your_test_db|' .env.test
edit .env.test
# remember to set your test db user, password and database
npm run test
```

---

```bash
npm i $(node -e "const pkg = require('./package.json'); const deps = {...pkg.dependencies,
...pkg.devDependencies}; console.log(Object.keys(deps).filter(k =>
k.startsWith('@adonisjs/') || k === '@vinejs/vine' || k === 'edge.js' || k ===
'@japa/plugin-adonisjs' || k === 'vite' || k === 'argon2').map(k => k + '@latest').join('
'))") --force
```

## To do

- [x] stub app/middleware/inertia_middleware.ts
- [x] config/database.ts
- [x] deprecate src/backend/stubs/config/inertia.stub
- [x] pages: model, validator, service, controller, tests
- [x] default app/validators/story_validator.ts
- [x] src/frontend/store/shared.ts#setFromProps
- [x] story: model, validator, service, controller, tests
- [x] auth: model, validator, service, controller, tests
- [x] streams: model, validator, service, controller, tests
- [x] invitations: model, validator, service, controller, tests
- [x] ui: model, validator, service, controller, tests
- [x] team: model, validator, service, controller, tests
- [x] audience: model, validator, service, controller, tests
- [x] deprecate trimmedErrors

---
