let Asignatura = artifacts.require("Asignatura");


contract('Asignatura:', accounts => {

    let asignatura;

    before(async() => {
        asignatura = await Asignatura.deployed();
        console.log("Asignatura =", asignatura.address);
        //asigna coordinador a primera direccion
        await asignatura.setCoordinador(accounts[1])
        console.log("Coordinador =", accounts[1]);
        //asigna coordinador a segunda direccion
        await asignatura.addProfesor(accounts[2], "Santiago", { from: accounts[0] })
        console.log("Profesor =", accounts[2]);
    });

    it("El owner es el que despliego el contrato", async() => {

        let owner = await asignatura.owner();

        let desplegador = accounts[0];

        assert.equal(owner, desplegador, "El owner debe ser quien despliega en contrato.");
    })


    it("La asignatura es BCDA del curso 2021-2022", async() => {

        let nombre = await asignatura.nombre();
        let curso = await asignatura.curso();

        assert.equal(nombre, "BCDA", "El nombre de la asignatura debe ser BCDA.");
        assert.equal(curso, "2021 Teoría", "La asignatura es del curso 2021 Teoría.");
    })


    it("Inicialmente la asignatura esta vacia", async() => {

        let numEvaluaciones = await asignatura.evaluacionesLength();
        let numMatriculas = await asignatura.matriculasLength();

        assert.equal(numEvaluaciones, 0, "La asignatura no tiene ninguna evaluacion inicialmente.");
        assert.equal(numMatriculas, 0, "La asignatura no tiene ningun alumno matriculado inicialmente");
    })

    it("Asigna el coordinador", async() => {

        await asignatura.setCoordinador(accounts[1])
        let coordinadorAccount = await asignatura.coordinador();

        assert.equal(coordinadorAccount, accounts[1], "El coordinador no se ha asignado correctamente.");
    })


    it("Crear dos evaluaciones correctamente", async() => {

        //solo coordiandor puede hacerlo
        let coordinadorAccount = await asignatura.coordinador();

        // la nota va de 0 a 100.
        await asignatura.creaEvaluacion("Examen Parcial", 12345678, 300, { from: coordinadorAccount });
        await asignatura.creaEvaluacion("Examen Final", 12349999, 700, { from: coordinadorAccount });

        let numEvaluaciones = await asignatura.evaluacionesLength();

        let evaluacion0 = await asignatura.evaluaciones(0);
        let evaluacion1 = await asignatura.evaluaciones(1);

        assert.equal(numEvaluaciones, 2, "La asignatura debe tener dos evaluaciones.");

        assert.equal(evaluacion0.nombre, "Examen Parcial", "La primera evaluacion debe ser el examen parcial.");
        assert.equal(evaluacion0.fecha, 12345678, "La fecha del primer parcial debe ser 12345678.");
        assert.equal(evaluacion0.puntos, 300, "El primer parcial debe valer 3 puntos.");

        assert.equal(evaluacion1.nombre, "Examen Final", "La primera evaluacion debe ser el examen parcial.");
        assert.equal(evaluacion1.fecha, 12349999, "La fecha del examen final debe ser 123499.");
        assert.equal(evaluacion1.puntos, 700, "El examen final debe valer 7 puntos.");
    })


    it("Matricular a dos alumnos correctamente", async() => {

        let evaAccount = accounts[3];
        let pepeAccount = accounts[4];

        await asignatura.automatricula("Eva Martinez", "11122233A", "em@dominio.es", { from: evaAccount });
        await asignatura.automatricula("Jose Redondo", "44455566B", "jr@stio.com", { from: pepeAccount });

        let numMatriculas = await asignatura.matriculasLength();
        assert.equal(numMatriculas, 2, "Tiene que haber dos alumnos matriculados.");

        let direccion0 = await asignatura.matriculas(0);
        let direccion1 = await asignatura.matriculas(1);

        assert.equal(direccion0, evaAccount, "La direccion del primer alumno matriculado esta mal.");
        assert.equal(direccion1, pepeAccount, "La direccion del segundo alumno matriculado esta mal.");

        let matricula0 = await asignatura.datosAlumno(direccion0);
        let matricula1 = await asignatura.datosAlumno(direccion1);

        assert.equal(matricula0.nombre, "Eva Martinez", "El nombre del primer alumno matriculado esta mal.");
        assert.equal(matricula0.dni, "11122233A", "El dni del primer alumno matriculado esta mal.");
        assert.equal(matricula0.email, "em@dominio.es", "El email del primer alumno matriculado esta mal.");

        assert.equal(matricula1.nombre, "Jose Redondo", "El nombre del segundo alumno matriculado esta mal.");
        assert.equal(matricula1.dni, "44455566B", "El dni del segundo alumno matriculado esta mal.");
        assert.equal(matricula1.email, "jr@stio.com", "El email del segundo alumno matriculado esta mal.");
    })

    it("Añadir profesor", async() => {

        await asignatura.addProfesor(accounts[6], "Santiago Segundo", { from: accounts[0] })
        let profesorAccount = await asignatura.profesores(1);

        assert.equal(profesorAccount, accounts[6], "El profesor no se ha asignado correctamente.");
    })

    it("Evaluar correctamente", async() => {

        // solo profesor puede hacerlo
        let profesorAccount = await asignatura.profesores(0);

        let eva = await asignatura.matriculas(0);
        let pepe = await asignatura.matriculas(1);

        let indice = 0;
        let tipoNota = 1;
        let calificacion = 650;
        await asignatura.califica(eva, indice, tipoNota, calificacion, { from: profesorAccount });

        indice = 1;
        tipoNota = 1;
        calificacion = 750;
        await asignatura.califica(eva, indice, tipoNota, calificacion, { from: profesorAccount });

        indice = 0;
        tipoNota = 0;
        calificacion = 0;
        await asignatura.califica(pepe, indice, tipoNota, calificacion, { from: profesorAccount });

        indice = 1;
        tipoNota = 1;
        calificacion = 500;
        await asignatura.califica(pepe, indice, tipoNota, calificacion, { from: profesorAccount });

        // Primer parcial de Eva
        let nota = await asignatura.calificaciones(eva, 0);
        assert.equal(nota.tipo, 1, "La nota del alumno esta mal (1).");
        assert.equal(nota.calificacion, 650, "La nota del alumno esta mal (2).");

        // Final de Eva
        nota = await asignatura.calificaciones(eva, 1);
        assert.equal(nota.tipo, 1, "La nota del alumno esta mal (3).");
        assert.equal(nota.calificacion, 750, "La nota del alumno esta mal (4).");

        // Primer parcial de Pepe
        nota = await asignatura.calificaciones(pepe, 0);
        assert.equal(nota.tipo, 0, "La nota del alumno esta mal (5).");
        assert.equal(nota.calificacion, 0, "La nota del alumno esta mal (6).");

        // Final de Pepe
        nota = await asignatura.calificaciones(pepe, 1);
        assert.equal(nota.tipo, 1, "La nota del alumno esta mal (7).");
        assert.equal(nota.calificacion, 500, "La nota del alumno esta mal (8).");

    })


    it("Un alumno (PEPE) pregunta quien es el", async() => {

        let pepeAccount = accounts[4];

        let datos = await asignatura.quienSoy({ from: pepeAccount });

        assert.equal(datos._nombre, "Jose Redondo", "El nombre de un  alumno matriculado se recupera mal.");
        assert.equal(datos._dni, "44455566B", "El dni de un alumno matriculado se recupera mal.");
        assert.equal(datos._email, "jr@stio.com", "El email de un alumno matriculado se recupera mal.");
    })


    it("Un alumno (PEPE) consulta su nota", async() => {

        let pepeAccount = accounts[4];

        let nota = await asignatura.miNota(1, { from: pepeAccount });

        assert.equal(nota.tipo, 1, "El alumno no puede recuperar su tipo de nota.");
        assert.equal(nota.calificacion, 500, "El alumno no puede recuperar su calificacion.");
    })

});