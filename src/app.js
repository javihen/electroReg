<script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
        import { getDatabase, ref, set, get, push, query, orderByChild, equalTo, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

        const firebaseConfig = {
            apiKey: "AIzaSyC_Yl50SusdST7Gqal5UBahp97Y-5iqMzE",
            authDomain: "electroreg-40fdf.firebaseapp.com",
            databaseURL: "https://electroreg-40fdf-default-rtdb.firebaseio.com",
            projectId: "electroreg-40fdf",
            storageBucket: "electroreg-40fdf.firebasestorage.app",
            messagingSenderId: "28054683949",
            appId: "1:28054683949:web:08fdd0d53b9e2feb3153a4"
        };

        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);

        document.addEventListener("DOMContentLoaded", () => {
            document
                .getElementById("userForm")
                .addEventListener("submit", agregarUsuario);
        });


        //=========== FUNCION QUE SE EJECUTA ===========//
        obtenerUsuarios();
        //=========== FUNCION AGREGAR USUARIO ==========//
        function agregarUsuario(event) {
            event.preventDefault();

            const ci = document.getElementById("ci").value;
            const apellidos = document.getElementById("apellidos").value;
            const nombres = document.getElementById("nombres").value;
            const rol = document.getElementById("rol").value;

            buscarUsuarioPorCI(ci).then((existeUsuario) => {
                if (!existeUsuario) {
                    // Generar un ID aleatorio y guardar en Firebase
                    const usuariosRef = ref(database, "usuarios");
                    const nuevoUsuarioRef = push(usuariosRef); // Crea un ID único automáticamente

                    set(nuevoUsuarioRef, {
                        ci: ci,
                        apellidos: apellidos,
                        nombres: nombres,
                        rol: rol,
                    })
                        .then(() => {
                            alert("Usuario agregado correctamente.");
                            document.getElementById("userForm").reset();
                            obtenerUsuarios();
                        })
                        .catch((error) => {
                            console.error("Error al agregar usuario:", error);
                        });
                } else {
                    console.log(buscarUsuarioPorCI(ci));
                    alert("El usuario con ci ya se encuentra registrado")
                }
            });
        }
        //============ FUNCION CERRAR MODAL ============//
        function cerrarModal() {
            document.getElementById("crud-modal").classList.add("hidden");
        }
        //======== FUNCION BUSQUEDA DE USUARIO =========//
        function buscarUsuarioPorCI(ci) {
            const db = getDatabase();
            const usuariosRef = ref(db, "usuarios"); // Referencia a la colección de usuarios

            // Crear la consulta para buscar por CI
            const consulta = query(usuariosRef, orderByChild("ci"), equalTo(ci)); // Buscar por "ci"

            // Ejecutar la consulta
            return get(consulta)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        console.log("Usuario encontrado:", snapshot.val()); // Mostrar los datos encontrados
                        return true; // Si se encuentra el usuario, retorna true
                    } else {
                        console.log("No se encontró ningún usuario con ese CI."); // Para depuración
                        return false; // Si no se encuentra, retorna false
                    }
                })
                .catch((error) => {
                    console.error("Error al buscar el usuario:", error);
                    return false; // Retorna false si hay un error en la consulta
                });
        }
        //======= FUNCION PARA OBTENER USUARIOS ========//
        function obtenerUsuarios() {
            const db = getDatabase();
            const usuariosRef = ref(db, "usuarios"); // Referencia a la colección de usuarios

            // Obtener todos los usuarios
            get(usuariosRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        // Llamar a la función para mostrar los usuarios en la tabla
                        mostrarUsuarios(snapshot.val());
                    } else {
                        console.log("No hay usuarios registrados.");
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener usuarios:", error);
                });
        }
        //==== FUNCION PARA MOSTRAR A LOS USUARIOS ====//
        function mostrarUsuarios(usuarios) {
            const tabla = document.getElementById("tablaUsuarios"); // Referencia a la tabla HTML
            tabla.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

            // Crear la cabecera de la tabla
            const header = `<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Nro
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Apellido Paterno
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Apellido Materno
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Nombres
                        </th>
                        <th scope="col" class="px-6 py-3">
                            CI
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Rol
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Opciones
                        </th>
                    </tr>
                </thead>`;
            tabla.innerHTML += header;
            // Convertir los usuarios a un arreglo de objetos
            const usuariosArray = Object.values(usuarios);

            // Ordenar los usuarios por apellidos (alfabéticamente)
            usuariosArray.sort((a, b) => {
                if (a.apellidos.toLowerCase() < b.apellidos.toLowerCase()) {
                    return -1;
                }
                if (a.apellidos.toLowerCase() > b.apellidos.toLowerCase()) {
                    return 1;
                }
                return 0;
            });

            // Iterar sobre los usuarios y crear las filas de la tabla
            let i = 1;
            usuariosArray.forEach((usuario) => {
                const row = `
                    <tr
                        class="border-b border-gray-200 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            ${i}
                        </th>
                        <td class="px-6 py-4">
                            ${usuario.apellidos}
                        </td>
                        <td class="px-6 py-4">
                            ${usuario.apellidos}
                        </td>
                        <td class="px-6 py-4">
                            ${usuario.nombres}
                        </td>
                        <td class="px-6 py-4">
                            ${usuario.ci}
                        </td>
                        <td class="px-6 py-4">
                            <span
                                class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">${usuario.rol}</span>
                        </td>
                        <td class="px-6 py-4">
                            <button type="button"
                                class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500 ">
                                <i class='bx bx-edit-alt'></i>

                            </button>
                            <button type="button"
                                class="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 btn-eliminar" data-ci="${usuario.ci}">
                                <i class='bx bx-trash'></i>

                            </button>
                            <button type="button"
                                class="text-slate-700 border border-slate-700 hover:bg-slate-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 btn-modal" data-ci="${usuario.ci}">
                                <i class='bx bx-purchase-tag-alt'></i>

                            </button>
                        </td>
                    </tr>`;
                tabla.innerHTML += row;
                i++;
            }
            )
        }

        function abrirModal(ci) {
            console.log("abrir modal")
        }
        // Agrega el evento a un elemento contenedor (delegación de eventos) esto nos funciona para cuando la tabla es generada de forma dinamica
        document.getElementById("tablaUsuarios").addEventListener("click", function (event) {
            if (event.target.closest(".btn-eliminar")) {
                const ci = event.target.closest(".btn-eliminar").dataset.ci;
                eliminarUsuario(ci);
            }
            if (event.target.closest(".btn-modal")) {
                const ci = event.target.closest(".btn-modal").dataset.ci;
                abrirModal(ci);
            }
        });

        // Función para eliminar un usuario de Firebase
        function eliminarUsuario(ci) {
            const db = getDatabase();
            const usuariosRef = ref(db, "usuarios");

            // Consulta para buscar el usuario por su CI
            const consulta = query(usuariosRef, orderByChild("ci"), equalTo(ci));

            get(consulta)
                .then(snapshot => {
                    if (snapshot.exists()) {
                        const usuarioKey = Object.keys(snapshot.val())[0]; // Obtener la clave del usuario
                        const usuarioAEliminarRef = ref(db, `usuarios/${usuarioKey}`);

                        // Eliminar el usuario
                        remove(usuarioAEliminarRef)
                            .then(() => {
                                console.log("✅ Usuario eliminado con éxito");
                                alert(" ✅ Usuario eliminado correctamente.");
                                obtenerUsuarios();
                            })
                            .catch(error => console.error("Error al eliminar usuario:", error));
                    } else {
                        console.log("Usuario no encontrado.");
                    }
                })
                .catch(error => console.error("Error en la consulta:", error));
        }


    </script>
