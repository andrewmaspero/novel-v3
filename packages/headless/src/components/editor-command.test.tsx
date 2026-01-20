import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EditorCommand, EditorCommandOut, EditorCommandTunnelContext } from "./editor-command";
import { novelStore } from "../utils/store";
import { queryAtom, rangeAtom } from "../utils/atoms";

let lastCommandProps: Record<string, unknown> | null = null;

vi.mock("cmdk", () => {
  const Command = ({ children, ...props }: { children: React.ReactNode }) => {
    lastCommandProps = props;
    return (
      <div data-testid="cmdk" {...props}>
        {children}
      </div>
    );
  };
  Command.Input = ({ onValueChange, value, ...rest }: Record<string, unknown>) => (
    <input
      data-testid="cmdk-input"
      value={value as string | number | readonly string[] | undefined}
      onChange={(event) => (onValueChange as ((next: string) => void) | undefined)?.(event.currentTarget.value)}
      readOnly={!onValueChange}
      {...rest}
    />
  );
  Command.List = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  return {
    Command,
    CommandEmpty: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    CommandItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe("EditorCommand", () => {
  it("updates query and range atoms via EditorCommandOut", () => {
    const tunnel = {
      In: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      Out: () => <div data-testid="tunnel-out" />,
    };

    const commandEl = document.createElement("div");
    commandEl.id = "slash-command";
    const handler = vi.fn();
    commandEl.addEventListener("keydown", (event) => {
      event.stopPropagation();
      handler();
    });
    document.body.appendChild(commandEl);

    render(
      <EditorCommandTunnelContext.Provider value={tunnel as never}>
        <EditorCommandOut query="hello" range={{ from: 1, to: 2 }} />
      </EditorCommandTunnelContext.Provider>,
    );

    expect(novelStore.get(queryAtom)).toBe("hello");
    expect(novelStore.get(rangeAtom)).toEqual({ from: 1, to: 2 });
    expect(screen.getByTestId("tunnel-out")).toBeInTheDocument();

    const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true });
    const preventDefault = vi.fn();
    Object.defineProperty(event, "preventDefault", { value: preventDefault });
    document.dispatchEvent(event);
    expect(handler).toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
    commandEl.remove();
  });

  it("renders command input", () => {
    const tunnel = {
      In: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      Out: () => <div />,
    };

    render(
      <EditorCommandTunnelContext.Provider value={tunnel as never}>
        <EditorCommand>
          <div>Child</div>
        </EditorCommand>
      </EditorCommandTunnelContext.Provider>,
    );

    expect(screen.getByTestId("cmdk")).toBeInTheDocument();
    expect(screen.getByTestId("cmdk-input")).toBeInTheDocument();

    const stopPropagation = vi.fn();
    (lastCommandProps?.onKeyDown as (event: KeyboardEvent) => void)?.({
      stopPropagation,
    } as KeyboardEvent);
    expect(stopPropagation).toHaveBeenCalled();
  });
});
