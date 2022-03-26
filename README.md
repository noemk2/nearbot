NearBot ( near protocol )
==================

Introducción a NearBot
==================

 Este bot perminte:
 
 1. ver el balance
 2. ejecutar intercambios 
 3. enviar near a otra billetera
 4. automatizar operaciones ( en desarrollo )

👨‍💻 Instalación en local
===========

Para correr este proyecto en local debes seguir los siguientes pasos:

Paso 1: Pre - Requisitos
------------------------------

1. Asegúrese de haber instalado [Node.js] ≥ 12 ((recomendamos usar [nvm])
2. Asegúrese de haber instalado yarn: `npm install -g yarn`
3. Instalar dependencias: `yarn install`
4. Crear un test near account [NEAR test account]
5. Instalar el NEAR CLI globally: [near-cli] es una interfaz de linea de comando (CLI) para interacturar con NEAR blockchain

    yarn install --global near-cli


Step 2: Configura tu NEAR CLI
-------------------------------

Configura tu near-cli para autorizar su cuenta de prueba creada recientemente:

    near login

