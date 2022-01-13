# Caso de Estudio BCDA: Asignatura 2021 Teoría.

## Introducción

Aplicación web que utiliza una red Blockchain como Backend. Desarrollada con distintas tecnologías (Web3, Truffle, Drizzle, Remix, Ganache, Metamask) y lenguajes (CSS, HTML, JS, Solidity).
Se parte de base del proyecto Asignatura 2020: https://github.com/sanpago/BCDA_P4_Asignatura_2020

### Instalación
En primer lugar es necesario conectar la wallet (Metamask) con Ganache. Se debe editar el archivo truffle-config.js para añadir la configuración de despliegue en Ganache.

Realizar el git clone del repositorio:
<pre><code>git clone https://github.com/feersantana5/BCDA_P4_Asignatura_2021.git </code></pre>

Ejecutar la migración para desplegar el contrato:
<pre><code>npm install truffle
npx truffle migrate --reset --compile-all --all 
</code></pre>

Instalación de librerías:
<pre>
cd dapp
npm install react-router-dom@6 history@5
npm install @drizzle/store @drizzle/react-plugin
</pre>

Prepación de la instalación y creación del enlace simbólico al directorio donde se encuentran los contratos.
<pre>
cd dapp/src
npm run build
ln -s ../../build/contracts
</pre>

Ejecución del script para rellenar el contrato:
<pre>
cd Asignatura_2021
npx truffle exec ./scripts/rellenar.js
</pre>

En caso de querer comprobar el contrato, el test:
<pre>
npx truffle test
</pre>

Ejecución del entorno:
<pre>
cd dapp
SKIP_PREFLIGHT_CHECK=true
npm start
</pre>
