const radioRequests = document.getElementsByTagName("input");
const responseContainer = document.getElementById("responseContainer");
let modeRequest;
const functionHandler = {
    xmlHttpRequest: (e) => {
        console.log("Cargando razas con " + e.target.id);
        modeRequest = e.target.id;
        createCardResponse();
        let select = document.getElementById("selectBreeds");
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let dogList = JSON.parse(this.responseText);
                setBreedsOptions(dogList, select);
            }
        });
        xhr.open("GET", "https://dog.ceo/api/breeds/list/all");
        xhr.send();
    },
    fetch: (e) => {
        console.log("Cargando razas con " + e.target.id);
        modeRequest = e.target.id;
        createCardResponse();
        let select = document.getElementById("selectBreeds");

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch("https://dog.ceo/api/breeds/list/all", requestOptions)
            .then(response => response.text())
            .then(result => {
                let dogList = JSON.parse(result)
                setBreedsOptions(dogList, select);
            })
            .catch(error => console.log('error', error));
    },
    jQuery: (e) => {
        console.log("Cargando razas con " + e.target.id);
        modeRequest = e.target.id;
        createCardResponse();
        let select = document.getElementById("selectBreeds");
        var settings = {
            "url": "https://dog.ceo/api/breeds/list/all",
            "method": "GET",
            "timeout": 0,
        };
        $.ajax(settings).done(function (response) {
            let dogList = response;
            setBreedsOptions(dogList, select);
        });
    }
};

const callObjectHandler = (e) => {
    functionHandler[e.target.id](e);
};

[...radioRequests].forEach(radio => {
    radio.addEventListener("click", callObjectHandler);
});


function createCardResponse() {
    clearChildNodes(responseContainer);
    let divContainer = createNode("div", "", ["card"], []);
    responseContainer.appendChild(divContainer);
    divContainer.appendChild(createNode("div", "Selecciona una raza", ["card-header"], []));
    let bodyCardContainer = createNode("div", "", ["card-body", "d-flex", "flex-column"], []);
    divContainer.appendChild(bodyCardContainer);
    let selectBreeds = createNode("select", "", ["form-select", "mb-3"], [{
        name: "id",
        value: "selectBreeds"
    }])
    bodyCardContainer.appendChild(selectBreeds);
    let buttonDog = createNode("button", "Nuevo Perro", ["btn", "btn-dark"], []);
    buttonDog.addEventListener("click", setImgDog)
    bodyCardContainer.appendChild(buttonDog);
}

function setBreedsOptions(dogList, element) {
    var result = Object.keys(dogList.message).map((key) => [String(key), dogList.message[key]]);
    result.forEach(breed => {
        if (breed[1].length > 0) {
            breed[1].forEach(subBreed => {
                element.appendChild(createNode("option", breed[0] + " " + subBreed, [], [{
                    name: "value",
                    value: breed[0] + "/" + subBreed
                }]));
            })
        } else {
            element.appendChild(createNode("option", breed[0], [], [{
                name: "value",
                value: breed[0].toString()
            }]));
        }
    })
}

function setImgDog(e) {
    let selectValue = e.target.previousSibling.value;
    let urlHttp = "https://dog.ceo/api/breed/" + selectValue + "/images/random";
    if (document.getElementById("dogImg") == null) {
        e.target.parentNode.appendChild(createNode("img", "", ["m-2"], [{
            name: "src",
            value: "https://media1.tenor.com/images/54adb4c6e6bc85cf553da1008d210f23/tenor.gif?itemid=9087837",
        }, {
            name: "id",
            value: "dogImg"
        }]));
    }
    switch (modeRequest) {
        case "fetch":
            console.log("Cargando imagen con " + modeRequest);
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    let dog = JSON.parse(this.responseText).message;
                    document.getElementById("dogImg").src = dog;
                }
            });
            xhr.open("GET", urlHttp);
            xhr.send();
            break;
        case "jQuery":
            console.log("Cargando imagen con " + modeRequest);
            var settings = {
                "url": urlHttp,
                "method": "GET",
                "timeout": 0,
            };
            $.ajax(settings).done(function (response) {
                document.getElementById("dogImg").src = response.message;
            });
            break;
        default:
            console.log("Cargando imagen con " + modeRequest);
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    document.getElementById("dogImg").src = JSON.parse(this.responseText).message;
                }
            });
            xhr.open("GET", urlHttp);
            xhr.send();
            break;
    }

}

function clearChildNodes(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function createNode(tag, textContent, clases, atributes) {
    let node = document.createElement(tag);
    if (textContent != "") {
        node.textContent = textContent;
    }
    if (clases.length > 0) {
        clases.forEach(clase => {
            node.classList.add(clase);
        });
    }
    if (atributes.length > 0) {
        atributes.forEach(atributo => {
            node.setAttribute(atributo.name, atributo.value);
        });
    }
    return node;
};
