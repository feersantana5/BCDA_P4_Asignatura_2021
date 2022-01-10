// SPDX-License-Identifier: UNLICENSED
// AUTORES: Fernando Santana Falcon y Unai Gil Zubeldia
pragma solidity ^0.8.7;

contract Asignatura{
    
    // Nombre de la asignatura
    string public nombre;
    
    // Curso academico
    string public curso;
    
    // Direccion del usuario que ha creado/desplegado el contrato
    address public owner;
    
    // Direccion del coordinador de la asignatura
    address public coordinador;
    
    // Indica si la asignatura ya ha sido cerrada o no
    bool public cerrada;
    
    // Mapping datosProfesor Acceder a los datos de un profesor dada su direccion
    mapping (address => DatosProfesor) public datosProfesor;
    
    // Array con las direcciones de los profesores
    address[] public profesores;
    
    // Datos de un profesor¿?¿?¿?¿?¿
    struct DatosProfesor {
        string nombre;
    }

    //OTRA OPC Y CARGARME EL OTRO Y EL STRUCT
    //mapping(address => string) public datosProfesor;  // Mapping Address -> Nombre profesor.
    
     // Datos de una evaluación.
    struct Evaluacion {
        string nombre;
        uint fecha;
        uint puntos;
    }
    
    // Evaluaciones de la asignatura
    Evaluacion[] public evaluaciones;
    
    // Datos de un alumno
    struct DatosAlumno {
        string nombre;
        string dni;
        string email;
    }
    
    // Acceder a los datos de un alumno dada su direccion
    mapping (address => DatosAlumno) public datosAlumno;
    
    // Array con las direcciones de los alumnos matriculados
    address[] public matriculas;
    
    /**
     * Constructor.
     *
     * @param _nombre Nombre de la asignatura.
     * @param _curso Curso academico.
     */
    constructor(string memory _nombre, string memory _curso){
        bytes memory bn = bytes(_nombre);
        require(bn.length !=0, "El nombre de la asignatura no puede estar vacio");
        bytes memory bc = bytes(_curso);
        require(bc.length !=0, "El curso academico de la asignatura no puede estar vacio");
        
        owner = msg.sender;
        nombre = _nombre;
        curso = _curso;
        cerrada = false;
    }

    // metodo que impide que pueda enviarse dinero al contrato
    receive() external payable {
        revert("No se permite la recepcion de dinero.");
    }
    
    // metodo para cambiar el valor de la propiedad coordinador
    function setCoordinador(address newCoordinador) soloOwner soloAbierta public{
        coordinador = newCoordinador;
    }
    
    // Metodo cerrar
    function cerrar() public soloCoordinador {
        cerrada = true;
    }

    // Metodo abrir
    function abrir() soloCoordinador public{
        cerrada = false;
    }
    
    // Metodo para añadir un profesor a la asignatura
    function addProfesor(address profesor, string memory _nombreProf) soloOwner soloAbierta public{
       bytes memory n = bytes(_nombreProf);
       require(n.length != 0, "El nombre del profesor no puede estar vacio");
       require(estaProfesor(profesor) == false, "Solo se puede anadir una vez a un profesor.");
       
        profesores.push(profesor);
        datosProfesor[profesor].nombre = _nombreProf;
    }
    
    function estaProfesor(address profesor) private view returns (bool) {
        string memory _nombre  = datosProfesor[profesor].nombre;
        bytes memory b = bytes(_nombre);
        return b.length != 0;
    }
    
    // El numero de profesores añadidos
    function profesoresLength() public view returns (uint){
        return profesores.length;
    }
    
    // Error personalizado si el DNI esta repetido
    error ErrorDNI();
    
    // TO REVISAR
    // Mapping Dni ->  true: si matriculado - false: no.
    mapping(string => bool) public ids;                            

    // metodo para automatricularse en la asignatura
        function automatricula(string memory _nombre, string memory _dni, string memory _email) noMatriculados soloAbierta public {
        bytes memory n = bytes(_nombre);
        require(n.length != 0, "El nombre no puede estar vacio.");
        bytes memory d = bytes(_dni);
        require(d.length != 0, "El dni no puede estar vacio.");
        
        // TODO: REVISAR
        if(estaDNI(_dni)) revert ErrorDNI();

        DatosAlumno memory datos = DatosAlumno(_nombre, _dni, _email);
        datosAlumno[msg.sender] = datos;
        ids[_dni]=true;
        matriculas.push(msg.sender);
    }

    /* EL VIEJO
        function estaDNI(address alumno) private view returns (bool) {
        string memory _dni = datosAlumno[alumno].dni;
        bytes memory d = bytes(_dni);
        return d.length != 0;
    }
    */

       function estaDNI(string memory _dni) private view returns (bool) {
        return ids[_dni];
    }

    // Metodo que devuelve el numero de alumnos matriculados
    function matriculasLength() public view returns(uint){
        return matriculas.length;
    }
    
    // Metodo que devuelve el nombre, el dni y el email del alumno que ha invocado a este metodo
    function quienSoy() soloMatriculados public view returns (string memory _nombre, string memory _dni, string memory _email) {
    DatosAlumno memory datos = datosAlumno[msg.sender];
    _nombre = datos.nombre;
    _dni = datos.dni;
    _email = datos.email;
    }

    // metodo que devuelve el número de evaluaciones creadas
    function evaluacionesLength() public view returns(uint) {
        return evaluaciones.length;
    }
    
    /**
     * Crear una prueba de evaluacion de la asignatura. Por ejemplo, el primer parcial, o la practica 3.
     * Las evaluaciones se meteran en el array evaluaciones, y nos referiremos a ellas por su posicion en el array.
     *
     * @param _nombre El nombre de la evaluacion.
     * @param _fecha La fecha de evaluacion (segundos desde el 1/1/1970).
     * @param _puntos Los puntos que proporciona a la nota final.
     *
     * @return La posicion en el array evaluaciones,
     */
    function creaEvaluacion(string memory _nombre, uint _fecha, uint _puntos) soloCoordinador soloAbierta public returns (uint) {
        bytes memory bn = bytes(_nombre);
        require(bn.length != 0, "El nombre de la evaluacion no puede ser vacio");
        evaluaciones.push(Evaluacion(_nombre, _fecha, _puntos));
        return evaluaciones.length - 1;
    }
    
    
    // Tipos de notas: no presentado, nota entre 0 y 10 y matricuka de honor
    enum TipoNota { NP, Normal, MH }
    
    /**
     * Datos de una nota
     * La calificacion esta multipilicada por 1000 porque no hay decimales
     */
    struct Nota {
        TipoNota tipo;
        uint calificacion;
    }
    
    /**
     * Poner la nota de un alumno en una evaluacion
     * 
     * @param alumno La direccion del alumno.
     * @param evaluacion El indice de una evaluacion en el array evaluaciones.
     * @param tipo Tipo de nota.
     * @param calificacion La calificacion, multipilicada por 1000 porque no hay decimales
     */
    function califica(address alumno, uint evaluacion, TipoNota tipo, uint calificacion) soloProfesor soloAbierta public {
        require(estaMatriculado(alumno), "Solo se pueden calificar a un alumno matriculado.");
        require(evaluacion < evaluaciones.length, "No se puede calificar una evaluacion que no existe.");
        require(calificacion <= 1000, "No se puede calificar con una nota superior a la maxima permitida (10.0).");
        require(calificacion >= 0, "No se puede calificar con una nota inferior a la minima permitida (0.00).");

        Nota memory nota = Nota(tipo, calificacion);
        
        calificaciones[alumno][evaluacion] = nota;
    }
    
    // Dada la direccion de un alumno, y el indice de la evaluacion, devuelve la nota del alumno
    mapping (address => mapping (uint => Nota)) public calificaciones;
    
    /**
     * Devuelve el tipo de nota y la calificacion que ha sacado el alumno que invoca el metodo en la evaluacion pasada como parametro
     *
     * @param evaluacion Indice de una evaluacion en el array de evaluaciones
     * @return tipo El tipo de nota que ha sacado el alumno
     * @return calificacion La calificacion que ha sacado el alumno
     */
    function miNota(uint evaluacion) soloMatriculados public view returns (TipoNota tipo, uint calificacion) {
        require(evaluacion < evaluaciones.length, "El indice de la evaluacion no existe.");
        Nota memory nota = calificaciones[msg.sender][evaluacion];
        tipo = nota.tipo;
        calificacion = nota.calificacion;
    }
    
    // Modificador para que una funcion solo la pueda ejecutar el owner 
    // Se usa en setCoordinador y addProfesor 
    modifier soloOwner() {
        require(msg.sender == owner, "Solo permitido al owner");
        _;
    }
    
    // Modificador para que una funcion solo la pueda ejecutar el coordinador de la asignatura
    // Se usa en cerrar y creaEvaluacion
    modifier soloCoordinador() {
        require(msg.sender == coordinador, "Solo permitido al coordinador de la asignatura");
        _;
    }
    
    // Modificador para que una funcion solo la pueda ejecutar el profesor 
    // Se usa en califica 
    modifier soloProfesor() {
        require(hayProfesor(msg.sender), "Solo permitido al profesor");
        _;
    }
    
    // Metodo que verifica que exista el profesor
     function hayProfesor (address profesor) private view returns (bool) {
        string memory _nombre = datosProfesor[profesor].nombre;
        bytes memory b = bytes(_nombre);
        return b.length != 0;
    }  
    
    
    // Modificador para que una funcion solo la pueda ejecutar un alumno matriculado
    // Se usa en quienSoy y miNota 
    modifier soloMatriculados() {
        require(estaMatriculado(msg.sender), "Solo permitido a alumnos matriculados");
        _;
    }
    
    
    // Modificador para que una funcion solo la pueda ejecutar un alumno no matriculado aun
    // Se usa en automatricula 
    modifier noMatriculados() {
        require(!estaMatriculado(msg.sender), "Solo permitido a alumnos no matriculados");
        _;
    }
    
    /**
     * Consulta si una direccion pertenece a un alumno matriculado
     * @param alumno La direccion de un alumno.
     * @return true si es una alumno matriculado.
     */
    function estaMatriculado(address alumno) private view returns (bool) {
        string memory _nombre = datosAlumno[alumno].nombre;
        bytes memory b = bytes(_nombre);
        return b.length != 0;
    }
    
    // Modificador para que una funcion solo la pueda ejecutar en asignaturas abiertas
    // Se usa en setCoordinador, addProfesor, automatricula, creaEvaluacion y califica
    modifier soloAbierta() {
        require(cerrada == false, "Solo permitido en asignaturas abiertas");
        _;
    }
    
}