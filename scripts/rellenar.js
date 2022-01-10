module.exports = async callback => {

    try {
        const Asignatura = artifacts.require("./Asignatura.sol");

        // Usar las cuentas de usuario
        const accounts = await web3.eth.getAccounts();
        if (accounts.length < 8) {
            throw new Error("No hay cuentas.");
        }

        let asignatura = await Asignatura.deployed();
		
		// Asignar coordinador
		await asignatura.setCoordinador(accounts[1]);
        let coordinador = await asignatura.coordinador();
        console.log("Cuenta del coordinador =", coordinador);
        //console.log("Cuenta del coordinador2 =", accounts[1]);

		// Añadir profesor
		await asignatura.addProfesor(accounts[2], "Santiago");
        let profesor = await asignatura.profesores(0);
        console.log("Cuenta del profesor =", profesor);
	
		// Crear evaluación. Importante añadir el 'from:coordinador' porque ahora el método es soloCoordinador.
        console.log("Crear dos evaluaciones:");
        await asignatura.creaEvaluacion("Examen Parcial", 12345678, 300, { from: accounts[1] });
        await asignatura.creaEvaluacion("Examen Final", 12349999, 700, { from: coordinador });
		console.log("                        OK")
		
		// Matricular alumnos
        console.log("Matricular a dos alumnos:");
        let evaAccount = accounts[3];
        let pepeAccount = accounts[4];
        console.log("Cuenta de Eva =", evaAccount);
        console.log("Cuenta de Pepe =", pepeAccount);
        await asignatura.automatricula("Eva Martinez", "11122233A", "em@dominio.es", {from: evaAccount});
        await asignatura.automatricula("Jose Redondo", "44455566B", "jr@stio.com", {from: pepeAccount});
		console.log("                        OK")
		
		// Añadir calificaciones. Importante añadir el 'from: profesor' porque ahora el método es soloProfesor
        console.log("Añadir calificaciones:");
        await asignatura.califica(evaAccount, 0, 1, 650, { from: profesor });
        await asignatura.califica(evaAccount, 1, 1, 750, { from: profesor });
        await asignatura.califica(pepeAccount, 0, 0, 0, { from: profesor });
        await asignatura.califica(pepeAccount, 1, 1, 500, { from: profesor });
		console.log("                        OK")
    
	} catch (err) {   // Capturar errores
        console.log(`Error: ${err}`);
    } finally {
        console.log("FIN");
    }

    callback();      // Terminar
};
