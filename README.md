# Soporte SUC para deploy de contrato en Alastria

Los contratos de SUC, están con código en la versión 5 de solidity y se tienen que compilar con la versión 5 de solc. 
El despliegue en [Quorum](https://github.com/jpmorganchase/quorum) (lo que usa la blockchain de Alastria) con truffle en la versión tienen un error. Están trabajando en la resolución que se puede seguir en el siguiente [link](https://github.com/trufflesuite/truffle/issues/1622)

Mientras tanto, se creó este repositorio para subir los contratos del proyecto [SUC](https://github.com/dappsar/suc) a través de un [script de nodeJs](deploy.js)

