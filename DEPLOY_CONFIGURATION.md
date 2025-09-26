# Configuración de Deploy para Frontend

## Variables de Entorno

La aplicación utiliza variables de entorno tanto para desarrollo local como para producción. La función `getEnvVar` en `src/utils/env.ts` maneja automáticamente las diferencias entre entornos.

### Desarrollo Local
- Las variables se leen desde `.env.local`
- Vite usa `import.meta.env` para acceder a las variables
- El proxy de Vite redirige `/api` a la URL configurada

### Producción (S3/CloudFront)
- Las variables se inyectan durante el build en GitHub Actions
- Se reemplazan estáticamente en el código JavaScript compilado
- No requiere servidor, funciona como sitio estático

## Configuración de GitHub Secrets

Para que el deploy funcione correctamente, necesitas configurar los siguientes secrets en tu repositorio de GitHub:

### Secrets Requeridos

#### AWS Credentials
- `AWS_ACCESS_KEY_ID`: Tu AWS Access Key ID
- `AWS_SECRET_ACCESS_KEY`: Tu AWS Secret Access Key

#### URLs de API (Backend)
- `API_BASE_URL_STAGING`: URL base del API para staging (ej: `https://api-staging.tudominio.com`)
- `API_BASE_URL_PRODUCTION`: URL base del API para producción (ej: `https://api.tudominio.com`)

#### URLs del Frontend
- `FRONTEND_URL_STAGING`: URL del frontend staging (ej: `https://staging.tudominio.com`)
- `FRONTEND_URL_PRODUCTION`: URL del frontend producción (ej: `https://tudominio.com`)

#### CloudFront Domains
- `CLOUDFRONT_DOMAIN_STAGING`: Dominio de CloudFront para staging
- `CLOUDFRONT_DOMAIN_PRODUCTION`: Dominio de CloudFront para producción

#### Opcional - IDs de distribución (se crean automáticamente si no existen)
- `CLOUDFRONT_DISTRIBUTION_STAGING`: ID de la distribución CloudFront de staging
- `CLOUDFRONT_DISTRIBUTION_PRODUCTION`: ID de la distribución CloudFront de producción

### Cómo Agregar los Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Click en "Settings" > "Secrets and variables" > "Actions"
3. Click en "New repository secret"
4. Agrega cada secret con su nombre y valor

### Ejemplo de Valores

```
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

API_BASE_URL_STAGING=http://staging-alb.us-east-1.elb.amazonaws.com
API_BASE_URL_PRODUCTION=https://api.shrt.com

FRONTEND_URL_STAGING=https://d1mrphf40jf3dj.cloudfront.net
FRONTEND_URL_PRODUCTION=https://shrt.com

CLOUDFRONT_DOMAIN_STAGING=d1mrphf40jf3dj.cloudfront.net
CLOUDFRONT_DOMAIN_PRODUCTION=d3dcezd6ji3gto.cloudfront.net
```

## Flujo de Deploy

### 1. Desarrollo Local
```bash
# Usa las variables de .env.local
npm run dev
```

### 2. Build Local (para pruebas)
```bash
# Puedes probar el build localmente
VITE_API_URL=https://api.tudominio.com/api npm run build
```

### 3. Deploy Automático via GitHub Actions

#### Para Staging (rama develop)
```bash
git checkout develop
git push origin develop
# Se despliega automáticamente a S3 staging
```

#### Para Producción (rama main)
```bash
git checkout main
git merge develop
git push origin main
# Se despliega automáticamente a S3 production
```

### 4. Deploy Manual via GitHub Actions
También puedes hacer deploy manual desde la pestaña "Actions" en GitHub:
1. Ve a "Actions" > "Frontend CI/CD Pipeline"
2. Click en "Run workflow"
3. Selecciona el environment (staging o production)
4. Click en "Run workflow"

## Verificación Post-Deploy

### Verificar que las variables se inyectaron correctamente:
1. Abre las DevTools del navegador
2. Ve a la pestaña Network
3. Busca las llamadas a la API
4. Deberían ir a la URL correcta configurada en los secrets

### URLs de los Ambientes
- **Staging**: https://d1mrphf40jf3dj.cloudfront.net (o tu dominio personalizado)
- **Production**: https://d3dcezd6ji3gto.cloudfront.net (o tu dominio personalizado)

## Troubleshooting

### Si las variables no se cargan en producción:
1. Verifica que los secrets estén configurados en GitHub
2. Revisa los logs del workflow en GitHub Actions
3. Busca la línea "Verifying Build Output" que confirma si las variables se inyectaron
4. Verifica que el build incluya `/api` al final de la URL del backend

### Si el frontend no puede conectarse al backend:
1. Verifica que la URL del API incluya `/api` al final
2. Confirma que el backend tiene CORS configurado para permitir el dominio del frontend
3. Revisa que el backend esté accesible desde internet

## Estructura de Variables

Las variables se procesan en este orden:
1. **Test Environment**: usa `process.env` directamente
2. **Development**: usa `import.meta.env` de Vite
3. **Production Build**: Vite reemplaza `import.meta.env.VITE_*` con valores estáticos durante el build

La función `getEnvVar` maneja automáticamente estos casos, por lo que el código funciona igual en todos los entornos.