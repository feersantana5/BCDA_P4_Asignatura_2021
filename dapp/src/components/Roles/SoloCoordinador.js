import { drizzleReactHooks } from '@drizzle/react-plugin'
const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const SoloCoordinador = ({ children }) => {
    const { useCacheCall } = useDrizzle();
    const drizzleState = useDrizzleState(state => state);
    const coordinador = useCacheCall("Asignatura", "coordinador");

    if (coordinador !== drizzleState.accounts[0]) {
        return <></>
    } else {
        return <>
            {children}
        </>
    }

};

export default SoloCoordinador;