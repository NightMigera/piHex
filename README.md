Pi
===

Вычисляет определённый знак пи без вычисления промежуточных по алгоритму Дэвида Бэйли 
в hex представлении числа пи.

В качестве аргумента на вход функции pi вы даёте номер знака, а на выходе получаете объект 
вида
   `{hex: String(10), fraction: float}`

Для проверки включен ли ASM.js можно использовать файлы `testASM.js` (и `testASM.min.js`). В глобальной области
видимости появится перемнная asmjs равная true, если компилятор работает и false, если не работает.