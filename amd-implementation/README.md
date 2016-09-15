# AMD implementation

## Usage:

```js
// ./define-config.js
define.config({
    'map': {
        'calc': './modules/calculator.js',
        'logger': './modules/logger.js'
    }
});
```

```js
// ./main.js
define('main', ['calc', 'logger'], function (calc, logger) {
    logger.log(calc.add(1, 2));
});
```

```js
// ./modules/calculator.js
define({
    calc: {
        add: (a, b) => a + b
    }
})
```

```js
// ./modules/logger.js
define('logger', [], function () {
    return {
        log: console.log.bind(console);
    }
});
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
    <script src="./define.js"></script>
    <script src="./define-config.js"></script>
    <script src="./main.js"></script>
</body>
</html>
```