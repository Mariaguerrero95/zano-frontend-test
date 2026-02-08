import { useState } from "react";

type TourStep = {
    id: string;
    target: string;
    title: string;
    description: string;
};
type Props = {
    steps: TourStep[];
    onSave: (steps: TourStep[]) => void;
};
function TourStepsEditor({ steps, onSave }: Props) {
    const [localSteps, setLocalSteps] = useState(steps);
    const updateStep = (
        id: string,
        field: keyof TourStep,
        value: string
    ) => {
        setLocalSteps((prev) =>
        prev.map((s) =>
            s.id === id ? { ...s, [field]: value } : s
        )
        );
    };
    return (
        <div style={{ marginBottom: 40 }}>
        <h3>🧭 Guided tour steps</h3>
        {localSteps.map((step, index) => (
            <div
            key={step.id}
            style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
                background: "#fafafa",
            }}
            >
            <strong>Step {index + 1}</strong>
            <input
                value={step.title}
                onChange={(e) =>
                updateStep(step.id, "title", e.target.value)
                }
                placeholder="Title"
                style={{ width: "100%", marginTop: 8 }}
            />
            <textarea
                value={step.description}
                onChange={(e) =>
                updateStep(step.id, "description", e.target.value)
                }
                placeholder="Description"
                style={{ width: "100%", marginTop: 8 }}
            />
            <input
                value={step.target}
                onChange={(e) =>
                updateStep(step.id, "target", e.target.value)
                }
                placeholder=".css-selector"
                style={{ width: "100%", marginTop: 8 }}
            />
            </div>
        ))}
        <button onClick={() => onSave(localSteps)}>
            Save tour steps
        </button>
        </div>
    );
}

export default TourStepsEditor;
