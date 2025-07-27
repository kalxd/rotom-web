interface ActionFinish<T> {
	tag: "__action_finish";
	value: T;
}

interface ActionPend {
	tag: "__action_pend";
}

export class ActionResult<T> {
	private readonly wrapperValue: ActionFinish<T> | ActionPend;

	static pend(): ActionResult<any> {
		return new ActionResult({ tag: "__action_pend" })
	}

	static ready<T>(v: T): ActionResult<T> {
		return new ActionResult({
			tag: "__action_finish", value: v
		});
	}

	constructor(outterValue: ActionFinish<T> | ActionPend) {
		this.wrapperValue = outterValue;
	}

	isPend(): boolean {
		return this.wrapperValue.tag === "__action_pend";
	}

	get value(): T {
		if (this.wrapperValue.tag === "__action_finish") {
			return this.wrapperValue.value;
		}

		throw new Error("尝试从未ActionPend获取ActionResult。")
	}
}
