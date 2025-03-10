
// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC_Yl50SusdST7Gqal5UBahp97Y-5iqMzE",
  authDomain: "electroreg-40fdf.firebaseapp.com",
  databaseURL: "https://electroreg-40fdf-default-rtdb.firebaseio.com",
  projectId: "electroreg-40fdf",
  storageBucket: "electroreg-40fdf.firebasestorage.app",
  messagingSenderId: "28054683949",
  appId: "1:28054683949:web:08fdd0d53b9e2feb3153a4"
  };
  
  // Inicializa Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  // Referencia a la base de datos de horarios
  const horariosRef = database.ref("horarios");
  
  // Días de la semana
  const daysOfWeek = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
  
  // Función para cargar los horarios desde Firebase
function loadSchedule() {
    // Referencia a la base de datos de horarios
    const horariosRef = database.ref("horarios");
  
    horariosRef.once("value").then(snapshot => {
      const data = snapshot.val();
      //console.log(data);
      // Obtener el contenedor de la tabla donde se mostrarán los horarios
      const scheduleContainer = document.getElementById("schedule");
  
      // Limpiar la interfaz antes de cargar los nuevos datos
      scheduleContainer.innerHTML = "";
  
      // Crear un objeto que contendrá los horarios organizados por día
      const schedulesByDay = {
        "LUNES": [],
        "MARTES": [],
        "MIERCOLES": [],
        "JUEVES": [],
        "VIERNES": [],
        "SABADO": []
      };
      //console.log(schedulesByDay);
      // Agrupar los horarios por día
      Object.values(data).forEach(schedule => {
        const { dia, horaI, horaF, idProfesor, materia, semestre } = schedule;
        
        if (schedulesByDay[dia]) {
          schedulesByDay[dia].push({ horaI, horaF, idProfesor, materia, semestre });
        }
      });
  
      // Crear las filas de la tabla (por cada hora en el horario)
      const hours = ["07:30", "09:00", "10:30", "12:00", "13:30", "15:00", "19:00", "20:30"];
      hours.forEach(hour => {
        const row = document.createElement("tr");
        row.classList.add("border-b", "border-gray-200", "bg-gray-50");
        // Crear la celda para la hora
        const hourCell = document.createElement("td");
        hourCell.classList.add("border", "border-gray-300", "px-4", "py-2", "text-center");
        hourCell.textContent = hour;
        row.appendChild(hourCell);
  
        // Crear las celdas para cada día de la semana
        daysOfWeek.forEach(day => {
          const dayCell = document.createElement("td");
          dayCell.classList.add("border", "border-gray-300", "py-2", "text-center");
  
          // Verificar si existen horarios para el día y hora
          const schedulesForDay = schedulesByDay[day];

          if (schedulesForDay) {
            const scheduleForHour = schedulesForDay.find(schedule => schedule.horaI === hour);
            //console.log(scheduleForHour);
            // Si hay un horario, mostrar la materia y el profesor
            if (scheduleForHour) {
                // Crear un td con el contenido de tu botón y la clase proporcionada
                const buttonTd = document.createElement("td");
                buttonTd.classList.add("block", "py-4", "bg-gray-50");
                console.log(scheduleForHour)
                // Crear el contenedor del grupo de botones
                const buttonGroup = document.createElement("div");
                buttonGroup.classList.add("relative");
            
                // Crear el botón principal
                const button = document.createElement("button");
                button.setAttribute("data-id", "-OIlyImOMr3CtQKr9qRB");
                button.setAttribute("data-nombre", scheduleForHour.materia);
                button.classList.add("w-full", "bg-gray-800", "hover:bg-gray-700", "focus:ring-4", "focus:outline-none", "focus:ring-gray-300", "text-white", "rounded-lg", "py-2.5", "h-20");
            
                // Crear el contenido de texto dentro del botón principal
                const divText = document.createElement("div");
                divText.classList.add("text-center", "rtl:text-right");
            
                const divContent = document.createElement("div");
                divContent.classList.add("mt-1", "font-sans", "text-sm", "font-semibold");
                divContent.textContent = scheduleForHour.materia;
            
                const subText = document.createElement("div");
                subText.classList.add("mb-1", "text-xs", "font-thin");
                subText.textContent = `Ing. ${scheduleForHour.idProfesor}`;
            
                divContent.appendChild(subText);
                divText.appendChild(divContent);
                button.appendChild(divText);
            
                // Crear el botón de tres puntos (icono) para abrir el modal
                const dropdownButton = document.createElement("button");
                dropdownButton.classList.add("absolute", "top-0", "right-0", "text-white", "bg-transparent", "hover:bg-gray-700", "focus:ring-4", "focus:outline-none", "focus:ring-gray-300", "rounded", "p-2", "text-lg");
                dropdownButton.innerHTML = `
                    <i class='bx bx-edit-alt'></i>
                `;
            
                // Asignar el evento al botón de tres puntos para abrir el modal
                dropdownButton.addEventListener("click", function (event) {
                    event.stopPropagation(); // Evita que el clic afecte al botón
                    const datos = {
                        materia: button.getAttribute("data-nombre"),
                        idProfesor: button.getAttribute("data-id")
                    };
                    abrirModal(datos);

                });
            
                // Agregar el botón principal y el de tres puntos al grupo de botones
                buttonGroup.appendChild(button);
                buttonGroup.appendChild(dropdownButton);
            
                // Agregar el grupo de botones al td
                buttonTd.appendChild(buttonGroup);
            
                // Agregar el td al contenedor (celda)
                dayCell.appendChild(buttonTd);
            }
            
          }
          
          // Agregar la celda a la fila
          row.appendChild(dayCell);
        });
  
        // Agregar la fila a la tabla
        scheduleContainer.appendChild(row);
      });
    }).catch(error => {
      console.error("Error al cargar los horarios:", error);
    });
  }
  

  // Cargar el horario al cargar la página
  window.onload = loadSchedule;
  
  function abrirModal(datos){
    console.log("presionamos los 3 puntitos"+datos.idProfesor);
    const modal = document.getElementById('default-modal');
    const modalContent = modal.querySelector(".relative");

    modal.classList.remove("hidden");
    modalContent.classList.remove("hidden"); // Asegúrate de que el contenido del modal también esté visible

    // Opcional: centrar el modal en la pantalla si es necesario
    modalContent.style.transform = 'translate(-50%, -50%)';
    modalContent.style.position = 'absolute';
    modalContent.style.top = '50%';
    modalContent.style.left = '50%';

}

  document.addEventListener("DOMContentLoaded", function () {
    // Función que se ejecuta cuando cualquiera de los botones es presionado
    function irAPaginaB(event) {
        // Verificamos si el objetivo del clic es un botón con el atributo data-id
        const boton = event.target.closest('button[data-id]'); // Buscar el botón que fue presionado
        if (boton) {
            const dato = boton.getAttribute("data-id"); // Obtener el valor de data-id del botón presionado
            const nombre = boton.getAttribute("data-nombre"); // Obtener el valor de data-nombre
            sessionStorage.setItem("idHorario", dato); // Guardar en sessionStorage
            sessionStorage.setItem("nombreHorario", nombre); // Guardar nombre de la materia en sessionStorage

            // Redirigir a la página B
            window.location.href = "clase.html"; // Aquí pones la ruta de la página B
        }
    }
    

    // Asignar el evento de clic a los botones generados dinámicamente
    document.body.addEventListener("click", irAPaginaB);
});
