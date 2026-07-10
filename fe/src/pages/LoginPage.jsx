import { useState } from "react";
import {
    IoPersonOutline,
    IoLockClosedOutline,
    IoWaterOutline,
    IoFilterOutline,
    IoGitNetworkOutline,
    IoHomeOutline,
} from "react-icons/io5";
import InputComponent from "../components/common/InputComponent";
import useForm from "../hooks/useForm";
import { useDispatch } from "react-redux";
import { asyncSetAuthUser } from "../states/authUser/action";
import { authenticationPayloadValidatorPost } from "../validator/auth.validator";
import { setErrorActionCreator } from "../states/error/action";
import { responseError } from "../utils/response-error";

const BARRIERS = [
    { icon: IoWaterOutline, title: "Sumber air", subtitle: "Danau, sungai, mata air" },
    { icon: IoFilterOutline, title: "Instalasi pengolahan", subtitle: "Filtrasi & desinfeksi" },
    { icon: IoGitNetworkOutline, title: "Jaringan distribusi", subtitle: "Pipa & reservoir" },
    { icon: IoHomeOutline, title: "Pelanggan", subtitle: "Keran rumah tangga" },
];

export default function LoginPage() {
    const { form, onChange } = useForm({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();

    const onSubmitForm = async () => {
        const { error } = authenticationPayloadValidatorPost.validate(form, {
            abortEarly: false,
        });
        if (error) {
            dispatch(setErrorActionCreator(error.message));
            return;
        }
        try {
            setIsSubmitting(true);
            await dispatch(asyncSetAuthUser({ username: form.username, password: form.password }));
        } catch (error) {
            dispatch(setErrorActionCreator(responseError({ error, msg: "Login gagal" })));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") onSubmitForm();
    };

    return (
        <div className="min-h-screen flex bg-neutral-50">
            {/* Panel kiri — muncul di md ke atas */}
            <div className="hidden md:flex md:w-2/5 lg:w-[45%] bg-brand-900 flex-col justify-between p-6 lg:p-10">
                <div>
                    <p className="text-xs font-semibold tracking-wide text-brand-300 uppercase mb-2">
                        Pendekatan multi-barrier WHO
                    </p>
                    <h2 className="font-display text-xl lg:text-2xl font-bold text-white leading-snug max-w-xs">
                        Setiap tetes, dari sumber ke keran, diawasi.
                    </h2>
                </div>

                <div className="flex flex-col">
                    {BARRIERS.map((b, i) => (
                        <div key={b.title} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-brand-700 border-2 border-brand-500 flex items-center justify-center shrink-0">
                                    <b.icon className="text-brand-100 text-base lg:text-lg" />
                                </div>
                                {i < BARRIERS.length - 1 && (
                                    <div className="w-px flex-1 bg-brand-700 my-1" />
                                )}
                            </div>
                            <div className={i < BARRIERS.length - 1 ? "pb-6 lg:pb-8" : ""}>
                                <p className="text-sm font-semibold text-white font-display">
                                    {b.title}
                                </p>
                                <p className="text-xs text-brand-400 mt-0.5">{b.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-brand-400">Rencana Pengamanan Air Minum</p>
            </div>

            {/* Panel kanan — form */}
            <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-sm">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center mb-5 md:hidden">
                        <IoWaterOutline className="text-brand-700 text-xl" />
                    </div>

                    <h1 className="font-display text-xl sm:text-2xl font-bold text-brand-900 mb-1">
                        Masuk ke RPAM
                    </h1>
                    <p className="text-sm text-neutral-500 mb-8">
                        Masukkan username dan password Anda
                    </p>

                    <div onKeyDown={handleKeyDown} className="flex flex-col gap-4">
                        <InputComponent
                            name="username"
                            label="Username"
                            value={form.username}
                            onChangeValue={onChange}
                            leftIcon={IoPersonOutline}
                        />
                        <InputComponent
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChangeValue={onChange}
                            leftIcon={IoLockClosedOutline}
                            toggle
                            onChangeToggle={() => setShowPassword((prev) => !prev)}
                        />
                    </div>

                    <button
                        onClick={onSubmitForm}
                        disabled={isSubmitting}
                        className="w-full mt-6 bg-brand-700 hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                    >
                        {isSubmitting ? "Memproses..." : "Masuk"}
                    </button>
                </div>
            </div>
        </div>
    );
}