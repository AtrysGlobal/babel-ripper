!["Package logo"](./media/header.png)

## Configuración

Debe proporcionar una `Dirección de API` y una `API Key` válidas para acceder a las funcionalidades de BABEL. Esta llave se especifica en la instanciación concreta de la clase `BabelProxyService`.

```javascript
const babel = new BabelProxyService({
  apiAddress: 'MY-API-ADDRESS', //Babel API Address
  apiKey: 'MY-API-KEY', //Secret API Key
  defaultLocale: 'es_ES', //Lenguaje de traducciones por defecto
});
```

> **IMPORTANTE**: Prefiera variables de entorno y/u otros medios seguros para manejar datos sensibles en la configuración de su cliente `BabelProxyService`.

> **IMPORTANTE**: El parámetro `apiAddress` se especifica a través del constructor de clase o en su defecto la variable de entorno `BABEL_SERVICE`. Si `babel-ripper` no detecta la dirección de API en el constructor o en la variable de entorno, el servicio gatillará una `excepción de instanciación`.

> **IMPORTANTE**: Puede además configurar el valor de la propiedad `clientTimeout` para modificar los tiempos de espera de respuesta antes de forzar una excepción en tiempo de ejecución.

## Implementaciones

Existen varias formas de implementación de la librería según sea su caso de uso:

### Traducciones desde una lista

Necesita obtener la traducción desde una lista de referencias:

```javascript
//Ref 1
const dateNameTarget = {
  target: 'references.header.dateNameLabel',
};

//Ref 2
const formNameTarget = {
  target: 'references.nameLabel',
};

//Loading translations
const [dateName, formName] = await babel.loadTranslations([
  dateNameTarget,
  formNameTarget,
]);

console.log(dateName.message); //"Fecha estimada"
console.log(formNameTarget.message); //"Nombre completo"
```

### Traducciones desde diccionario

Necesita obtener traducciones desde un diccionario de referencias:

- _Para facilitar la tarea de mapeo de traducciones en grandes volúmenes utilice clase helper `BabelRipper`_

```javascript
//Ref dictionary
const dictionary = {
  dateName: 'references.header.dateNameLabel',
  folioName: 'references.header.folioNameLabel',
  formName: 'references.nameLabel',
};

//Loading translations
const translations = await babel.loadTranslationsFromObject(dictionary);

//BabelRipper plugin
const rip = new BabelRipper(translations);

console.log(rip.get(dictionary.dateName));
//"Fecha estimada"

console.log(rip.get(dictionary.formName));
//"Nombre completo"
```

### Traducciones desde diccionario (proceso simplificado)

```javascript
//Ref dictionary
const dictionary = {
  dateName: 'references.header.dateNameLabel',
  folioName: 'references.header.folioNameLabel',
  formName: 'references.nameLabel',
};

//Loading translations (includes pre-loaded Ripper)
const rip = await babel.loadGuttedTranslations(dictionary);

console.log(rip.get(dictionary.dateName));
//"Fecha estimada"

console.log(rip.get(dictionary.formName));
//"Nombre completo"
```

### Traducciones de mensajes de API

Necesita recibir la traducción de un mensaje de traducción para respuesta estándar HTTP de su API. por ejemplo:

```javascript
//...

if (!userName) {
  const message = await babel.loadMessage({
    target: 'standardErrors.STANDARD.BAD_REQUEST',
  });

  // Will return:
  //   {
  //     id: 'standardErrors.STANDARD.BAD_REQUEST',
  //     message: 'Bad Request',
  //     httpCode: 400,
  //   }

  return message;
}
```

## License

Este proyecto se encuentra bajo la licencia `GNU General Public License`. Puede consultar más detalles [aquí](./LICENSE).

## Changelog

Puede consultar el historial de cambios [aquí](./CHANGELOG.md).

## NPM Package

Puede encontrar la distribución oficial de NPM de este proyecto [aquí](https://www.npmjs.com/package/@atrysglobal/babel-ripper).

