# Vue Chat Replica

Una aplicación de chat moderna construida con Vue 3, Vite y servicios serverless de AWS.

**Demo en vivo:** https://d273m1rugj2sd0.cloudfront.net/

## Autores

- Adrián Riera Granada
- Raúl González Alguacil

## Descripción General

Este proyecto es una aplicación de chat full-stack que demuestra la integración de frameworks frontend modernos con servicios en la nube de AWS. La aplicación cuenta con autenticación de usuarios, manejo de mensajes en tiempo real y almacenamiento persistente utilizando una arquitectura serverless.

## Características

- Autenticación de usuarios con AWS Cognito (OAuth 2.0)
- Interfaz de chat moderna con tema oscuro
- Selección de múltiples modelos de IA (GPT-4, Claude, Gemini)
- Persistencia de mensajes con AWS DynamoDB
- Arquitectura backend serverless
- Diseño responsive
- Gestión segura de credenciales

## Stack Tecnológico

### Frontend
- **Framework:** Vue 3 con Composition API
- **Herramienta de Build:** Vite
- **Enrutamiento:** Vue Router
- **Autenticación:** AWS Cognito con OAuth 2.0
- **Estilos:** CSS Vanilla

### Backend
- **API Gateway:** AWS API Gateway (REST API)
- **Computación:** AWS Lambda (Python 3.x)
- **Base de Datos:** AWS DynamoDB
- **Autenticación:** AWS Cognito User Pools

### Despliegue
- **Hosting:** AWS S3 + CloudFront CDN
- **Región:** eu-south-2 (Europa - España)

## Arquitectura

```
┌─────────────┐
│  Navegador  │
└──────┬──────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       v                                 v
┌──────────────┐                 ┌──────────────┐
│   CloudFront │                 │   Cognito    │
│  (Frontend)  │                 │ (Auth/Users) │
└──────┬───────┘                 └──────────────┘
       │
       v
┌──────────────┐
│ API Gateway  │
└──────┬───────┘
       │
       v
┌──────────────┐       ┌──────────────┐
│    Lambda    │──────>│  DynamoDB    │
│   (Python)   │       │  (Mensajes)  │
└──────────────┘       └──────────────┘
```

## Función Lambda de AWS

El backend utiliza una función Lambda en Python para gestionar el almacenamiento de mensajes:

**Funcionalidad:**
- Recibe peticiones POST con datos de mensajes
- Valida campos requeridos
- Genera IDs únicos de mensaje usando UUID
- Almacena mensajes en DynamoDB con metadatos
- Devuelve respuestas de éxito/error con códigos HTTP apropiados

**Esquema de DynamoDB:**
```json
{
  "id": "uuid",
  "userEmail": "string",
  "message": "string",
  "model": "string",
  "timestamp": "number",
  "createdAt": "ISO 8601 string"
}
```

## Requisitos Previos

- Node.js 16+ y npm
- Cuenta de AWS con los siguientes servicios configurados:
  - Cognito User Pool
  - API Gateway
  - Función Lambda
  - Tabla DynamoDB
  - Bucket S3
  - Distribución CloudFront

## Configuración para Desarrollo Local

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd vue-chat-replica
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo de entorno y completa tus credenciales de AWS:

```bash
cp .env.example .env.development
```

Edita `.env.development` con tus valores reales:

```env
VITE_COGNITO_AUTHORITY=https://cognito-idp.REGION.amazonaws.com/REGION_USER_POOL_ID
VITE_COGNITO_CLIENT_ID=tu_client_id_aqui
VITE_COGNITO_DOMAIN=https://tu-dominio.auth.REGION.amazoncognito.com
VITE_API_BASE_URL=https://tu-api-id.execute-api.REGION.amazonaws.com
VITE_REDIRECT_URI=http://localhost:5173/
VITE_POST_LOGOUT_REDIRECT_URI=http://localhost:5173/
```

### 4. Ejecutar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`

## Build de Producción

### Construir la aplicación

```bash
npm run build
```

Los archivos listos para producción se generarán en el directorio `dist/`.

### Desplegar en AWS

1. Sube el contenido de la carpeta `dist/` a tu bucket S3
2. Invalida la caché de CloudFront para servir la nueva versión

```bash
aws s3 sync dist/ s3://nombre-de-tu-bucket --delete
aws cloudfront create-invalidation --distribution-id TU_DISTRIBUTION_ID --paths "/*"
```

## Guía de Configuración de AWS

### Configuración de Cognito User Pool

1. Crea un User Pool en AWS Cognito
2. Configura los siguientes ajustes:
   - Opciones de inicio de sesión: Email
   - Política de contraseñas: Según tus requisitos
   - MFA: Opcional
3. Crea un App Client:
   - Tipo: Cliente público
   - Flujos de autenticación: ALLOW_USER_SRP_AUTH
   - Tipos de concesión OAuth 2.0: Authorization code grant
   - Scopes OAuth: email, openid, profile
4. Configura Hosted UI:
   - Dominio: Crea un dominio de Cognito
   - URLs de callback: Añade las URLs de tu aplicación
   - URLs de cierre de sesión: Añade las URLs de tu aplicación

### Configuración de API Gateway

1. Crea una REST API
2. Crea un recurso `/messages`
3. Añade un método POST
4. Habilita CORS
5. Despliega en un stage (ej. `prod`)

### Configuración de Función Lambda

1. Crea una función Lambda con Python 3.x
2. Añade el código Lambda proporcionado
3. Configura el rol IAM con permisos de DynamoDB
4. Establece el timeout a al menos 10 segundos
5. Conecta con API Gateway como integración

### Configuración de Tabla DynamoDB

1. Crea una tabla con:
   - Nombre de tabla: `ProyectoFinalAccesoADatos`
   - Clave de partición: `id` (String)
   - Modo de facturación bajo demanda recomendado

## Estructura del Proyecto

```
vue-chat-replica/
├── src/
│   ├── components/          # Componentes Vue reutilizables
│   │   ├── AuthLayout.vue   # Layout de páginas de autenticación
│   │   ├── Button.vue       # Componente de botón personalizado
│   │   ├── InputBar.vue     # Componente de entrada de mensajes
│   │   ├── MainLayout.vue   # Layout principal de la app
│   │   ├── MessageBubble.vue # Componente de mensaje de chat
│   │   └── ModelSelector.vue # Selector de modelo de IA
│   ├── views/               # Componentes de página
│   │   ├── ChatView.vue     # Interfaz principal de chat
│   │   ├── LoginView.vue    # Página de inicio de sesión
│   │   └── RegisterView.vue # Página de registro
│   ├── router/              # Configuración de Vue Router
│   │   └── index.js
│   ├── services/            # Capa de servicios API
│   │   └── chatService.js   # Integración con API de chat
│   ├── composables/         # Composables de Vue
│   │   └── useAuth.js       # Lógica de autenticación
│   ├── plugins/             # Plugins de Vue
│   │   └── authPlugin.js    # Configuración del plugin de auth
│   ├── assets/              # Assets estáticos
│   ├── style.css            # Estilos globales
│   ├── App.vue              # Componente raíz
│   └── main.js              # Punto de entrada de la aplicación
├── public/                  # Archivos estáticos públicos
├── dist/                    # Salida del build de producción
├── .env.example             # Plantilla de variables de entorno
├── .gitignore               # Reglas de Git ignore
├── index.html               # Punto de entrada HTML
├── package.json             # Dependencias NPM
├── vite.config.js           # Configuración de Vite
└── README.md                # Este archivo
```

## Consideraciones de Seguridad

**Importante:** Nunca hagas commit de credenciales sensibles al control de versiones.

Los siguientes archivos están excluidos de Git mediante `.gitignore`:
- `.env.development` - Contiene credenciales de desarrollo
- `.env.production` - Contiene credenciales de producción
- `node_modules/` - Dependencias
- `dist/` - Artefactos de build

Utiliza siempre el archivo `.env.example` como plantilla y crea tus propios archivos de entorno localmente.

## Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Iniciar servidor de desarrollo
```

### Producción
```bash
npm run build        # Construir para producción
npm run preview      # Previsualizar build de producción localmente
```

## Endpoints de la API

### POST /messages

Almacena un mensaje de chat en DynamoDB.

**Cuerpo de la Petición:**
```json
{
  "userEmail": "usuario@ejemplo.com",
  "message": "¡Hola, mundo!",
  "model": "gpt4"
}
```

**Respuesta (Éxito):**
```json
{
  "success": true,
  "messageId": "uuid-aqui",
  "message": "Mensaje guardado exitosamente"
}
```

**Respuesta (Error):**
```json
{
  "error": "Descripción del mensaje de error"
}
```

## Solución de Problemas

### Problemas de Autenticación

Si encuentras errores de "No matching state found in storage":
1. Verifica que tus URLs de callback de Cognito coincidan exactamente con las URLs de tu aplicación
2. Comprueba que el dominio de Cognito esté configurado correctamente
3. Asegúrate de que las cookies estén habilitadas en tu navegador

### Problemas de Conexión con la API

Si los mensajes no se están guardando:
1. Verifica que `VITE_API_BASE_URL` esté configurado correctamente
2. Comprueba la configuración de CORS en API Gateway
3. Revisa los logs de la función Lambda en CloudWatch
4. Verifica los permisos de la tabla DynamoDB

### Problemas de Build

Si el build falla:
1. Limpia node_modules y reinstala: `rm -rf node_modules && npm install`
2. Limpia la caché de Vite: `rm -rf node_modules/.vite`
3. Asegúrate de que todas las variables de entorno estén configuradas

## Licencia

MIT

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, siéntete libre de enviar un Pull Request.

## Soporte

Para problemas y preguntas, por favor abre un issue en el repositorio de GitHub.
