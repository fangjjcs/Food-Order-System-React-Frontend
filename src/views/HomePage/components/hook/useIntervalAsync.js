import { useCallback, useEffect, useRef } from "react";

export const useIntervalAsync = (fn, iskeepAsking, ms) => {
    console.log("trigger hook")
    const timeout = useRef();
    const mountedRef = useRef(false);

    const run = useCallback(async () => {
        console.log("fn, ms has changed, run fn")
        await fn();
        if (mountedRef.current) {
            timeout.current = window.setTimeout(run, ms);
        }
    }, [fn, ms]);

    useEffect(() => {
        console.log("run, iskeepAsking has changed",iskeepAsking)
        if(iskeepAsking){
            console.log(" keep running")

            mountedRef.current = true;
            run();
        }
        return () => {
            console.log("clear timer")
            mountedRef.current = false;
            window.clearTimeout(timeout.current);
        };
    }, [run, iskeepAsking]);

};