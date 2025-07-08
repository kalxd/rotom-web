import * as m from "drifloon/m";
import { Form, FormAttr, RequireField, TrimInput } from "drifloon/form";
import { PrimaryButton, Segment, SegmentAttr, SegmentStyle, Header } from "drifloon/element";
import { formMut } from "drifloon/data";
import { Align, Color } from "drifloon/data/var";

interface FormField {
	username: string,
	password: string,
}

const makeFormField = (username: string, password: string): FormField => ({
	username,
	password
});

export interface LoginAttr {
	connectLogin: () => void;
}

const Main = (): m.Component => {
	const fd = formMut<FormField>({
		username: "",
		password: ""
	});

	return {
		view: () => {
			const formAttr: FormAttr<FormField> = {
				formdata: fd
			};

			const segmentAttr: SegmentAttr = {
				color: Color.Teal,
				style: SegmentStyle.Stack
			};

			return m.fragment({}, [
				m(Header, { align: Align.Center }, "登录"),

				m(Segment, segmentAttr, [
					m<FormAttr<FormField>, {}>(Form, formAttr, [
						m(RequireField, [
							m("label", "用户名"),
							m(TrimInput, { bindValue: fd.prop("username") })
						]),
						m(RequireField, [
							m("label", "密码"),
							m(TrimInput, { bindValue: fd.prop("password") })
						]),
						m(PrimaryButton, "提交")
					])
				])
			]);
		}
	};
};

export default Main;
