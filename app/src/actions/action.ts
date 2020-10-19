import type {Event} from "../events/event";

export interface Action
{
  name: string
  action:(trigger:Event) => void
}
