const { guardarDB, leerDB } = require("./helpers/guardarArchivo");
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoChecklist } = require("./helpers/inquirer");
const Tareas = require("./models/tareas");


console.clear();

const main = async () => {

  let opt = '';
  const tareas = new Tareas();

  const tareasDB = leerDB();

  if(tareasDB) {
    tareas.cargarTraeasFromArray(tareasDB);
  }

  do {
    // Imprimir el menú
    opt = await inquirerMenu();
    
    switch (opt) {
      case "1":
        //crear opcion
        const desc = await leerInput("Descripción:");
        tareas.crearTarea(desc);
        break;
      case "2":
        tareas.listadoCompleto();
        break;
      case "3": // listar completadas
        tareas.listarPendientesCompletadas(true);
        break;
      case "4": // listar pendientes
        tareas.listarPendientesCompletadas(false);
        break;
      case "5": // pendiente
        const ids = await mostrarListadoChecklist(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;
      case "6": // eliminar tareas
        const id = await listadoTareasBorrar(tareas.listadoArr);
        if (id !== '0') {
          const ok = confirmar("Estas seguro?");
          if (ok) {
            tareas.borrarTarea(id);
            console.log("Tarea borrada");
          }
        }
        break;
    }

    guardarDB(tareas.listadoArr);

    await pausa();
    
  } while (opt !== '0');
  
//   pausa();
};

main();
