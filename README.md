# Keep Alive — Alquemis

App PWA de una sola página que escribe un "ping" (fecha/hora) en 3 bases de
datos Supabase para evitar que se pausen por 7 días de inactividad.

## 1. Configura las 3 bases de datos

Abre el **SQL Editor** de cada uno de los 3 proyectos y ejecuta el contenido
de `sql/keep_alive_setup.sql` (es el mismo bloque para las 3):

- Listerfy → https://onbexzwvbnumwuawesuu.supabase.co
- Presentaciones → https://pmeikbypkfemorfxdmsm.supabase.co
- Timeline KL → https://utkqzxsnyvblqndtkntx.supabase.co

Esto crea la tabla `keep_alive_pings` y las políticas RLS necesarias para
que la app (con la anon key, pública por diseño) pueda insertar y leer solo
en esa tabla.

## 2. Sube esta carpeta a GitHub

Estructura del repo (tal cual está aquí):

```
index.html
manifest.json
sw.js
icons/
sql/keep_alive_setup.sql
.github/workflows/keep-alive.yml
```

## 3. Activa GitHub Pages

Settings → Pages → Deploy from branch → `main` / `root`. Cuando esté listo,
la URL de Pages abrirá directamente `index.html` (funciona como PWA:
"Agregar a pantalla de inicio" desde el navegador móvil).

## 4. Respaldo automático (GitHub Actions)

El workflow `.github/workflows/keep-alive.yml` corre cada 3 días (y también
se puede lanzar manualmente desde la pestaña **Actions → Keep Alive
Supabase → Run workflow**) y hace ping a las 3 bases aunque nadie abra la
app. Las claves usadas son las mismas anon/publishable keys que ya están en
`index.html` (están pensadas para ser públicas; el control real de acceso
lo da RLS), así que no se necesitan GitHub Secrets.

## Notas

- El botón "Keep Alive" en la app inserta un registro con `source: manual`
  en las 3 bases y muestra si tuvo éxito en las 3.
- El historial combina los últimos registros de las 3 bases (manuales +
  automáticos) ordenados por fecha.
- Cada tarjeta de estado muestra cuántos de los 7 días de margen han pasado
  desde el último ping de esa base (verde < 4 días, ámbar 4-6 días, rojo ≥ 6).
