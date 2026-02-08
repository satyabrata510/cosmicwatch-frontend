import { render as rtlRender, type RenderOptions } from "@testing-library/react";
import { ToastProvider } from "@/components/ui/Toast";
import type { ReactElement } from "react";

function render(ui: ReactElement, options: RenderOptions = {}) {
    return rtlRender(ui, {
        wrapper: ({ children }) => <ToastProvider>{children}</ToastProvider>,
        ...options,
    });
}

export * from "@testing-library/react";
export { render };
