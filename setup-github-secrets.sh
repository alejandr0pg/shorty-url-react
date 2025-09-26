#!/bin/bash

# Script para configurar automáticamente GitHub Secrets para el proyecto Shrt Frontend
# Requiere: GitHub CLI (gh) instalado y autenticado
# Uso: ./setup-github-secrets.sh

set -e

echo "🔐 Configurando GitHub Secrets para Shrt Frontend..."

# Verificar que gh CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) no está instalado"
    echo "Instálalo desde: https://cli.github.com/"
    exit 1
fi

# Verificar que está autenticado
if ! gh auth status &> /dev/null; then
    echo "❌ No estás autenticado en GitHub CLI"
    echo "Ejecuta: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI detectado y autenticado"

# Obtener información de AWS
echo "🔍 Detectando configuración de AWS..."

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI no está instalado"
    echo "Instálalo desde: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
    exit 1
fi

# Obtener credenciales AWS actuales
AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id 2>/dev/null || echo "")
AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key 2>/dev/null || echo "")

if [[ -z "$AWS_ACCESS_KEY_ID" || -z "$AWS_SECRET_ACCESS_KEY" ]]; then
    echo "❌ No se encontraron credenciales AWS configuradas"
    echo "Ejecuta: aws configure"
    exit 1
fi

echo "✅ Credenciales AWS detectadas"

# Buscar distribuciones CloudFront existentes
echo "🔍 Buscando distribuciones CloudFront existentes..."

STAGING_DIST_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[?contains(DomainName, 'shrt-frontend-staging')]].Id" --output text 2>/dev/null || echo "")
PRODUCTION_DIST_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[?contains(DomainName, 'shrt-frontend-production')]].Id" --output text 2>/dev/null || echo "")

if [[ -n "$STAGING_DIST_ID" && "$STAGING_DIST_ID" != "None" ]]; then
    echo "✅ Distribución CloudFront Staging encontrada: $STAGING_DIST_ID"
else
    echo "ℹ️ No se encontró distribución CloudFront para staging (se creará automáticamente)"
    STAGING_DIST_ID=""
fi

if [[ -n "$PRODUCTION_DIST_ID" && "$PRODUCTION_DIST_ID" != "None" ]]; then
    echo "✅ Distribución CloudFront Production encontrada: $PRODUCTION_DIST_ID"
else
    echo "ℹ️ No se encontró distribución CloudFront para production (se creará automáticamente)"
    PRODUCTION_DIST_ID=""
fi

# Configurar secrets en GitHub
echo "🔑 Configurando GitHub Secrets..."

# AWS Credentials (requeridos)
echo "Setting AWS_ACCESS_KEY_ID..."
echo "$AWS_ACCESS_KEY_ID" | gh secret set AWS_ACCESS_KEY_ID

echo "Setting AWS_SECRET_ACCESS_KEY..."
echo "$AWS_SECRET_ACCESS_KEY" | gh secret set AWS_SECRET_ACCESS_KEY

# CloudFront Distribution IDs (opcionales)
if [[ -n "$STAGING_DIST_ID" ]]; then
    echo "Setting CLOUDFRONT_DISTRIBUTION_STAGING..."
    echo "$STAGING_DIST_ID" | gh secret set CLOUDFRONT_DISTRIBUTION_STAGING
fi

if [[ -n "$PRODUCTION_DIST_ID" ]]; then
    echo "Setting CLOUDFRONT_DISTRIBUTION_PRODUCTION..."
    echo "$PRODUCTION_DIST_ID" | gh secret set CLOUDFRONT_DISTRIBUTION_PRODUCTION
fi

echo ""
echo "✅ Configuración completada!"
echo ""
echo "📋 Secrets configurados:"
echo "   ✓ AWS_ACCESS_KEY_ID"
echo "   ✓ AWS_SECRET_ACCESS_KEY"
[[ -n "$STAGING_DIST_ID" ]] && echo "   ✓ CLOUDFRONT_DISTRIBUTION_STAGING: $STAGING_DIST_ID"
[[ -n "$PRODUCTION_DIST_ID" ]] && echo "   ✓ CLOUDFRONT_DISTRIBUTION_PRODUCTION: $PRODUCTION_DIST_ID"
echo ""

if [[ -z "$STAGING_DIST_ID" || -z "$PRODUCTION_DIST_ID" ]]; then
    echo "ℹ️ Las distribuciones CloudFront faltantes se crearán automáticamente en el primer deployment."
fi

echo "🚀 El proyecto está listo para deployments automáticos!"
echo "   • Push a 'develop' → Deployment a Staging"
echo "   • Push a 'main' → Deployment a Production"