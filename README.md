# 💀 Babel Ripper

!["Package logo"](https://static.vecteezy.com/system/resources/previews/003/206/412/original/kawaii-cartoon-of-a-skull-ripper-halloween-vector.jpg)

## Configuración

Debe proporcionar una API_KEY válida para acceder a las funcionalidades de BABEL. Esta llave se especifica en la instanciación concreta de la clase `BabelProxyService`.

```javascript
const babel = new BabelProxyService({
  apiKey: 'MY-API-KEY', //Secret API Key
  defaultLocale: 'es_ES', //Lenguaje de traducciones por defecto
});
```

> **IMPORTANTE**: **_NUNCA_** especifique secretos de API o datos sensibles de manera estática en su código fuente, ya que datos importantes podrían verse expuestos. Prefiera variables de entorno y/u otros medios seguros.

## Implementaciones

Existen varias formas de implementación de la librería según sea su caso de uso

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

console.log(rip.getTranslation(dictionary.dateName));
//"Fecha estimada"

console.log(rip.getTranslation(dictionary.formName));
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
