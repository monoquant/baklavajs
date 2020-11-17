import { IBaklavaEvent, IPreventableBaklavaEvent, IHook } from "../../baklavajs-events/types";
import { INodeState } from "./state";
import { IEditor } from "./editor";
import { INodeIO, IODefinition, IODefinitionValues } from "./nodeIO";

export type CalculateFunctionReturnType<O extends IODefinition> =
    | IODefinitionValues<O>
    | Promise<IODefinitionValues<O>>
    | void;

export type CalculateFunction<I extends IODefinition, O extends IODefinition> = (
    inputs: IODefinitionValues<I>,
    globalValues?: any
// ) => CalculateFunctionReturnType<O>;
) => IODefinitionValues<O>;

export interface INode<I extends IODefinition, O extends IODefinition> {
    type: string;
    title: string;
    id: string;
    inputs: I;
    outputs: O;

    events: {
        loaded: IBaklavaEvent<INode<I, O>>;
        beforeAddInput: IPreventableBaklavaEvent<INodeIO<unknown>>;
        addInput: IBaklavaEvent<INodeIO<unknown>>;
        beforeRemoveInput: IPreventableBaklavaEvent<INodeIO<unknown>>;
        removeInput: IBaklavaEvent<INodeIO<unknown>>;
        beforeAddOutput: IPreventableBaklavaEvent<INodeIO<unknown>>;
        addOutput: IBaklavaEvent<INodeIO<unknown>>;
        beforeRemoveOutput: IPreventableBaklavaEvent<INodeIO<unknown>>;
        removeOutput: IBaklavaEvent<INodeIO<unknown>>;
    };

    hooks: {
        beforeLoad: IHook<INodeState<I, O>>;
        afterSave: IHook<INodeState<I, O>>;
    };

    load(state: INodeState<I, O>): void;
    save(): INodeState<I, O>;
    calculate?: CalculateFunction<I, O>;
    registerEditor(editor: IEditor): void;
}
