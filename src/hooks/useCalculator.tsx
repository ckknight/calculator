import { createContext, useReducer } from "react";

export enum Operation {
  Division,
  Multiplication,
  Subtraction,
  Addition
}

enum StackItemType {
  Number,
  Operation
}
interface NumberStackItem {
  type: StackItemType.Number;
  value: number;
}
interface OperationStackItem {
  type: StackItemType.Operation;
  operation: Operation;
}
type StackItem = NumberStackItem | OperationStackItem;

interface NumberModel {
  integer: ReadonlyArray<number>;
  dot: boolean;
  fraction: ReadonlyArray<number>;
  negative: boolean;
}
const emptyNumberModel: NumberModel = {
  integer: [],
  dot: false,
  fraction: [],
  negative: false
};
function modelToNumber(model: NumberModel) {
  if (model.integer.length === 0 && model.fraction.length === 0) {
    return model.negative ? -0 : 0;
  }
  return Number(
    (model.negative ? "-" : "") +
      model.integer.join("") +
      "." +
      model.fraction.join("")
  );
}
function numberToModel(value: number): NumberModel {
  if (!Number.isFinite(value)) {
    throw new RangeError(`value must be finite, got ${value}`);
  }
  const chars = Math.abs(value)
    .toFixed(20)
    .split("");
  const dotIndex = chars.indexOf(".");
  const eIndex = chars.indexOf("e");
  if (eIndex !== -1) {
    throw new Error("Not implemented");
  }
  if (dotIndex === -1) {
    throw new Error("Not implemented");
  }
  const integer = chars.slice(0, dotIndex).map(Number);
  const untrimmedFraction = chars.slice(dotIndex + 1).map(Number);
  const trailingZeroes = countTrailingZeroes(untrimmedFraction);
  const fraction =
    trailingZeroes === 0
      ? untrimmedFraction
      : untrimmedFraction.slice(0, -trailingZeroes);
  return {
    integer,
    dot: fraction.length > 0,
    fraction,
    negative: value < 0
  };
}

interface State {
  stack: ReadonlyArray<StackItem>;
  current: NumberModel;
}
const initialState: State = {
  stack: [],
  current: emptyNumberModel
};

enum ActionType {
  PressDigit,
  Dot,
  AllClear,
  Negate,
  Percentage,
  Divide,
  Multiply,
  Subtract,
  Add,
  Equals
}
export { ActionType as CalculatorActionType };

type Action<T extends ActionType, O = {}> = { type: T } & O;

export type CalculatorAction =
  | Action<ActionType.PressDigit, { digit: number }>
  | Action<ActionType.Dot>
  | Action<ActionType.AllClear>
  | Action<ActionType.Negate>
  | Action<ActionType.Percentage>
  | Action<ActionType.Divide>
  | Action<ActionType.Multiply>
  | Action<ActionType.Subtract>
  | Action<ActionType.Add>
  | Action<ActionType.Equals>;
export type CalculatorDispatch = React.Dispatch<CalculatorAction>;

export const CalculatorContext = createContext<CalculatorDispatch>(() => {
  throw new Error(`Must be in the hierarchy of a CalculatorContext.Provider`);
});

function reducer(state: State, action: CalculatorAction): State {
  switch (action.type) {
    case ActionType.PressDigit:
      return {
        ...state,
        current:
          state.current.dot || state.current.fraction.length > 0
            ? {
                ...state.current,
                fraction: state.current.fraction.concat([action.digit])
              }
            : {
                ...state.current,
                integer: state.current.integer.concat([action.digit])
              }
      };
    case ActionType.Dot:
      return {
        ...state,
        current: {
          ...state.current,
          dot: true
        }
      };
    case ActionType.AllClear:
      return initialState;
    case ActionType.Negate:
      return {
        ...state,
        current: {
          ...state.current,
          negative: !state.current.negative
        }
      };
    case ActionType.Percentage:
      return {
        ...state,
        current: numberToModel(modelToNumber(state.current) / 100)
      };
    case ActionType.Divide:
      return addOperation(state, Operation.Division);
    case ActionType.Multiply:
      return addOperation(state, Operation.Multiplication);
    case ActionType.Subtract:
      return addOperation(state, Operation.Subtraction);
    case ActionType.Add:
      return addOperation(state, Operation.Addition);
    case ActionType.Equals:
      return {
        ...state,
        stack: [],
        current: numberToModel(
          calculate(
            state.stack.concat([
              {
                type: StackItemType.Number,
                value: modelToNumber(state.current)
              }
            ])
          )
        )
      };
  }
}

function addOperation(state: State, operation: Operation): State {
  return {
    ...state,
    stack: [
      ...state.stack,
      {
        type: StackItemType.Number,
        value: modelToNumber(state.current)
      },
      {
        type: StackItemType.Operation,
        operation
      }
    ],
    current: emptyNumberModel
  };
}

function calculate(stack: ReadonlyArray<StackItem>): number {
  if (stack.length === 1) {
    const item = stack[0];
    if (item.type === StackItemType.Number) {
      return item.value;
    }
    throw new Error(`Unexpected item with type ${item.type}`);
  }

  const next =
    tryOperate(stack, {
      [Operation.Multiplication]: (left, right) => left * right,
      [Operation.Division]: (left, right) => left * right
    }) ||
    tryOperate(stack, {
      [Operation.Addition]: (left, right) => left + right,
      [Operation.Subtraction]: (left, right) => left - right
    });
  if (!next) {
    throw new Error(`Unable to calculate with ${stack.length} items left`);
  }
  return calculate(next);
}

const owns = Object.prototype.hasOwnProperty;
function tryOperate<O extends Operation>(
  stack: ReadonlyArray<StackItem>,
  operations: { [K in O]: (left: number, right: number) => number }
): ReadonlyArray<StackItem> | null {
  const index = stack.findIndex(
    item =>
      item.type === StackItemType.Operation &&
      owns.call(operations, item.operation)
  );
  if (index === -1) {
    return null;
  }
  if (index === 0) {
    throw new Error(`Unexpected operation at the beginning of a stack`);
  }
  if (index === stack.length - 1) {
    throw new Error(`Unexpected operation at the end of a stack`);
  }
  const left = stack[index - 1];
  if (left.type !== StackItemType.Number) {
    throw new Error("Unexpected non-number on left side of operation");
  }
  const right = stack[index + 1];
  if (right.type !== StackItemType.Number) {
    throw new Error("Unexpected non-number on left side of operation");
  }
  const operate =
    operations[(stack[index] as OperationStackItem).operation as O];
  const result = operate(left.value, right.value);
  return stack.slice(0, index - 1).concat(
    [
      {
        type: StackItemType.Number,
        value: result
      }
    ],
    stack.slice(index + 2)
  );
}

function modelToRepresentation(model: NumberModel) {
  const fractionalZeroes = countTrailingZeroes(model.fraction);
  return {
    value: modelToNumber(model),
    dot: model.dot || model.fraction.length > 0 || fractionalZeroes > 0,
    fractionalZeroes
  };
}

export function useCalculator(): {
  dispatch: CalculatorDispatch;
  value: number;
  dot: boolean;
  fractionalZeroes: number;
  recentOperation: Operation | null;
} {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    dispatch,
    ...modelToRepresentation(
      state.current === emptyNumberModel && state.stack.length > 0
        ? numberToModel(
            (state.stack[state.stack.length - 2] as NumberStackItem).value
          )
        : state.current
    ),
    recentOperation:
      state.current === emptyNumberModel && state.stack.length > 0
        ? (state.stack[state.stack.length - 1] as OperationStackItem).operation
        : null
  };
}

function countTrailingZeroes(digits: ReadonlyArray<number>): number {
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    if (digits[index] !== 0) {
      return digits.length - index - 1;
    }
  }
  return digits.length;
}
