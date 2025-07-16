
# ESP32 con Múltiples Sensores HC-SR04

El código está creado para poder leer *n* sensores (no se recomiendan más de 4 pero se podría probar).

El ultrasonido funciona enviando un pulso por el pin *trigger* y luego escucha el rebote en el pin *echo*. 

[Hasta el commit 43ef3aa2c910cf59e8d05ebfe1a15fedc4a33223 se puede ver el código para un solo detector]

Entonces para tener más de un HC-SR04 en simultáneo, definimos en la ESP32 un pin para el trigger y un pin de echo por cada sensor. Luego iteramos por cada sensor y su echo específico. 

Si bien el cable físico del trigger es compartido por los *n* sensores, no hay conflicto porque sólo se escucha un echo a la vez.

