# RootJS

La bibliothèque JavaScript RootJS propose une liste de classes permettant de faciliter :
* les requêtes Ajax
* la manipulation des éléments du DOM :
	* recherche
    * ajouts, suppressions
    * gestion des classes et des styles
    * gestion des attributs
    * gestion du défilement
    
1. [Installation](#introduction)
2. [Documentation](#documentation)
   1. [Initialisation](#initialisation)
   2. [Requête Ajax](#ajax-request)
      1. [AjaxRequestRJS](#ajax-request-rjs)
      2. [JsonAjaxRequestRJS](#json-ajax-request-rjs)
      3. [UploadAjaxRequestRJS](#upload-ajax-request-rjs)

## Installation <a id="introduction"></a>

Vous pouvez récupérer le fichier root.js dans /resources/scripts/root.js.
Vous pouvez ensuite charger le fichier comme vous le faites pour d'autres fichiers JavaScript :
```html
<script src="root.js"></script>
```
Le fichier définit des classes sans exécuter de code.

## Documentation <a id="documentation"></a>

### Initialisation <a id="initialisation"></a>

Vous pouvez définir la fonction initRootJS pour commencer à utiliser RootJS :

```javascript 
window.initRootJS = function() { 
  console.log("Initialisation."); 
};
```

Pour initialiser RootJS, vous pouvez utiliser le code suivant :

```javascript
document.addEventListener("DOMContentLoaded", function() { 
  (new ControllerRJS()).execute(); 
}, false);
```

Une fois le document chargé, RootJS sera initialisé et la fonction initRootJS sera exécutée. Vous n'êtes pas obligé d'appeler la 
fonction d'initialisation de RootJS, mais cela permet d'avoir un seul point d'entrée.

### Requête Ajax <a id="ajax-request"></a>

#### AjaxRequestRJS <a id="ajax-request"></a>

La classe AjaxRequestRJS permet d'exécuter une requête en Ajax. Le contructeur d'une requête prend en entrée un objet JSON. 

Méthode
 
    constructor(options)

 Paramètre
 
    object options : objet JSON des paramètres de la requête.
        string url : adresse à appeler.
        string method : méthode HTTP à utiliser. Par défaut, la valeur est get. Les méthodes get et post sont autorisées.
        object params : objet JSON des paramètres à transmettre en Ajax.
        function onComplete : fonction à appeler lorsque l'appel est terminé.
        function onSuccess : fonction à appeler lorsque la réponse renvoie un code HTTP 200. Prend en entrée la réponse de l'appel.
        function onError : fonction à appeler lorsqu'une erreur s'est produite lors de l'appel. Prend en entrée la réponse de l'appel.

````javascript
new AjaxRequestRJS({ 
  "url": "https://www.something.unk/", 
  "method": "post", 
  "post": { 
    "param1": 10, 
    "param2": "test", 
    "param3": true 
  }, 
  "onComplete": function() { 
    console.log("Appel terminé."); 
  }, 
  "onSuccess": function(response) { 
    console.log("Appel réussi."); 
  }, 
  "onError": function(response) { 
    console.log("Echec de l'appel."); 
  } 
}); 
````

#### JsonAjaxRequestRJS <a id="json-ajax-request-rjs"></a>

La classe JsonAjaxRequestRJS permet de gérer un appel Ajax dont la réponse doit renvoyer du JSON. L'appel reste identique à la classe AjaxRequestRJS, il suffit d'utiliser la classe JsonAjaxRequestRJS à la place de la classe AjaxRequestRJS. 

Méthode

    constructor(options)
    
Paramètre

    object options : objet JSON des paramètres de la requête.
        string url : adresse à appeler.
        string method : méthode HTTP à utiliser. Par défaut, la valeur est get. Les méthodes get et post sont autorisées.
        object params : objet JSON des paramètres à transmettre en Ajax.
        function onComplete : fonction à appeler lorsque l'appel est terminé.
        function onSuccess : fonction à appeler lorsque la réponse renvoie un code HTTP 200. Prend en entrée la réponse de l'appel.
        function onError : fonction à appeler lorsqu'une erreur s'est produite lors de l'appel. Prend en entrée la réponse de l'appel.

#### UploadAjaxRequestRJS <a id="upload-ajax-request-rjs"></a>

La classe UploadAjaxRequestRJS permet de faire un appel Ajax de téléchargement de fichier. La réponse doit être au format JSON. Vous ne pouvez envoyer que le fichier téléchargé en paramètre, vous ne pouvez pas cumuler d'autre paramètre. Il vous faudra donc avoir une adresse dédiée pour cela. 

Méthode

    constructor(options)
    
Paramètre

    object options : objet JSON des paramètres de la requête.
        string url : adresse à appeler.
        string method : méthode HTTP à utiliser. Par défaut, la valeur est get. Les méthodes get et post sont autorisées.
        object params : objet JSON des paramètres à transmettre en Ajax.
        function onComplete : fonction à appeler lorsque l'appel est terminé.
        function onSuccess : fonction à appeler lorsque la réponse renvoie un code HTTP 200. Prend en entrée la réponse de l'appel.
        function onError : fonction à appeler lorsqu'une erreur s'est produite lors de l'appel. Prend en entrée la réponse de l'appel.
        function onProgress : fonction à appeler pour évaluer la progression du téléchargement. La fonction prend en paramètre un événement de type progress.

````html
<input type="file" />
````

````javascript
let inputFile = ElementRJS.searchOne("input[type=file]"); 
inputFile.addEvent("change", function() { 
  let formData = { 
    file: ElementRJS.retrieve(this).getProperty("files")[0] 
  }; 
  new UploadAjaxRequestRJS({ 
    "url": "upload.php", 
    "method": "post", 
    "params": formData, 
    "onProgress": function(event) { 
      let percent = 100 * ((event.total != 0) ? (event.loaded / event.total) : 0); 
        console.log(percent + " % téléchargé."); 
      }, 
      "onComplete": function() { 
        console.log("Fichier téléchargé."); 
      }, 
      "onSuccess": function(response) { 
        console.log("Succès."); 
      }, 
      "onError": function(response) { 
        console.log(response); 
      } 
  }); 
}); 
````
