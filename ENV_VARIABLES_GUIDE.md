# Environment Variables Guide for S3/CloudFront Deployment

## 🎯 Key Points for Vite + React + S3

### ✅ How Environment Variables Work in Vite

1. **Static Replacement**: Vite replaces `import.meta.env.VITE_*` variables **at build time**
2. **VITE_ Prefix Required**: Only variables prefixed with `VITE_` are exposed to client code
3. **No Runtime Changes**: Once built for S3, values are immutable

### 🏗️ Build Time vs Runtime

```bash
# ❌ WRONG: Trying to set variables at container runtime (doesn't work for S3)
docker run -e VITE_API_URL=https://api.prod.com myapp

# ✅ CORRECT: Set variables at build time (works for S3)
docker build --build-arg VITE_API_URL=https://api.prod.com -t myapp .
```

### 📋 Required Variables

All variables must be prefixed with `VITE_`:

```env
VITE_API_URL=https://api.example.com
VITE_API_BASE_URL=/api
VITE_APP_URL=https://myapp.com
VITE_APP_ENV=production
VITE_APP_NAME=Shrt
VITE_APP_VERSION=1.0.0
VITE_COMMIT_HASH=abc123
VITE_COMMIT_MESSAGE=Latest deployment
VITE_GIT_BRANCH=main
VITE_BUILD_TIME=2024-09-26T10:00:00Z
VITE_REQUEST_TIMEOUT=5000
VITE_ENABLE_DEBUG=false
VITE_ENABLE_MONITORING=true
VITE_SHOW_PERFORMANCE_METRICS=false
```

### 🔧 Usage in React Components

```tsx
// ✅ CORRECT: Use the utility function
import { getEnvVar } from '../utils/env';

const apiUrl = getEnvVar('VITE_API_URL', 'http://localhost:8000');
const appName = getEnvVar('VITE_APP_NAME', 'MyApp');

// ✅ ALSO CORRECT: Direct import.meta.env access
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const appName = import.meta.env.VITE_APP_NAME || 'MyApp';
```

### 🚀 GitHub Actions Workflow

Variables are handled in two ways:

1. **Docker Build Args** (for build-time injection):
```yaml
docker build . -f Dockerfile.prod -t $IMAGE_TAG \
  --build-arg "VITE_API_URL=${{ secrets[matrix.api_url_secret] }}" \
  --build-arg "VITE_APP_ENV=${{ matrix.environment }}" \
  --build-arg "VITE_COMMIT_MESSAGE=Deploy from ${{ github.ref_name }}"
```

2. **Runtime Config Generation** (for S3 deployment):
```yaml
# Generate config.js inline in GitHub Actions
cat > dist/config.js << 'EOF'
window.__RUNTIME_CONFIG__ = {
  "VITE_API_URL": "${{ secrets[matrix.api_url_secret] }}",
  "VITE_APP_ENV": "${{ matrix.environment }}",
  "VITE_APP_NAME": "Shrt"
};
EOF
```

### 🐳 Dockerfile Configuration

```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder

# Build arguments (from GitHub Actions)
ARG VITE_API_URL
ARG VITE_APP_URL
ARG VITE_APP_ENV

# Set as environment variables for Vite build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_URL=$VITE_APP_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

# Build the app (variables are baked in)
RUN npm run build

# Stage 2: Static files for S3
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### ⚠️ Important Notes

1. **Security**: Never put secrets in VITE_ variables (they're visible in browser)
2. **Rebuild Required**: Changing variables requires rebuilding and redeploying
3. **Debug Logging**: Build logs will show which variables are loaded
4. **No Runtime Injection**: S3 can't modify files after deployment

### 🔍 Debugging

Check build logs for variable loading:
```
🔧 Vite build environment variables (production mode):
  VITE_API_URL: ✅ https://api.prod.com
  VITE_APP_ENV: ✅ production
  VITE_APP_NAME: ✅ Shrt
```

### 🔧 Troubleshooting

#### Common Issues:

1. **Build Args with Special Characters**:
   ```bash
   # ❌ WRONG: Complex commit messages cause export errors
   export VITE_COMMIT_MESSAGE="${{ github.event.head_commit.message }}"

   # ✅ CORRECT: Use simplified messages
   export VITE_COMMIT_MESSAGE="Deploy from ${{ github.ref_name }}"
   ```

2. **Missing Variables in Browser**:
   ```javascript
   // Check if runtime config is loaded
   console.log('Runtime config:', window.__RUNTIME_CONFIG__);
   console.log('import.meta.env:', import.meta.env);
   ```

3. **Invalid Export Identifiers**:
   ```bash
   # ❌ WRONG: export $(cat file | xargs) with special chars
   # ✅ CORRECT: Direct export statements
   export VITE_API_URL="value"
   ```

#### Debug Steps:

1. Check GitHub Actions logs for "🔧 Vite build environment variables"
2. Verify config.js is generated in S3
3. Check browser console for runtime config loading
4. Inspect network tab for config.js file load

### 📚 References

- [Vite Environment Variables Guide](https://vite.dev/guide/env-and-mode)
- [S3 Static Hosting Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Docker Build Args Best Practices](https://docs.docker.com/engine/reference/builder/#arg)