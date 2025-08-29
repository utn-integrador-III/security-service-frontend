# 🚀 Security Service Frontend - Setup Instructions

## 📋 Prerequisites
- Node.js v20.13.1 or higher
- npm v10.8.0 or higher

## 🔧 Installation Steps

### 1. Clone the repository
```bash
git clone <repository-url>
cd security-service-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Verify Tailwind CSS Configuration

**Important:** Make sure your `postcss.config.cjs` has the correct configuration:

```javascript
// postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 4. Start development server
```bash
npm run dev
```

## ⚠️ Troubleshooting

### Issue: Tailwind CSS styles not loading
If you see an error about `@tailwindcss/postcss` or styles aren't loading correctly:

1. **Check PostCSS configuration:**
   - Ensure `postcss.config.cjs` uses `tailwindcss: {}` (not `@tailwindcss/postcss`)
   - Ensure `postcss.config.js` uses `tailwindcss: {}` (not `@tailwindcss/postcss`)

2. **Reinstall dependencies if needed:**
   ```bash
   npm install
   ```

3. **Clear cache and restart:**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

## 📦 Current Dependencies

### Tailwind CSS Setup:
- `tailwindcss@3.4.16`
- `postcss`
- `autoprefixer`

### Key Configuration Files:
- `tailwind.config.js` - Tailwind configuration with custom colors (turquesa theme)
- `postcss.config.cjs` - PostCSS configuration
- `src/index.css` - Global styles with Tailwind directives

## 🎨 Features

- ✅ Modern responsive design
- ✅ Custom turquesa color theme
- ✅ Clean component architecture
- ✅ Optimized build process
- ✅ Cross-environment compatibility

## 🔗 Development URLs
- Development server typically runs on `http://localhost:5173`
- If port is in use, Vite will automatically try the next available port

---
*Last updated: August 29, 2025*
