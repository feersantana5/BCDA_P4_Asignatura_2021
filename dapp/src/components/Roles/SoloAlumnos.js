import { drizzleReactHooks } from '@drizzle/react-plugin'
const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const SoloAlumnos = ({ children }) => {
    const { useCacheCall } = useDrizzle();
    const drizzleState = useDrizzleState(state => state);
    const addr = drizzleState.accounts[0];
    const existeAlumno = useCacheCall("Asignatura", "datosAlumno", addr);
    
    if (!existeAlumno?.nombre) {
        return <></>
    } else {
        return <>
            {children}
        </>
    }
};

export default SoloAlumnos;