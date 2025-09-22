# ESLint & Prettier Configuration

## Cấu hình đã được thiết lập

### ESLint Rules

- **Standard.js style**: No semicolons, single quotes, 2 spaces indentation
- **TypeScript**: Strict type checking và unused variables detection
- **React**: Function components với proper hooks usage
- **Prettier integration**: Format conflicts được resolve tự động

### Prettier Configuration

- **No semicolons**: `"semi": false`
- **Single quotes**: `"singleQuote": true`
- **2 spaces indentation**: `"tabWidth": 2`
- **80 characters line length**: `"printWidth": 80`

## Cách sử dụng

### 1. Kiểm tra lỗi format

```bash
npm run lint
```

### 2. Tự động fix lỗi format

```bash
npm run lint:fix
```

### 3. Format code với Prettier

```bash
npm run format
```

### 4. Kiểm tra format (không fix)

```bash
npm run format:check
```

### 5. Kiểm tra tất cả (TypeScript + ESLint + Prettier)

```bash
npm run check-all
```

## VS Code Setup

### Extensions cần thiết

- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)

### Auto-format on save

Đã được cấu hình trong `.vscode/settings.json`:

- Format khi save: `"editor.formatOnSave": true`
- Fix ESLint errors khi save: `"source.fixAll.eslint": "explicit"`

## Các lỗi format phổ biến

### 1. Semicolons

```javascript
// ❌ Sai
const name = 'John'

// ✅ Đúng
const name = 'John'
```

### 2. Quotes

```javascript
// ❌ Sai
const message = 'Hello world'

// ✅ Đúng
const message = 'Hello world'
```

### 3. Function spacing

```javascript
// ❌ Sai
function myFunction() {

// ✅ Đúng
function myFunction () {

// ❌ Sai
const myFunc = () => {

// ✅ Đúng
const myFunc = () => {
```

### 4. React components

```javascript
// ❌ Sai
const MyComponent = () => {

// ✅ Đúng
function MyComponent () {
```

## Troubleshooting

### Nếu ESLint không hoạt động

1. Restart VS Code
2. Kiểm tra extensions đã được cài đặt
3. Chạy `npm run lint` để kiểm tra

### Nếu Prettier conflicts với ESLint

Cấu hình đã được setup để Prettier override ESLint formatting rules, chỉ ESLint logic rules sẽ được áp dụng.
