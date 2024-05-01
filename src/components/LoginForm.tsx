import { Formik } from "formik";
import * as Yup from 'yup';
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/api";
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';



const LoginForm = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Name is required"),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters long"),
    });

    const initialFieldsValues = {
        name: "",
        password: "",
    };


    const [login, { isLoading }] = useLoginMutation();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (values: any) => {

        await login({ password: values.password, username: values.name })
            .unwrap()
            .then((res) => {
                Cookies.set('token', res.token, {expires: 3});
                Cookies.set('name', res.name, {expires: 3});
                Cookies.set('userId', res.id, {expires: 3});
                toast(res.message);
            })
            .then(() => navigate('/'))
            .catch((e) => {
                console.log(e);
                toast(`${e.status} ${e.data.message}`)
            })
    }
    return (
        <div className="h-[320px] p-[20px] bg-white rounded-[10px] flex flex-col justify-between">
            <Toaster />
            <Formik initialValues={initialFieldsValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        <input
                            type="text"
                            placeholder="Username"
                            className="h-[50px] rounded-[10px] border border-gray-400 text-lg p-[8px] font-light "
                            onChange={handleChange("name")}
                            onBlur={handleBlur("name")}
                            value={values.name}
                        />
                        {touched.name && errors.name && <p className="text-red-300 ml-2">{errors.name}</p>}
                        <input
                            type="password"
                            placeholder="Password"
                            className=" h-[50px] rounded-[10px] border border-gray-400 text-lg p-[8px] font-light "
                            onChange={handleChange("password")}
                            onBlur={handleBlur("password")}
                            value={values.password}
                        />
                        {touched.password && errors.password && <p className="text-red-300 ml-2">{errors.password}</p>}
                        <>
                            <button className="
                                h-[50px] 
                                rounded-[10px]
                                bg-blue-600 w-[30%] 
                                text-white 
                                font-light
                                self-center  
                                transform 
                                transition-transform 
                                hover:scale-105 
                                active:bg-blue-700 
                                focus:outline-none
                                "
                                type="submit"
                                onClick={() => handleSubmit()}
                            >
                                {isLoading ? 'Sending' : 'Log In'}
                            </button>
                            <span className="ml-[20%]">
                                Forgot Password?
                            </span>
                            <Link to={'/register'} className="
                                h-[50px] 
                                rounded-[10px]
                                bg-green-500 w-[40%] 
                                text-white
                                font-light
                                self-center  
                                transform 
                                transition-transform 
                                hover:scale-105 
                                active:bg-blue-700 
                                focus:outline-none
                                
                            ">
                                <p className="flex justify-center mt-[13px]">Go to register!</p>
                            </Link>
                        </>
                    </>
                )}
            </Formik>
        </div>
    )
}

export default LoginForm;
