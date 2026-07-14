import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IoLockClosedOutline,
  IoPersonOutline,

} from "react-icons/io5";
import InputComponent from "../components/common/InputComponent";
import useForm from "../hooks/useForm";
import { asyncSetAuthUser } from "../states/authUser/action";
import { setErrorActionCreator, unsetErrorActionCreator } from "../states/error/action";
import { responseError } from "../utils/response";


export default function LoginPage() {
  const { form, onChange } = useForm({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();

  const onSubmitForm = async (event) => {
    event.preventDefault();
    dispatch(unsetErrorActionCreator());

    if (!form.username.trim() || !form.password.trim()) {
      dispatch(setErrorActionCreator("Username dan password wajib diisi"));
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(asyncSetAuthUser(form));
    } catch (requestError) {
      dispatch(setErrorActionCreator(responseError({ error: requestError, msg: "Login gagal" })));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50 via-white to-slate-100">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-teal-700 px-8 py-8 text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">RPAM PUDAM</h1>
            <p className="text-teal-200 text-sm mt-1">Rencana Pengamanan Air Minum</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Masuk ke Sistem</h2>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={onSubmitForm} className="flex flex-col gap-4">
              <InputComponent placeholder='Masukkan username' name="username" label="Username" value={form.username} onChangeValue={onChange} leftIcon={IoPersonOutline} />
              <InputComponent name="password" placeholder='Masukkan password' label="Password" type={showPassword ? "text" : "password"} value={form.password} onChangeValue={onChange} leftIcon={IoLockClosedOutline} toggle onChangeToggle={() => setShowPassword((value) => !value)} />
              <button
                id="login-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Memproses...
                  </>
                ) : 'Masuk'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

