declare global {interface Window {BlueprintBoot?:{ready():void;fail(error:unknown):void}}}
export function markReady(){window.BlueprintBoot?.ready();}
export function reportFatal(error:unknown){window.BlueprintBoot?.fail(error);}
