# TDD

---

---

## Análisis de requisitos

Montaremos una API para un Blog usando TDD con las siguientes características:

- Sólo para administradores (solo un administrador puede crear artículos).
- Puede crear entradas a nombre de otro usuario.
- Si el usuario no existiese, ha de lanzar un error.
- El usuario ha de venir en el _body_ de la petición.
