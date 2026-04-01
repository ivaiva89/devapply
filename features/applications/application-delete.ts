export type DeleteApplicationActionState = {
  status: "idle" | "error" | "success";
  error?: string;
};

export function getDeleteApplicationInitialState(): DeleteApplicationActionState {
  return {
    status: "idle",
  };
}
