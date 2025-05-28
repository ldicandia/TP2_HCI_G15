# 🥭 Mango App

Este repositorio contiene dos proyectos:

- **API_HCI**: servidor REST en Node/Express + TypeScript  
- **billetera_mango**: cliente Vue 3 + Vuetify + Pinia

---

## Prerrequisitos

- Node.js ≥ 16  
- npm o yarn  
- Git

---

## 1) Back-end: API_HCI

```bash
cd API_HCI
```

1. Instala dependencias  
   ```bash
   npm install
   ```

2. Configura variables de entorno como dice en `API_HCI\README.txt`


3. Correr la API
   ```bash
   npm run api
   ```


---

## 2) Front-end: billetera_mango

```bash
cd billetera_mango
```

1. Instala dependencias  
   ```bash
   npm install
   ```

2. Asegúrate de que la API esté corriendo en `http://localhost:8080`.

3. Ejecuta en desarrollo  
   ```bash
   npm run dev
   # accede en http://localhost:3000
   ```
4. Para probar que el link de pago funciona abrir otra terminal y ejecutar:
   ```bash
   npm run dev
   # accede en http://localhost:3001
   ```
---

## 3) Navegadores Soportados 

✔️ Chrome ≥ 61

✔️ Firefox ≥ 60

✔️ Edge ≥ 79 (Chromium-based)

✔️ Safari ≥ 11

✔️ Opera ≥ 48

## Estructura de carpetas

- `/API_HCI` → código del servidor
- `/billetera_mango` → cliente Vue 3
  - `src/` → componentes, páginas, stores, API wrappers…
  - `vite.config.mjs` → alias `@` → `src/`
  - `.env` no es necesario: el baseUrl está en `src/api/api.js`

