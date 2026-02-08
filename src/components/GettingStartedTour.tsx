import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

type TourStep = {
    target: string;
    title: string;
    description: string;
};
type Props = {
    run: boolean;
    steps: TourStep[];
    onFinish: () => void;
};
function GettingStartedTour({ run, steps, onFinish }: Props) {
    useEffect(() => {
        if (!run) return;
        if (!steps || steps.length === 0) return;

        const driverObj = driver({
        showProgress: true,
        allowClose: true,
        nextBtnText: "Next",
        prevBtnText: "Back",
        doneBtnText: "Finish",
        });

        // 🔥 AQUÍ ES DONDE VA LO QUE NO SABÍAS DÓNDE PONER
        driverObj.setSteps(
        steps.map((step) => ({
            element: step.target,
            popover: {
            title: step.title,
            description: step.description,
            side: "top",
            align: "center",
            },
        }))
        );

        driverObj.drive();
        return () => {
        onFinish();
        };
    }, [run, steps, onFinish]);
    return null;
}

export default GettingStartedTour;
