import * as m from "drifloon/m";
import { Form, FormAttr, RequireField, TrimInput } from "drifloon/form";
import { Button } from "drifloon/element";
import { formMut } from "drifloon/data";

interface FormField {
	username: string,
	password: string,
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

			return m<FormAttr<FormField>, {}>(Form, formAttr, [
				m(RequireField, [
					m("label", "用户名"),
					m(TrimInput, { bindValue: fd.prop("username") })
				]),
				m(RequireField, [
					m("label", "密码"),
					m(TrimInput, { bindValue: fd.prop("password") })
				]),
				m(Button, "登录")
			])
		}
	};
};

export default Main;
