# RootJS

La bibliothèque JavaScript RootJS propose une liste de classes permettant de faciliter :
* les requêtes Ajax
* la manipulation des éléments du DOM :
    * recherche
    * ajouts, suppressions
    * gestion des classes et des styles
    * gestion des attributs
    * gestion des événements
    * gestion du défilement
    
1. [Installation](#introduction)
2. [Documentation](#documentation)
   1. [Initialisation](#initialisation)
   2. [Requête Ajax](#ajax-request)
      1. [AjaxRequest](#ajax-request)
      2. [JsonAjaxRequest](#json-ajax-request)
      3. [UploadAjaxRequest](#upload-ajax-request)
   3. [Element](#element) 
      1. [searchOne](#element-search-one)
      2. [searchList](#element-search-list)
      3. [retrieve](#element-retrieve)
      4. [sameElement](#element-same-element)
      5. [getPrevious](#element-get-previous)
      6. [getNext](#element-get-next)
      7. [getParent](#element-get-parent)
      8. [getChild](#element-get-child)
      9. [getChildren](#element-get-children)
      10. [getLast](#element-get-last)
      11. [hasClass](#element-has-class)
      12. [addClass](#element-add-class)
      13. [addClasses](#element-add-classes)
      14. [removeClass](#element-remove-class)
      15. [getProperty](#element-get-property)
      16. [setProperty](#element-set-property)
      17. [constructor](#element-constructor)
      18. [addElement](#element-add-element)
      19. [remove](#element-remove)
      20. [removeChild](#element-remove-child)
      21. [removeChildren](#element-remove-children)
      22. [addEvent](#element-add-event)
      23. [fireEvent](#element-fire-event)
      24. [getStyle](#element-get-style)
      25. [setStyles](#element-set-styles)
      26. [getOuterDimension](#element-get-outer-dimension)
      27. [computeOffset](#element-compute-offset)
      28. [changeScroll](#element-change-scroll)

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
  (new RootJS.Controller()).execute(); 
}, false);
```

Une fois le document chargé, RootJS sera initialisé et la fonction initRootJS sera appelée. Vous n'êtes pas obligés d'appeler la 
fonction d'initialisation de RootJS, mais cela permet d'avoir un seul point d'entrée.

### Requête Ajax <a id="ajax-request"></a>

#### AjaxRequest <a id="ajax-request"></a>

La classe *RootJS.AjaxRequest* permet d'exécuter une requête en *Ajax*. Le constructeur d'une requête prend en entrée un objet *JSON*. 

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
new RootJS.AjaxRequest({ 
  "url": "https://www.something.unk/", 
  "method": "post", 
  "params": { 
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

#### JsonAjaxRequest <a id="json-ajax-request"></a>

La classe *RootJS.JsonAjaxRequest* permet de gérer un appel *Ajax* dont la réponse doit renvoyer du *JSON*. L'appel reste identique à la classe <a href="#ajax-request">RootJS.AjaxRequest</a>, il suffit d'utiliser la classe *RootJS.JsonAjaxRequest* à la place de la classe *RootJS.AjaxRequest*. 

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

#### UploadAjaxRequest <a id="upload-ajax-request"></a>

La classe *UploadAjaxRequest* permet de faire un appel Ajax de téléchargement de fichier. La réponse doit être au format JSON.

Méthode

    constructor(options)
    
Paramètre

    object options : objet JSON des paramètres de la requête.
        string url : adresse à appeler.
        object params : objet JSON des paramètres à transmettre en Ajax.
        function onComplete : fonction à appeler lorsque l'appel est terminé.
        function onSuccess : fonction à appeler lorsque la réponse renvoie un code HTTP 200. Prend en entrée la réponse de l'appel.
        function onError : fonction à appeler lorsqu'une erreur s'est produite lors de l'appel. Prend en entrée la réponse de l'appel.
        function onProgress : fonction à appeler pour évaluer la progression du téléchargement. La fonction prend en paramètre un événement de type progress.

````html
<input type="file" />
````

````javascript
let inputFile = RootJS.Element.searchOne("input[type=file]"); 
inputFile.addEvent("change", function() { 
  let formData = { 
    file: RootJS.Element.retrieve(this).getProperty("files")[0] 
  }; 
  new RootJS.UploadAjaxRequest({ 
    "url": "upload.php", 
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

### Element  <a id="element"></a>

La classe RootJS.Element permet de rechercher, ajouter et supprimer des éléments HTML au document.
Il est aussi possible d'attacher et de déclencher des événements aux éléments.

#### searchOne <a id="element-search-one"></a>

La méthode statique *searchOne* permet de récupérer un élément du *DOM*. La méthode prend en entrée un sélecteur accepté par la méthode *querySelector*. Le deuxième paramètre peut être omis. Il permet de préciser l'élément parent de celui recherché. Par défaut le parent est *document*. Si l'élément a été trouvé, la méthode retourne un objet *RootJS.Element*, *null* sinon. 

Méthode

    static searchOne(selector, root)

Paramètres

    string selector : sélecteur relatif à root de l'élément recherché.
    RootJS.Element root : élément racine à partir duquel s'effectut la recherche.

Retour

    RootJS.Element | null

````html
<div class="page"> 
  <div class="menu"> 
    <ul> 
      <li>Element 1</li> 
      <li class="selected">Element 2</li> 
    </ul> 
  </div> 
</div> 
````

````javascript
let elementSelected = RootJS.Element.searchOne("div.menu ul li.selected"); 
````

Le code précédent sélectionne l'élément *li* avec la classe *selected*.

### searchList <a id="element-search-list"></a>

La méthode statique *searchList* permet de récupérer un tableau d'éléments du *DOM*. La liste des paramètres est la même que celle de la méthode <a href="#element-search-one">searchOne</a>. La méthode retourne un tableau d'objets *RootJS.Element*.

Méthode

    static searchList(selector, root)
	
Paramètres

    string selector : sélecteur relatif à root des éléments recherchés.
    RootJS.Element root : élément racine à partir duquel s'effectue la recherche.

Retour

	Array<RootJS.Element>
	
````html
<div class="page"> 
  <div class="menu"> 
    <ul> 
      <li>Element 1</li> 
      <li class="selected">Element 2</li> 
    </ul> 
  </div> 
</div> 
````

````javascript
let 
  menu = RootJS.Element.searchOne("div.menu"), 
  menuItems = RootJS.Element.searchList("li", menu) 
; 
````

Le code précédent sélectionne tous les éléments *li* de *div.menu*. Vous pouvez ensuite utiliser la méthode *forEach* des tableaux pour parcourir la liste : 

````javascript
menuItems.forEach(function(li) { 
  console.log(li); 
}); 
````

### retrieve <a id="element-retrieve"></a>

Dans certains cas vous aurez besoin de recupérer un objet *RootJS.Element* alors que vous n'aurez qu'un élément *HTMLElement*. Cela peut être le cas lors de la gestion d'événement. Avec la méthode *RootJS.Element.retrieve*, vous récupérez un objet *RootJS.Element* qui vous permettra de manipuler l'objet. La méthode renvoie *null* si l'objet n'a pas été trouvé. 

Méthode

    static retrieve(htmlElement)

Paramètre

    HTMLElement htmlElement : objet natif HTMLElement du DOM.

Retour

    RootJS.Element | null
    
````html
<a href="#" title="">Lien</a>
````

````javascript
RootJS.Element.searchOne("a").addEvent("click", function(event) { 
  let anchor = RootJS.Element.retrieve(this); 
}); 
````

L'exemple précédent récupére l'objet *RootJS.Element* correspond à l'ancre. 

### sameElement <a id="element-same-element"></a>

La méthode *sameElement* vous permet de vérifier qu'un élément correspond à l'élément courant.

Méthode

    sameElement(element)

Paramètre

    RootJS.Element element : élément à comparer.

Retour

    bool
    
````html
<a href="#" title="">Lien</a>
<p>Texte</p>
````

````javascript
let anchor = RootJS.Element.searchOne('a'),
	pararagh = RootJS.Element.searchOne('p'),
	isSameAnchor = anchor.sameElement(RootJS.Element.searchOne('a')),
	isNotSameAnchor = anchor.sameElement(RootJS.Element.searchOne('p'))
;
````

L'exemple précédent stocke *true* dans la variable *isSameAnchor* et *false* dans la variable *isNotSameAnchor*. 

### getPrevious <a id="element-get-previous"></a>

La méthode *getPrevious* vous permet de récupérer l'élément précédent du **même parent que l'élément courant**. La méthode prend en entrée un sélecteur et retourne un objet *RootJS.Element* si l'élément a été trouvé, *null* sinon. 

Méthode

    getPrevious(selector)
  
Paramètre

    string selector : correspond au sélecteur de l'élément précédent recherché.

Retour

    RootJS.Element | null
    
````html
<ul class="one"> 
   <li class="first">First</li> 
   <li class="second">Second</li>
</ul> 
<ul class="two"> 
  <li class="first">Third</li> 
  <li class="second">Fourth</li> 
</ul> 
````

 ````javascript
let 
  element = RootJS.Element.searchOne("ul.two li.second"), 
  previous = element.getPrevious("li") 
; 
````

Cet exemple sélectonne le dernier élément *li* (avec le texte *Fourth*), et récupére l'élément *li* précédent (avec le texte *Third*).

### getNext <a id="element-get-next"></a>

La méthode *getNext* permet de récupérer l'élément suivant du **même parent que l'élément courant**. La méthode prend en entrée un sélecteur et retourne un objet *RootJS.Element* si l'élément a été trouvé et *null* sinon. 

Méthode

    getNext(selector)
  
Paramètre

    string selector : correspond au sélecteur de l'élément suivant recherché.

Retour

    RootJS.Element | null
    
````html
<ul class="one"> 
  <li class="first">First</li> 
  <li class="second">Second</li> 
</ul> 
<ul class="two"> 
  <li class="first">Third</li> 
  <li class="second">Fourth</li> 
</ul> 
````

````javascript
let element = RootJS.Element.searchOne("ul.one li.first"), 
  next = element.getNext("li") 
; 
````

Cet exemple sélectionne le premier élément *li* (avec le texte *First*), et récupére l'élement *li* suivant (avec le texte *Second*).

### getParent <a id="element-get-parent"></a>

La méthode *getParent* permet de retourner l'élément parent dont le sélecteur est donné en paramètre. La méthode retourne un objet *RootJS.Element* si le parent a été trouvé et *null* sinon. 

Méthode

    getParent(selector)
    
Paramètre

    string selector : correspond au sélecteur du parent recherché.

Retour

    RootJS.Element | null
    
````html
<div class="page"> 
  <div class="menu"> 
    <ul> 
      <li>Element 1</li> 
      <li class="selected">Element 2</li> 
    </ul> 
  </div> 
</div> 
````

````javascript
let 
  element = RootJS.Element.searchOne("ul li.selected"), 
  parent = element.getParent("div.page") 
; 
````

L'exemple précédent sélectionne l'élément *li.selected* et récupére l'élément *div.page* parent.

### getChild <a id="element-get-child"></a>

La méthode *getChild* permet de retourner l'enfant dont le sélecteur est fourni en paramètre. La méthode est similaire à la méthode <a href="#element-search-one">searchOne</a> : c'est comme si cette méthode était appelée avec l'élément courant en deuxième paramètre. 

Méthode

    getChild(selector)
    
Paramètre

    string selector : correspond au sélecteur de l'enfant recherché.

Retour

    RootJS.Element | null
    
````html
<div class="page"> 
  <div class="menu"> 
    <ul> 
      <li>Element 1</li> 
      <li class="selected">Element 2</li> 
    </ul> 
  </div> 
</div> 
````

````javascript
let 
  parent = RootJS.Element.searchOne("div.menu"), 
  child = parent.getChild("li") 
; 
````

L'exemple précédent sélectionne le premier enfant *li* (avec le texte *Element 1*) de l'élément *div.menu*.

### getChildren <a id="element-get-children"></a>

La méthode *getChildren* permet de récupérer un tableau des enfants dont le sélecteur est fourni en paramètre. La méthode est similaire à la méthode <a href="#element-search-list">searchList</a> : c'est comme si cette méthode était appelée avec l'élément courant en deuxième paramètre. 

Méthode

    getChildren(selector)

Paramètre

    string selector : correspond au sélecteur des enfants recherchés.

Retour

    Array<RootJS.Element>
    
````html
<div class="page"> 
  <div class="menu"> 
    <ul> 
      <li>Element 1</li> 
      <li class="selected">Element 2</li> 
    </ul> 
  </div> 
</div> 
````

````javascript
let 
  parent = RootJS.Element.searchOne("div.menu"), 
  elements = parent.getChildren("ul li") 
; 
````

L'exemple précédent sélectionne tous les *li* de l'élément *div.menu*.

### getLast <a id="element-get-last"></a>

La méthode *getLast* retourne le dernier enfant correspondant au sélecteur en paramètre. Retourne un objet *RootJS.Element* si l'élément a été trouvé, *null* sinon.

Méthode

    getLast(selector)
    
Paramètre

    string selector : correspond au sélecteur recherché.

Retour

    RootJS.Element | null
    
````html
<div class="page"> 
  <div class="menu"> 
    <ul> 
      <li>Element 1</li> 
      <li class="selected">Element 2</li> 
    </ul> 
  </div> 
</div> 
````

````javascript
let 
  parent = RootJS.Element.searchOne("div.menu"), 
  lastElement = parent.getLast("ul li") 
; 
````

L'exemple précédent sélectionne le dernier *li* (avec le texte *Element 2*) de l'élément *div.menu*.

### hasClass <a id="element-has-class"></a>

La méthode *hasClass* permet de vérifier si l'objet courant posséde la classe fournit en paramètre. Le paramètre en entrée doit être une chaine de caractères. La méthode retourne un booléen : *true* si la classe est présente, *false* sinon. 

Méthode

    hasClass(className)
    
Paramètre

    string className : nom de la classe à vérifier.

Retour

    bool

````html
<a href="#" class="link" title="">Lien</a>
````

````javascript
let 
  anchor = RootJS.Element.searchOne("a"), 
  hasTargetClass = anchor.hasClass("target"), 
  hasLinkClass = anchor.hasClass("link") 
; 
````

Dans l'exemple précédent, *hasTargetClass* vaut *false* et *hasLinkClass* vaut *true*.

### addClass <a id="element-add-class"></a>

La méthode *addClass* permet d'ajouter la classe donnée en paramètre à l'objet courant, s'il ne l'a pas déjà. Le paramètre en entrée doit être une chaine de caractères. La méthode retourne l'objet courant. 

Méthode

    addClass(className)
    
Paramètre

    string className : nom de la classe à ajouter.

Retour

    RootJS.Element : l'élément courant.

````html
<a href="#" class="link" title="">Lien</a>
````

````javascript
let anchor = RootJS.Element.searchOne("a"); 
anchor.addClass("target"); 
````

Dans l'exemple précédent, la classe *target* a été ajouté à *anchor*.

### addClasses <a id="element-add-classes"></a>

La méthode *addClasses* permet d'ajouter plusieurs classes à l'objet courant. Le paramètre en entrée doit être un tableau de chaines de caractères. La méthode retourne l'objet courant. 

Méthode

    addClasses(classes)

Paramètre

    Array<string> classes : tableau des classes à ajouter.

Retour

    RootJS.Element : l'élément courant.
    
````html
<a href="#" title="">Lien</a>
````

````javascript
let anchor = RootJS.Element.searchOne("a"); 
anchor.addClasses([ "link", "target" ]); 
````

Dans l'exemple précédent, les classes *link* et *target* ont été ajouté à *anchor*.

### removeClass <a id="element-remove-class"></a>

La méthode *removeClass* permet de retirer la classe en paramètre de l'objet. Le paramètre en entrée doit être une chaine de caractères. La méthode retourne l'objet courant. 

Méthode

    removeClass(classToDelete)
    
Paramètre

    string classToDelete : nom de la classe à supprimer.

Retour

    RootJS.Element : l'élément courant.
    
````html
<a href="#" class="link" title="">Lien</a>
````

````javascript
let anchor = RootJS.Element.searchOne("a"); 
anchor.removeClass("link"); 
````

Dans l'exemple précédent, la classe *link* a été enlevée de l'élément *anchor*.

### getProperty <a id="element-get-property"></a>

La méthode *getProperty* retourne la valeur dont la propriété est donnée en paramètre. Le paramètre en entrée doit être une chaine de caractères. La méthode retourne la valeur si elle a été trouvée et *null* sinon. 

Méthode

    getProperty(property)
    
Paramètre

    string property : nom de la propriété à récupérer.

Retour

    mixed | null : valeur de la propriété.
    
````html
<p data-type="paragraph">Texte</p>
````

````javascript
let 
  element = RootJS.Element.searchOne("p"), 
  elementType = element.getProperty("data-type"), 
  elementText = element.getProperty("text") 
; 
````

Dans l'exemple précédent, la variable *elementType* vaut *paragraph*, la variable *elementText* vaut *Texte*.

### setProperty <a id="element-set-property"></a>

La méthode *setProperty* permet de changer la valeur d'une propriété. Le premier paramètre correspond à la propriété, le deuxième à la valeur. La méthode retourne l'objet courant. 

Méthode

    setProperty(property, value)
  
Paramètres

    string property : nom de la propriété à modifier.
    mixed value : valeur de la propriété.

Retour

    RootJS.Element : l'élément courant.
    
````html
<p data-type="paragraph">Texte</p>
````

````javascript
let element = RootJS.Element.searchOne("p"); 
element.setProperty("data-modified", 1); 
element.setProperty("text", "Texte modifié"); 
````

Dans l'exemple précédent, le texte du paragraphe a été modifié et la propriété *data-modified* a été affectée.

### setProperty <a id="element-set-property"></a>

La méthode *setProperty* permet de changer la valeur d'une propriété. Le premier paramètre correspond à la propriété, le deuxième à la valeur. La méthode retourne l'objet courant. 

Méthode

    setProperty(property, value)
    
Paramètres

    string property : nom de la propriété à modifier.
    mixed value : valeur de la propriété.

Retour

    RootJS.Element : l'élément courant.
    
````html
<p data-type="paragraph">Texte</p>
````

````javascript
let element = RootJS.Element.searchOne("p"); 
element.setProperty("data-modified", 1); 
element.setProperty("text", "Texte modifié");     
````

Dans l'exemple précédent, le texte du paragraphe a été modifié et la propriété *data-modified* a été affectée.

### constructor <a id="element-constructor"></a>

Le premier paramètre du constructeur d'un objet *RootJS.Element* est le nom de la balise *HTML* (*a*, *p*, *table*...). Le deuxième paramètre est un objet *JSON* des propriétés à affecter à la balise. 

Méthode

    constructor(tagName, attributes, htmlElement)
    
Paramètres

    string tagName : nom de la balise (a, img, p).
    object attributes : objet JSON des propriétés de la balise.
    HTMLElement htmlElement : objet HTMLElement utilisé pour instancier un objet RootJS.Element (utilisé par la méthode retrieve).

````javascript
let element = new RootJS.Element("div", { 
  "class": "menu" 
}); 
````

### addElement <a id="element-add-element"></a>

La méthode *addElement* permet d'ajouter un élément au *DOM*. Le premier paramètre est l'élément à ajouter à l'élément courant. Le deuxième paramètre est la position où placer l'élément par rapport à l'élément courant. Les positions disponibles sont *before*, *after*, *top* et *bottom*. Par défaut, l'élément sera ajouté après le dernier enfant de l'élément courant. 

Méthode

    addElement(element, position)

Paramètre

    RootJS.Element element : objet RootJS.Element à ajouter.
    string position : position où ajouter l'élément en paramètre par rapport à l'objet courant. Les valeurs before, after, top et bottom sont autorisées.

Retour

    RootJS.Element : l'élément courant.
    
````html
<div class="menu"> 
  <ul> 
    <li>Item 1</li> 
    <li>Item 2</li> 
    <li>Item 3</li> 
  </ul> 
</div> 
````

````javascript
let
  ul = RootJS.Element.searchOne("div.menu ul"), 
  menuItem = new RootJS.Element("li", { 
    "class": "selected", 
    "text": "Nouveau menu" 
  })
; 
ul.addElement(menuItem, "top"); 
````

L'exemple précédent ajoute un élément *li* en première position au menu.

### remove <a id="element-remove"></a>

La méthode *remove* permet de supprimer l'élément courant du *DOM*.

````html
<div class="page"> 
  <p>Texte</p> 
</div> 
````

````javascript
let element = RootJS.Element.searchOne("p"); 
element.remove(); 
````

Dans l'exemple précédent, la balise *p* a été supprimée.

### removeChild <a id="element-remove-child"></a>

La méthode *removeChild* permet de supprimer l'objet *RootJS.Element* donné en paramètre de l'élément courant. 

Méthode

    removeChild(element)
    
Paramètre

    RootJS.Element element : objet RootJS.Element à supprimer.

Retour

    RootJS.Element : l'élément courant.
    
````html
<div class="menu"> 
  <ul> 
    <li>Item 1</li> 
    <li>Item 2</li> 
    <li>Item 3</li> 
  </ul> 
</div>
````

````javascript
let 
  menu = RootJS.Element.searchOne("div.menu"), 
  li = menu.getChild("li") 
; 
menu.removeChild(li); 
````

Dans l'exemple précédent, le premier élément *li* a été supprimé.

### removeChildren <a id="element-remove-children"></a>

La méthode *removeChildren* supprime tous les enfants de l'élément courant.

Méthode

    removeChildren()
    
Retour

    RootJS.Element : l'élément courant.

````html
<div class="menu"> 
  <ul> 
    <li>Item 1</li> 
    <li>Item 2</li> 
    <li>Item 3</li> 
  </ul> 
</div> 
````

````javascript
let ul = RootJS.Element.searchOne("div.menu ul"); 
ul.removeChildren(); 
````

Dans l'exemple précédent, tous les éléments *li* ont été supprimés.

### addEvent <a id="element-add-event"></a>

La méthode *addEvent* permet d'ajouter un événement à l'élément courant. Le premier paramètre est le type d'événement (*click*, *change*, *blur*, *mouseover*...). Le deuxième paramètre est la fonction appelée lors de l'exécution de l'événement, elle prend en paramètre un objet *Event*. 

Méthode

    addEvent(event, callback)
    
Paramètres

    string event : nom de l'événement.
    function callback : fonction à appeler lors de l'événement.

Retour

    RootJS.Element : l'élément courant.

````html
<a href="#" title="">Lien</a>
````

````javascript
let anchor = RootJS.Element.searchOne("a"); 
anchor.addEvent("click", function(event) { 
  event.preventDefault(); 
  element = RootJS.Element.retrieve(this); 
  element.addClass("active"); 
}); 
````

Dans l'exemple précédent, la classe *active* est ajoutée à l'ancre lors du clic.

### fireEvent <a id="element-fire-event"></a>

La méthode *fireEvent* permet de déclencher un événement. Le premier paramètre est le type d'événement. 
Le second paramètre est facultatif, il vous permet de transmettre une liste de paramètres à la fonction d'appel de l'événement.

Méthode

    fireEvent(event)
    
Paramètre

    string event : nom de l'événement.
    array params : liste des paramètres à transmettre à la fonction d'appel, si nécessaire.

Retour

    RootJS.Element : l'élément courant.
    
````html
<a href="#" title="">Lien</a>
````

````javascript
let anchor = RootJS.Element.searchOne("a"); 
anchor.addEvent("addLog", function(message) { 
  let 
    link = RootJS.Element.retrieve(this), 
    paragraph = new RootJS.Element("p", { 
      "text": message 
    }) 
  ; 
  anchor.addElement(paragraph, "after"); 
}); 

anchor.addEvent("click", function(event) { 
  event.preventDefault(); 
  let link = RootJS.Element.retrieve(this); 
  link.fireEvent("addLog", [ 'Nouveau clic' ]); 
}); 
````

L'exemple précédent ajoute un paragraphe avec le texte *Nouveau clic* à chaque clic sur l'ancre.

### getStyle <a id="element-get-style"></a>

La méthode *getStyle* permet de récupérer la valeur d'une propriété *CSS*. La méthode prend en entrée le nom de la propriété et retourne la valeur *CSS* correspondante, ou *null* si la valeur n'a pas été trouvée.

Méthode

    getStyle(key)
    
Paramètre

    string key : nom de la propriété CSS.

Retour

    string | null : la valeur de la propriété.
    
````html
<a href="#" title="">Lien</a>
````

 ````javascript
let 
  anchor = RootJS.Element.searchOne("a"), 
  color = anchor.getStyle("color") 
; 
````
    
L'exemple précédent retourne la couleur de l'ancre.    

### setStyles <a id="element-set-styles"></a>

La méthode *setStyles* permet de modifier les styles d'un élément. Elle prend en entrée un objet *JSON* des styles à appliquer. 

Méthode

    setStyles(styles)
    
Paramètre

    object styles : objet JSON des styles à appliquer.

Retour

    RootJS.Element : l'élément courant.

````html
<a href="#" title="">Lien</a>
````

````javascript
let anchor = RootJS.Element.searchOne("a"); 
anchor.setStyles({ 
  "text-decoration": "none", 
  "color": "gray" 
}); 
````

L'exemple précédent modifie la couleur et le surlignage de l'ancre.

### getOuterDimension <a id="element-get-outer-dimension"></a>

La méthode *getOuterDimension* permet de retourner la largeur ou la hauteur de l'élément y compris les marges extérieurs (*margin*), intérieurs (*padding*) et les bordures.

Méthode

    getOuterDimension(property)
    
Paramètre

    string property : width pour calculer la largeur, height pour calculer la hauteur.

Retour

    float : la valeur demandée en pixels.

````html
<p>Texte</p>
````

````javascript
let 
  element = RootJS.Element.searchOne("p"),
  width = element.getOuterDimension("width"),
  height = element.getOuterDimension("height")
;
````

L'exemple précédent calcul la largeur (variable *width*) et la hauteur (variable *height*) du paragraphe.

### computeOffset <a id="element-compute-offset"></a>

La méthode *computeOffset* calcul le décalage vertical ou horizontal de l'élément courant par rapport au début de la page. La méthode prend en entrée la valeur *top* pour le décalage vertical ou *left* pour le décalage horizontal. La méthode retourne le nombre de pixels correspond au décalage. 

Méthode

    computeOffset(property)
    
Paramètre

    string property : top pour calculer le décalage vertical et left pour calculer le décalage horizontal.

Retour

    float : décalage de l'élément par rapport au début de la page, en pixels.

````html
<div class="menu"> 
  <ul> 
    <li>Item 1</li> 
    <li>Item 2</li> 
    <li>Item 3</li> 
  </ul> 
</div> 
````

````javascript
let 
  li = RootJS.Element.searchOne("li:nth-child(3)"), 
  offsetTop = li.computeOffset("top") 
; 
````

L'exemple précédent calcul le décalage vertical du troisième élément *li*. 

### changeScroll <a id="element-change-scroll"></a>

La méthode *changeScroll* permet de modifier les positions du défilement horizontal et vertical. La méthode prend en entrée un objet *JSON* avec les positions *left* et *top*. Les nouvelles positions doivent être des *float* correspondant à des valeurs en pixels. 

Méthode

    changeScroll(data)
    
Paramètre

    object data : objet JSON des valeurs du défilement à changer.

Retour

    RootJS.Element : l'élément courant.

````html
<div class="content"> 
  <a href="#" class="top" title="Tester le décalage vertical.">Tester</a> 
</div> 
````

````javascript
let 
  scrollingElement = RootJS.Element.retrieve(document.scrollingElement), 
  content = RootJS.Element.searchOne("div.content"), 
  anchorTop = content.getChild("a.top") 
; 

anchorTop.addEvent("click", function(event) { 
  event.preventDefault(); 
  content.setStyles({ 
    "min-height": "2000px" 
  }); 
  
  scrollingElement.changeScroll({ 
    "top": content.getProperty("clientHeight") 
  }); 
}); 
````

Dans l'exemple précédent, le clic sur l'ancre modifie la hauteur de l'élément *div.content* pour que nous puissions tester le défilement. Le défilement se déplace ensuite en bas de page. 
