let currentPageUrl = 'https://swapi.dev/api/people/'

window.onload = async () => { // toda vez que a pagina for carregada chama a função
    try {                          // tenta executar essa função
     await loadCharacters(currentPageUrl); // se for bem sucedida executa
    } catch (error){                       // se não der certo executa erro no console e joga um alert para o usuário
        console.log(error);
        alert('Erro ao carregar cards');
    }

    const nextButton = document.getElementById('next_button')
    const backButton = document.getElementById('back_button')

    nextButton.addEventListener('click', loadNextPage)
    backButton.addEventListener('click', loadPreviousPage)
};

async function loadCharacters(url) { //
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = ''; // vai limpar os resultados anteriores quando apagina carregar e aparecer novos resultados

    try{

        const response = await fetch(url) //faz a requisição da url
        const responseJson = await response.json(); 

        responseJson.results.forEach((character) => {
            const card = document.createElement("div") //vai criar documento HTML ou seja os cards dos personagens;
            card.style.backgroundImage = 
            `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')` //regEXP
            card.className = "cards"

            

            const characterNameBG = document.createElement("div")
            characterNameBG.className = "character-name-bg"

            const characterName = document.createElement("span")
            characterName.className = "character-name"
            characterName.innerText = `${character.name}`

            characterNameBG.appendChild(characterName) //pega o elemento pai e coloca um novo elemento dele(filho)
            card.appendChild(characterNameBG)

            card.onclick = () => {
                const modal = document.getElementById("modal")
                modal.style.visibility = "visible"

                const modalContent = document.getElementById("modal-content")
                modalContent.innerHTML = ''

                const characterImage = document.createElement("div")
                characterImage.style.backgroundImage =
                `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
                characterImage.className = "character-image"

                const name = document.createElement("span")
                name.className = "character-details"
                name.innerText = `Nome: ${character.name}` 

                const characterHeight = document.createElement("span")
                characterHeight.className = "character-details"
                characterHeight.innerText = `Altura: ${convertHeight(character.height)}` 

                const mass = document.createElement("span")
                mass.className = "character-details"
                mass.innerText = `Peso: ${convertMass(character.mass)}`

                const eyeColor = document.createElement("span")
                eyeColor.className = "character-details"
                eyeColor.innerText = `Cor dos olhos: ${convertEyeColor(character.eye_color)}`

                const birthYear = document.createElement("span")
                birthYear.className = "character-details"
                birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`

                modalContent.appendChild(characterImage)
                modalContent.appendChild(name)
                modalContent.appendChild(characterHeight)
                modalContent.appendChild(mass)
                modalContent.appendChild(eyeColor)
                modalContent.appendChild(birthYear)
            }

            mainContent.appendChild(card)
        });

        const nextButton = document.getElementById('next-button')
        const backButton = document.getElementById('back-button')
        
        nextButton.addEventListener('click', loadNextPage)
        backButton.addEventListener('click', loadPreviousPage)

        nextButton.disabled = !responseJson.next
        backButton.disabled = !responseJson.previous

        backButton.style.visibility = responseJson.previous? "visible" : "hidden"

        currentPageUrl = url

    } catch (error) {
        alert('Erro ao carregar os personagens')
        console.log(error)
    }
}

async function loadNextPage() {
    if (!currentPageUrl) return; // se o valor for nulo da variavel interrompe a execução da função 

    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        await loadCharacters(responseJson.next)
        
    } catch (error) {
        console.log(error)
        alert('Erro ao carregar a proxima página')
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return; // se o valor for nulo da variavel interrompe a execução da função 

    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        await loadCharacters(responseJson.previous)
        
    } catch (error) {
        console.log(error)
        alert('Erro ao carregar a pagina anterior')
    }
}

function hideModal(){
    const modal = document.getElementById("modal")
    modal.style.visibility = "hidden"
}

function convertEyeColor(eyeColor) {
    const cores = {
        blue: "azul",
        brown: "castanho",
        green: "verde",
        yellow: "amarelo",
        black: "preto",
        pink: "rosa",
        red: "vermelho",
        orange: "laranja",
        hazel: "avela",
        unknown: "desconhecida"
    };

    return cores[eyeColor.toLowerCase()] || eyeColor;
}

function convertHeight(height) {
    if(height === "unknown") {
        return "desconhecida"
    }

    return (height / 100).toFixed(2)
}

function convertMass (mass) {
    if(mass === "unknown") {
        return "desconhecida"
    }
    return `${mass} kg`
}

function convertBirthYear(birthYear) {
    if (birthYear === "unknown") {
        return "desconhecido"
    }

    return birthYear
}