import * as m from "drifloon/m";
import { EitherAsync } from "drifloon/purify";
import { Form, FormAttr, RequireField, TrimInput, PasswordInput } from "drifloon/form";
import { PrimaryButton, Segment, SegmentAttr, SegmentStyle, Header } from "drifloon/element";
import { ValidatorResult, formMut, isNotEmpty, must } from "drifloon/data";
import { Align, Color } from "drifloon/data/var";
import { SessionUserC, sessionUserC } from "../ty";

interface FormField {
	username: string,
	password: string,
}

const makeFormField = (username: string, password: string): FormField => ({
	username,
	password
});

const loginApi = (data: FormField): EitherAsync<Error, SessionUserC> => {
	return EitherAsync(async helper => {
		const rsp = await fetch(
			"./api/user/login",
			{
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json"
				}
			})
			.then(r => r.json());

		const sessionUser = sessionUserC
			.decode(rsp)
			.mapLeft(msg => new Error(msg));

		return helper.liftEither(sessionUser);
	});
};

const validateForm = (data: FormField): ValidatorResult<SessionUserC> => {
	const formData = must("用户名", isNotEmpty(data.username))
		.must("密码", isNotEmpty(data.password))
		.collect(makeFormField);

	return EitherAsync.liftEither(formData)
		.chain(data => {
			return loginApi(data).mapLeft(e => [`请求出错：${e.message}`]);
		});
};

export interface LoginAttr {
	connectLogin: (session: SessionUserC) => void;
}

const Main: m.ComponentTypes<LoginAttr> = () => {
	const fd = formMut<FormField>({
		username: "",
		password: ""
	});

	return {
		view: ({ attrs }) => {
			const formAttr: FormAttr<FormField> = {
				formdata: fd
			};

			const segmentAttr: SegmentAttr = {
				color: Color.Teal,
				style: SegmentStyle.Stack
			};

			const onsubmit = async (): Promise<void> => {
				const rsp = await fd.validate(validateForm);
				rsp.ifRight(attrs.connectLogin)
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
							m(PasswordInput, { bindValue: fd.prop("password") })
						]),
						m(PrimaryButton, { connectClick: onsubmit }, "提交")
					])
				])
			]);
		}
	};
};

export default Main;
