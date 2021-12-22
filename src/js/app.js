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
}

function showSection() {
    //Eliminar la clase actual en el tab anterior
    const backSection = document.querySelector('.show-section');
    if(backSection) {
        backSection.classList.remove('show-section');
    }

    const actualSection = document.querySelector(`#step-${page}`);
    actualSection.classList.add('show-section');

    //Eliminar mostrar-seccion de la seccion anteior
    const backTab = document.querySelector('.tabs .actual');
    if(backTab) {
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
    } else {
        element.classList.add('selected');
    }
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
    } else {
        backPage.classList.remove('hide');
        nextPage.classList.remove('hide');
    }

    showSection(); //Cambia la seccion que se muestra
}

function showResume() {
    //Destructuring
    const {name, date, time, services} = turn;
    //Seleccionar el resumen
    const resumeDiv = document.querySelector('.main-resume')

    //Validacion del Objeto 
    if(Object.values(turn).includes('')) {
        const noServices = document.createElement('P');
        noServices.textContent = 'Complete Formulary!';
        noServices.classList.add('cancel-date');

        //Agregar a resumen Div
        resumeDiv.appendChild(noServices);

    }
}


