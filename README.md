# ChatBot

Una aplicación de ChatBot construida con Vue 3, Vite y servicios serverless de AWS.

**Demo en vivo:** https://d273m1rugj2sd0.cloudfront.net/

## Autores

- Adrián Riera Granada
- Raúl González Alguacil
- Itai Picornell Cortés
- Isaac Cabrera Remacho

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
- **Computación:** AWS Lambda (Python 3.14)
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

## 🗄️ Decisiones de Arquitectura de Base de Datos

### NoSQL vs SQL: Comparación Directa

Antes de profundizar en las razones, veamos una comparación directa entre ambos paradigmas para este caso de uso específico:

| Aspecto | SQL (Relacional) | NoSQL (DynamoDB) | ✅ Ganador |
|---------|------------------|------------------|-----------|
| **Esquema** | Rígido, requiere migraciones | Flexible, sin migraciones | NoSQL |
| **Escalabilidad** | Vertical (límites físicos) | Horizontal (ilimitada) | NoSQL |
| **Latencia** | Variable (10-100ms) | Garantizada (<10ms) | NoSQL |
| **Joins** | Soportados nativamente | No soportados | SQL* |
| **Transacciones ACID** | Multi-tabla completas | Limitadas a ítems | SQL* |
| **Administración** | Requiere DBA, mantenimiento | Completamente gestionado | NoSQL |
| **Costo inicial** | Alto (servidor siempre activo) | Bajo (pago por uso) | NoSQL |
| **Integración AWS** | Requiere RDS, VPC, etc. | Nativa, sin configuración | NoSQL |
| **Curva de aprendizaje** | Compleja (SQL, índices, etc.) | Simple (key-value) | NoSQL |
| **Modelo de datos** | Normalizado (múltiples tablas) | Desnormalizado (documentos) | NoSQL |

**Nota:** Los aspectos marcados con * son ventajas de SQL, pero **no son necesarios** para una aplicación de chat simple.

### ¿Por qué NoSQL en lugar de SQL?

La elección de una base de datos NoSQL sobre una base de datos SQL relacional tradicional para este proyecto se fundamenta en varios factores técnicos y arquitectónicos que se alinean perfectamente con los requisitos de una aplicación de chat moderna:

#### 1. **Flexibilidad del Esquema**

Las bases de datos NoSQL ofrecen esquemas flexibles que permiten almacenar datos sin una estructura rígida predefinida. En una aplicación de chat, esto es especialmente valioso porque:

- Los mensajes pueden evolucionar para incluir diferentes tipos de contenido (texto, imágenes, archivos adjuntos, reacciones, etc.) sin necesidad de migraciones complejas de base de datos
- Diferentes modelos de IA pueden requerir metadatos específicos que varían entre sí
- La adición de nuevas características (como hilos de conversación, menciones, o etiquetas) no requiere modificar el esquema existente

#### 2. **Escalabilidad Horizontal**

Las bases de datos NoSQL están diseñadas desde el principio para escalar horizontalmente, lo cual es crucial para aplicaciones que pueden experimentar un crecimiento rápido:

- **Particionamiento automático**: Los datos se distribuyen automáticamente entre múltiples servidores
- **Sin límites de escalado**: Puedes añadir más nodos según sea necesario sin interrupciones del servicio
- **Rendimiento predecible**: El rendimiento se mantiene constante independientemente del volumen de datos

En contraste, las bases de datos SQL tradicionales escalan verticalmente (añadiendo más recursos a un único servidor), lo cual tiene límites físicos y económicos.

#### 3. **Modelo de Datos Orientado a Documentos**

Los mensajes de chat son inherentemente documentos auto-contenidos con toda la información necesaria:

```json
{
  "id": "mensaje-123",
  "userEmail": "usuario@ejemplo.com",
  "message": "Contenido del mensaje",
  "model": "gpt4",
  "timestamp": 1705251600000,
  "createdAt": "2024-01-14T18:00:00Z"
}
```

Este modelo se mapea naturalmente a NoSQL, donde cada mensaje es un documento independiente, en lugar de estar fragmentado en múltiples tablas relacionales.

#### 4. **Rendimiento en Operaciones de Lectura/Escritura**

Las aplicaciones de chat requieren operaciones de escritura extremadamente rápidas:

- **Baja latencia**: NoSQL puede ofrecer latencias de milisegundos para operaciones de lectura y escritura
- **Alto throughput**: Capacidad para manejar miles de mensajes por segundo
- **Sin joins complejos**: Las consultas son más simples y rápidas al no requerir uniones entre tablas

#### 5. **Arquitectura Serverless y Cloud-Native**

NoSQL se integra perfectamente con arquitecturas serverless modernas:

- No requiere gestión de conexiones persistentes (problemático en Lambda)
- Facturación basada en uso real (pay-per-request)
- Auto-escalado automático sin intervención manual
- Alta disponibilidad integrada sin configuración adicional

#### 6. **Simplicidad de Consultas**

Para una aplicación de chat, las consultas típicas son simples:

- Obtener mensajes por usuario
- Obtener mensajes por modelo
- Obtener mensajes en un rango de tiempo

Estas consultas no requieren las capacidades complejas de JOIN, transacciones ACID multi-tabla, o consultas relacionales avanzadas que justificarían el uso de SQL.

### ⚡ ¿Por qué DynamoDB Específicamente?

Una vez decidido el uso de NoSQL, la elección de **AWS DynamoDB** sobre otras alternativas se basa en ventajas específicas para este proyecto:

#### Comparación con Alternativas NoSQL

| Característica | DynamoDB | MongoDB Atlas | Cassandra | Redis | Firestore |
|----------------|----------|---------------|-----------|-------|-----------|
| **Gestión completa** | ✅ 100% Managed | ⚠️ Parcial | ❌ Self-hosted | ⚠️ ElastiCache | ✅ Managed |
| **Integración AWS** | ✅ Nativa | ❌ Terceros | ❌ Terceros | ⚠️ ElastiCache | ❌ Google Cloud |
| **Escalado automático** | ✅ Automático | ⚠️ Limitado | ❌ Manual | ⚠️ Limitado | ✅ Automático |
| **Facturación** | ✅ Pay-per-request | ❌ Por instancia | ❌ Por servidor | ❌ Por instancia | ✅ Pay-per-use |
| **Latencia garantizada** | ✅ <10ms SLA | ⚠️ Variable | ⚠️ Variable | ✅ <1ms | ⚠️ Variable |
| **Persistencia** | ✅ Durable | ✅ Durable | ✅ Durable | ⚠️ Opcional | ✅ Durable |
| **Free Tier** | ✅ 25GB permanente | ⚠️ 512MB temporal | ❌ No | ⚠️ Limitado | ✅ 1GB permanente |
| **Curva de aprendizaje** | ✅ Baja | ⚠️ Media | ❌ Alta | ✅ Baja | ✅ Baja |
| **Backups automáticos** | ✅ Point-in-time | ⚠️ Configuración | ❌ Manual | ❌ Manual | ✅ Automático |
| **Multi-región** | ✅ Global Tables | ⚠️ Atlas clusters | ✅ Nativo | ❌ Manual | ✅ Multi-región |

**Conclusión:** DynamoDB ofrece la mejor combinación de facilidad de uso, integración con AWS, y costo-efectividad para este proyecto.

#### Ventajas Clave de DynamoDB

#### 1. **Integración Nativa con el Ecosistema AWS**

DynamoDB forma parte del ecosistema de AWS, lo que proporciona ventajas significativas:

- **Integración perfecta con Lambda**: Conexión directa sin necesidad de gestionar conexiones de red
- **IAM para autenticación**: Uso de roles y políticas de IAM en lugar de credenciales de base de datos
- **VPC no requerido**: Acceso directo desde Lambda sin configuración de red compleja
- **CloudWatch integrado**: Monitorización y logs automáticos sin configuración adicional
- **Consistencia del stack**: Todo el proyecto utiliza servicios AWS (Cognito, API Gateway, Lambda, S3, CloudFront)

#### 2. **Modelo de Facturación Flexible**

DynamoDB ofrece dos modelos de facturación que se adaptan perfectamente a diferentes fases del proyecto:

- **On-Demand**: Ideal para desarrollo y aplicaciones con tráfico impredecible
  - Pagas solo por las lecturas/escrituras que realizas
  - Sin necesidad de planificar capacidad
  - Perfecto para proyectos académicos o en fase inicial
  
- **Provisioned Capacity**: Para producción con tráfico predecible
  - Costos más bajos con volúmenes consistentes
  - Auto-scaling disponible

#### 3. **Rendimiento Garantizado**

DynamoDB ofrece garantías de rendimiento que otras soluciones NoSQL no proporcionan:

- **Latencia de un dígito en milisegundos**: Garantizada a cualquier escala
- **SLA del 99.99%**: Disponibilidad garantizada por contrato
- **Rendimiento consistente**: No se degrada con el crecimiento de datos
- **Capacidad ilimitada**: Sin límites prácticos de almacenamiento

#### 4. **Cero Administración de Infraestructura**

DynamoDB es completamente gestionado (fully managed):

- **Sin servidores que mantener**: No hay instancias de base de datos que parchear o actualizar
- **Backups automáticos**: Point-in-time recovery incluido
- **Replicación multi-región**: Disponible con un clic si se necesita
- **Escalado automático**: Sin intervención manual necesaria
- **Alta disponibilidad**: Replicación automática en múltiples zonas de disponibilidad

Esto es especialmente valioso para proyectos académicos o startups donde el tiempo de desarrollo es limitado y no se puede dedicar recursos a administración de bases de datos.

#### 5. **Seguridad Integrada**

DynamoDB proporciona características de seguridad robustas sin configuración compleja:

- **Encriptación en reposo**: Habilitada por defecto con AWS KMS
- **Encriptación en tránsito**: Todas las comunicaciones sobre HTTPS/TLS
- **Control de acceso granular**: Políticas IAM a nivel de tabla, ítem o atributo
- **Auditoría completa**: AWS CloudTrail registra todas las operaciones

#### 6. **Modelo de Datos Simple y Efectivo**

Para este caso de uso específico, el modelo de clave-valor de DynamoDB es ideal:

- **Partition Key**: `id` (UUID único del mensaje)
- **Atributos flexibles**: Todos los demás campos sin restricciones de esquema
- **Índices secundarios**: Disponibles si necesitamos consultar por `userEmail` o `model`

No necesitamos las capacidades de consulta complejas de MongoDB o la arquitectura distribuida de Cassandra.

#### 7. **Ecosistema y Herramientas**

DynamoDB cuenta con un ecosistema maduro:

- **AWS SDK**: Disponible en todos los lenguajes principales (Python, JavaScript, Java, etc.)
- **DynamoDB Streams**: Para procesamiento de eventos en tiempo real si se necesita
- **DAX (DynamoDB Accelerator)**: Caché en memoria si se requiere microsegundos de latencia
- **AWS Console**: Interfaz web intuitiva para desarrollo y debugging
- **Local DynamoDB**: Versión local para desarrollo sin costos

#### 8. **Costo-Efectividad para el Caso de Uso**

Para una aplicación de chat con volumen moderado:

- **Free Tier**: 25 GB de almacenamiento y 25 WCU/RCU gratuitos permanentemente
- **Almacenamiento económico**: $0.25 por GB/mes (mucho más barato que mantener servidores)
- **Sin costos ocultos**: No hay costos de licencias, mantenimiento o administración

### 📊 Resumen: ¿Por qué DynamoDB?

La elección de DynamoDB para este proyecto no es simplemente una preferencia, sino una decisión arquitectónica fundamentada que aprovecha:

#### ✅ Ventajas de NoSQL para Aplicaciones de Chat

1. **Flexibilidad de esquema** → Evolución sin migraciones complejas
2. **Escalabilidad horizontal** → Crecimiento ilimitado sin interrupciones
3. **Rendimiento predecible** → Latencia constante a cualquier escala
4. **Modelo de documentos** → Mensajes auto-contenidos sin JOINs

#### ⚡ Ventajas Específicas de DynamoDB

1. **Integración perfecta con AWS** → Arquitectura serverless coherente
2. **Cero administración** → Enfoque en desarrollo, no en infraestructura
3. **Modelo de costos flexible** → Pay-per-request ideal para proyectos iniciales
4. **Rendimiento garantizado** → SLA de 99.99% con latencia <10ms
5. **Seguridad integrada** → Encriptación y control de acceso sin configuración

#### 🎯 Resultado Final

Esta combinación hace que **DynamoDB sea la opción óptima** para construir una aplicación de chat moderna, escalable y mantenible en AWS, permitiendo:

- ⚡ **Desarrollo rápido** sin preocupaciones de infraestructura
- 📈 **Escalabilidad automática** desde cero hasta millones de usuarios
- 💰 **Costos optimizados** pagando solo por lo que se usa
- 🔒 **Seguridad robusta** con mejores prácticas integradas
- 🔧 **Mantenimiento mínimo** para enfocarse en nuevas características


## 🔧 Función Lambda de AWS

El backend utiliza una función Lambda en Python para gestionar el almacenamiento de mensajes:

**Funcionalidad:**
- Recibe peticiones POST con datos de mensajes
- Valida campos requeridos
- Genera IDs únicos de mensaje usando UUID
- Almacena mensajes en DynamoDB con metadatos
- Devuelve respuestas de éxito/error con códigos HTTP apropiados

### 📋 Esquema de DynamoDB: Campos Utilizados

Cada mensaje almacenado en DynamoDB contiene los siguientes campos:

| Campo | Tipo | Ejemplo | Propósito Principal |
|-------|------|---------|---------------------|
| **id** | String (UUID) | `"550e8400-e29b-41d4-a716-446655440000"` | 🔑 **Partition Key** - Identificador único del mensaje |
| **userEmail** | String | `"usuario@ejemplo.com"` | 👤 Identificar al usuario que envió el mensaje |
| **message** | String | `"¿Cómo funciona DynamoDB?"` | 💬 Contenido del mensaje del usuario |
| **model** | String | `"gpt4"` / `"claude"` / `"gemini"` | 🤖 Modelo de IA seleccionado |
| **timestamp** | Number | `1705251600000` | ⏱️ Marca de tiempo Unix (para ordenamiento) |
| **createdAt** | String (ISO 8601) | `"2024-01-14T18:00:00.000Z"` | 📅 Fecha legible por humanos |

**Ejemplo completo de un mensaje:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userEmail": "usuario@ejemplo.com",
  "message": "¿Cómo funciona DynamoDB?",
  "model": "gpt4",
  "timestamp": 1705251600000,
  "createdAt": "2024-01-14T18:00:00.000Z"
}
```

### Justificación de los Campos del Esquema

Cada campo almacenado en DynamoDB ha sido cuidadosamente seleccionado para cumplir con requisitos funcionales y técnicos específicos:

#### 🔑 **id** (String - UUID)

**Propósito:** Clave de partición (Partition Key) de DynamoDB e identificador único del mensaje.

**Justificación:**
- **Unicidad garantizada**: Los UUIDs (Universally Unique Identifiers) garantizan que cada mensaje tenga un identificador único sin necesidad de coordinación entre servidores o consultas a la base de datos
- **Distribución uniforme**: Los UUIDs aleatorios aseguran una distribución uniforme de los datos entre las particiones de DynamoDB, evitando "hot partitions" que degradarían el rendimiento
- **Escalabilidad**: Permite la generación de IDs en el lado del servidor (Lambda) sin riesgo de colisiones, incluso con miles de escrituras concurrentes
- **Trazabilidad**: Facilita el seguimiento de mensajes específicos en logs, debugging y auditorías
- **Idempotencia**: Permite implementar operaciones idempotentes si se necesita reenviar mensajes

**Tipo de dato:** String en lugar de número porque los UUIDs son alfanuméricos (ej: `550e8400-e29b-41d4-a716-446655440000`)

#### 👤 **userEmail** (String)

**Propósito:** Identificador del usuario que envió el mensaje.

**Justificación:**
- **Identificación de usuario**: Vincula cada mensaje con el usuario autenticado que lo creó
- **Integración con Cognito**: AWS Cognito utiliza el email como identificador principal del usuario, manteniendo consistencia en todo el sistema
- **Consultas futuras**: Permite crear índices secundarios (GSI) para consultar todos los mensajes de un usuario específico
- **Auditoría y compliance**: Necesario para cumplir con requisitos de trazabilidad y auditoría (saber quién dijo qué y cuándo)
- **Funcionalidades futuras**: Habilita características como historial de conversaciones por usuario, estadísticas de uso, o filtrado de contenido
- **Seguridad**: Permite implementar controles de acceso a nivel de datos (los usuarios solo pueden ver sus propios mensajes)

**Tipo de dato:** String para almacenar direcciones de email completas (ej: `usuario@ejemplo.com`)

#### 💬 **message** (String)

**Propósito:** Contenido textual del mensaje enviado por el usuario.

**Justificación:**
- **Contenido principal**: Es el dato fundamental de la aplicación - el mensaje real que el usuario quiere enviar al modelo de IA
- **Persistencia de conversaciones**: Permite almacenar el historial completo de interacciones para referencia futura
- **Análisis y mejora**: Posibilita análisis de patrones de uso, tipos de preguntas frecuentes, o mejoras en la experiencia de usuario
- **Recuperación ante fallos**: Si hay un error al procesar el mensaje, este queda almacenado y puede ser reprocesado
- **Funcionalidades futuras**: Habilita búsqueda de texto completo, análisis de sentimiento, o detección de contenido inapropiado
- **Compliance y legal**: Necesario para cumplir con requisitos legales de retención de datos o investigaciones

**Tipo de dato:** String con capacidad para almacenar texto de longitud variable (DynamoDB soporta hasta 400 KB por ítem)

#### 🤖 **model** (String)

**Propósito:** Identificador del modelo de IA seleccionado por el usuario para procesar el mensaje.

**Justificación:**
- **Contexto de la conversación**: Registra qué modelo de IA estaba usando el usuario en ese momento (GPT-4, Claude, Gemini, etc.)
- **Segmentación de datos**: Permite agrupar y analizar mensajes por modelo para comparar patrones de uso
- **Facturación diferenciada**: Si en el futuro se implementa facturación, diferentes modelos pueden tener costos distintos
- **Análisis de rendimiento**: Permite evaluar qué modelos son más populares o efectivos para ciertos tipos de consultas
- **Funcionalidades futuras**: Habilita características como "continuar conversación con el mismo modelo" o "comparar respuestas entre modelos"
- **Debugging**: Facilita la identificación de problemas específicos de un modelo particular
- **Índices secundarios**: Permite crear GSI para consultar todos los mensajes enviados a un modelo específico

**Tipo de dato:** String para almacenar identificadores de modelo (ej: `"gpt4"`, `"claude"`, `"gemini"`)

#### ⏱️ **timestamp** (Number)

**Propósito:** Marca de tiempo en formato Unix (milisegundos desde epoch) del momento de creación del mensaje.

**Justificación:**
- **Ordenamiento eficiente**: Los números se ordenan más eficientemente que las cadenas en DynamoDB, crucial para consultas de rango temporal
- **Rendimiento de consultas**: Permite consultas rápidas como "mensajes de las últimas 24 horas" o "mensajes entre dos fechas"
- **Índices de ordenamiento**: Puede usarse como Sort Key en índices secundarios para ordenar mensajes cronológicamente
- **Cálculos temporales**: Facilita cálculos como tiempo entre mensajes, frecuencia de uso, o patrones de actividad
- **Time-To-Live (TTL)**: DynamoDB puede usar campos numéricos de timestamp para eliminar automáticamente mensajes antiguos si se configura TTL
- **Compatibilidad universal**: El formato Unix timestamp es estándar en programación y fácil de convertir en cualquier lenguaje
- **Precisión**: Milisegundos permiten ordenar mensajes incluso si varios se crean en el mismo segundo

**Tipo de dato:** Number (ej: `1705251600000` = 14 de enero de 2024, 18:00:00 GMT)

#### 📅 **createdAt** (String - ISO 8601)

**Propósito:** Representación legible por humanos de la fecha y hora de creación del mensaje.

**Justificación:**
- **Legibilidad humana**: Formato fácil de leer y entender sin necesidad de conversión (ej: `"2024-01-14T18:00:00Z"`)
- **Debugging y logs**: Facilita la depuración al mostrar fechas en formato comprensible directamente en la consola de AWS o logs
- **Internacionalización**: El formato ISO 8601 es un estándar internacional que incluye zona horaria
- **Auditoría**: Útil para reportes y auditorías donde se necesita mostrar fechas en formato legible
- **Compatibilidad**: Muchas bibliotecas de frontend pueden parsear directamente ISO 8601 sin conversiones adicionales
- **Redundancia intencional**: Aunque `timestamp` contiene la misma información, tener ambos formatos evita conversiones repetidas y posibles errores
- **Zona horaria explícita**: El formato ISO 8601 incluye la zona horaria (Z = UTC), evitando ambigüedades

**Tipo de dato:** String en formato ISO 8601 con zona horaria UTC (ej: `"2024-01-14T18:00:00.000Z"`)

### 🎯 Resumen de Ventajas por Campo

| Campo | Ventaja Principal | Ventaja Secundaria | Ventaja Técnica |
|-------|-------------------|--------------------|--------------------|
| **id** | 🔑 Partition Key óptima | Distribución uniforme | Sin colisiones en escrituras concurrentes |
| **userEmail** | 👤 Identificación de usuario | Integración con Cognito | Permite índices GSI por usuario |
| **message** | 💬 Dato principal | Persistencia de historial | Análisis y búsqueda futura |
| **model** | 🤖 Contexto de IA | Segmentación de datos | Análisis de uso por modelo |
| **timestamp** | ⏱️ Ordenamiento eficiente | Consultas de rango rápidas | Compatible con TTL de DynamoDB |
| **createdAt** | 📅 Legibilidad humana | Debugging facilitado | Sin conversiones en frontend |

**Beneficio del diseño:** Este esquema combina eficiencia técnica (UUID, timestamp numérico) con usabilidad (email, createdAt legible), optimizando tanto el rendimiento como la experiencia de desarrollo.


### Diseño del Esquema: Principios Aplicados

El diseño de este esquema sigue varios principios de mejores prácticas:

1. **Desnormalización intencional**: Almacenamos tanto `timestamp` (número) como `createdAt` (string) para optimizar diferentes casos de uso sin necesidad de conversiones en tiempo de ejecución

2. **Campos autocontenidos**: Cada ítem contiene toda la información necesaria sin depender de otras tablas, siguiendo el patrón NoSQL de evitar JOINs

3. **Preparación para escalabilidad**: El uso de UUID como partition key asegura distribución uniforme de datos, crítico para escalar a millones de mensajes

4. **Trazabilidad completa**: La combinación de `id`, `userEmail`, `timestamp` y `createdAt` proporciona trazabilidad completa de cada mensaje

5. **Flexibilidad futura**: El esquema permite añadir nuevos campos sin migraciones (ej: `aiResponse`, `sentiment`, `language`, etc.) gracias a la naturaleza schema-less de DynamoDB

6. **Optimización de consultas**: Los campos están diseñados para soportar índices secundarios globales (GSI) comunes como:
   - GSI por `userEmail` + `timestamp` (mensajes de un usuario ordenados cronológicamente)
   - GSI por `model` + `timestamp` (mensajes por modelo ordenados cronológicamente)

Este diseño equilibra las necesidades actuales de la aplicación con la flexibilidad para evolucionar sin cambios disruptivos en el esquema.

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

