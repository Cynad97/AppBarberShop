let page = 1;

const turn = {
    name: '',
    date: '',
    time: '',
    services: []
}

document.addEventListener('DOMContentLoaded', function () {
    startApp();
});

function startApp() {

    showServices();
    //resalta el div actual segun el tab que se presiona
    showSection();
    //Oculta o muestra la seccion segund el tab que se presiona
    switchSection();
    //Paginacion siguiente y anterior
    nextPage();
    backPage();
    //Comprobar la pagina actual para ocultar o mostrar la paginacion
    buttonsPage();
    //Muestra el resumen de la cita (O mensaje de error en caso de no pasar la validacion)
    showResume();
    //Almacena el nombre del turno en el objeto
    nameTurn();
    //Almacena la fecha del turno
    dateTurn();
    //Deshabilita los dias anteriores al actual.
    disableDate();
    //Almacena la hora del turno en el objeto
    timeTurn();


}

function showSection() {
    //Eliminar la clase actual en el tab anterior
    const backSection = document.querySelector('.show-section');
    if (backSection) {
        backSection.classList.remove('show-section');
    }

    const actualSection = document.querySelector(`#step-${page}`);
    actualSection.classList.add('show-section');

    //Eliminar mostrar-seccion de la seccion anteior
    const backTab = document.querySelector('.tabs .actual');
    if (backTab) {
        backTab.classList.remove('actual');
    }

    //Resaltar el tab actual
    const tab = document.querySelector(`[data-step="${page}"]`);
    tab.classList.add('actual');

}

function switchSection() {
    const links = document.querySelectorAll('.tabs button');
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            page = parseInt(e.target.dataset.step);

            //Llamar la funcion para mostrar la seccion
            showSection();
            buttonsPage();
        })
    })
}

async function showServices() {
    //Una consulta es un buen lugar para usar un bloque try/catch.
    try {
        const result = await fetch('./services.json');
        const db = await result.json();
        const { services } = db;

        //Generar HTML
        services.forEach(service => {
            const { id, name, price } = service;

            //DOM Scripting
            //Genero los nombres de los servicios
            const serviceName = document.createElement('P');
            serviceName.textContent = name;
            serviceName.classList.add('service-name');

            //Genero el precio de los servicios
            const servicePrice = document.createElement('P');
            servicePrice.textContent = `$${price}`;
            servicePrice.classList.add('service-price');

            //Generar Div contenedor de servicios
            const serviceDiv = document.createElement('DIV');
            serviceDiv.classList.add('service');
            serviceDiv.dataset.idService = id;

            //Seleccion un servicio
            serviceDiv.onclick = selectService;

            //Inyectar precio y nombre al div de servicio
            serviceDiv.appendChild(serviceName);
            serviceDiv.appendChild(servicePrice);

            //Inyectarlo en HTML
            document.querySelector('#services').appendChild(serviceDiv);
        });
    } catch (error) {
        console.log(error);
    }
}

function selectService(e) {
    let element;
    //Forzar que elemento al cual le damos click sea el div
    if (e.target.tagName === 'P') {
        element = e.target.parentElement;
    } else {
        element = e.target;
    }

    if (element.classList.contains('selected')) {
        element.classList.remove('selected');

        const id = parseInt(element.dataset.idService);
        deleteService(id);

    } else {
        element.classList.add('selected');

        console.log(element.dataset.idService);
        const serviceObj = {
            id: parseInt(element.dataset.idService),
            name: element.firstElementChild.textContent,
            price: element.firstElementChild.nextElementSibling.textContent
        }
        // console.log(serviceObj);
        addService(serviceObj);
    }
}

function deleteService(id) {
    const { services } = turn;
    turn.services = services.filter(service => service.id !== id);
    console.log(turn);
}

function addService(serviceObj) {
    const { services } = turn;
    turn.services = [...services, serviceObj]; //...Copia los datos del arreglo


    console.log(turn);
}

function nextPage() {
    const nextPage = document.querySelector('#next');
    nextPage.addEventListener('click', () => {
        page++;
        buttonsPage();
    });
}

function backPage() {
    const backPage = document.querySelector('#back');
    backPage.addEventListener('click', () => {
        page--;
        buttonsPage();
    });
}

function buttonsPage() {
    const nextPage = document.querySelector('#next');
    const backPage = document.querySelector('#back');

    if (page === 1) {
        backPage.classList.add('hide');
        nextPage.classList.remove('hide');
    } else if (page === 3) {
        nextPage.classList.add('hide');
        backPage.classList.remove('hide');
        showResume(); // Estamos en la pag3, carga el resumen de la cita

    } else {
        backPage.classList.remove('hide');
        nextPage.classList.remove('hide');
    }

    showSection(); //Cambia la seccion que se muestra
}

function showResume() {
    //Destructuring
    const { name, date, time, services } = turn;
    //Seleccionar el resumen
    const resumeDiv = document.querySelector('.main-resume');
    //Limpiar el HTML previo
    while(resumeDiv.firstChild) {
        resumeDiv.removeChild(resumeDiv.firstChild);
    }
    //Validacion del Objeto 
    if (Object.values(turn).includes('')) {
        const noServices = document.createElement('P');
        noServices.textContent = 'Complete Formulary!';
        noServices.classList.add('cancel-date');
        //Agregar a resumen Div
        resumeDiv.appendChild(noServices);
        return;
    } 

    const headingTurn = document.createElement('H3');
    headingTurn.textContent = 'Resume Date: ';
    //Mostrar el resumen
    const nameTurn = document.createElement('P');
    nameTurn.innerHTML = `<span>Name:</span> ${name}`;

    const dateTurn = document.createElement('P');
    dateTurn.innerHTML = `<span>Date:</span> ${date}`;

    const timeTurn = document.createElement('P');
    timeTurn.innerHTML = `<span>Time:</span> ${time}`;

    const servicesTurn = document.createElement('DIV');
    servicesTurn.classList.add('resume-service');

    const headingServices = document.createElement('H3');
    headingServices.textContent = 'Resume Services: ';

    servicesTurn.appendChild(headingServices);

    let cant = 0;

    //iterar sobre el arreglo de servicios
    services.forEach(service => {
        const {name, price} = service;
        const serviceContent = document.createElement('DIV');
        serviceContent.classList.add('service-content');

        const serviceText = document.createElement('P');
        serviceText.textContent = name;

        const servicePrice = document.createElement('P');
        servicePrice.textContent = price;
        servicePrice.classList.add('price');

        const totalService = price.split('$');
        cant += parseInt(totalService[1].trim());

        //Colocar texto y precio en el Div
        resumeDiv.appendChild(headingTurn);
        serviceContent.appendChild(serviceText);
        serviceContent.appendChild(servicePrice);
        servicesTurn.appendChild(serviceContent);

    });

    resumeDiv.appendChild(nameTurn);
    resumeDiv.appendChild(dateTurn);
    resumeDiv.appendChild(timeTurn);
    resumeDiv.appendChild(servicesTurn);

    const totalPay = document.createElement('P');
    totalPay.classList.add('total');
    totalPay.innerHTML = `<span>Total: </span> $${cant}`;

    resumeDiv.appendChild(totalPay);

 }

function nameTurn() {
    const nameInput = document.querySelector('#name');

    nameInput.addEventListener('input', e => {
        const nameText = e.target.value.trim();
        //validacion de nombre, debe tener algo
        if (nameText === '' || nameText.length < 3) {
            showAlert('Invalid name', 'error');
        } else {
            const alert = document.querySelector('.alert');
            if (alert) alert.remove();
            turn.name = nameText;
        }
    });
}

function showAlert(message, type) {

    //Si hay una alerta previa no crear otra
    const alertExist = document.querySelector('.alert');
    if (alertExist) return;

    const alert = document.createElement('DIV');
    alert.textContent = message;
    alert.classList.add('alert');

    if (type === 'error') alert.classList.add('error');
    //Insertar en el HTML
    const formulary = document.querySelector('.formulary');
    formulary.appendChild(alert);

    //Eliminar la alerta despues de 3 segundos
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function dateTurn() {
    const dateInput = document.querySelector('#date')
    dateInput.addEventListener('input', e => {
        const day = new Date(e.target.value).getUTCDay();

        if ([0].includes(day)) {
            e.preventDefault();
            dateInput.value = '';
            showAlert('Sunday is closed', 'error');
        } else {
            turn.date = dateInput.value;
            console.log(turn);
        }
    })
}

function disableDate() {
    const dateInput = document.querySelector('#date');

    const actualDate = new Date();
    const year = actualDate.getFullYear();
    const month = actualDate.getMonth() + 1;
    const day = actualDate.getDate();
    //formato deseado: AAAA-MM-DD
    const dateDisable = `${year}-${month}-${day}`;
    console.log(dateDisable);
    dateInput.min = dateDisable;
}

function timeTurn() {
    const timeInput = document.querySelector('#time');
    timeInput.addEventListener('input', e => {
        console.log(e.target.value);

        const timeTurn = e.target.value;
        const time = timeTurn.split(':');

        if (time[0] < 8 || time[0] > 20) {
            showAlert('Invalid Time', 'error');
            setTimeout(() => {
                timeInput.value = '';
            }, 3000);

        } else {
            turn.time = timeTurn;
            console.log(turn);
        }
    })

}

