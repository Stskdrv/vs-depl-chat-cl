import { Formik } from "formik";
import * as Yup from 'yup';
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useRegisterMutation } from "../services/api";


const RegisterForm = () => {

    const navigate = useNavigate();

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Name is required"),
        email: Yup.string()
            .email('Invalid Email')
            .required("Email is required"),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters long"),
    });

    const initialFieldsValues = {
        name: "",
        email: "",
        password: "",
    };

    const [register, { isLoading }] = useRegisterMutation();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (values: any) => {

        await register({ username: values.name, email: values.email, password: values.password })
            .unwrap()
            .then((res) => toast(res.message))
            .then(() => navigate('/login'))
            .catch((e) => {
                console.log(e);
                toast(`${e.status} ${e.data.message}`)
            })
    }


    return (
        <div className="flex flex-col flex-1 justify-center">
            <div className="h-[450px] p-[20px] bg-white rounded-[10px] flex flex-col justify-between">
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
                                type="email"
                                placeholder="Email"
                                className="h-[50px] rounded-[10px] border border-gray-400 text-lg p-[8px] font-light "
                                onChange={handleChange("email")}
                                onBlur={handleBlur("email")}
                                value={values.email}
                            />
                            {touched.email && errors.email && <p className="text-red-300 ml-2">{errors.email}</p>}
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
                                    {isLoading ? 'Sending' : 'Register'}
                                </button>
                                <span className="ml-[20%]">
                                    Already have an account? Log in!
                                </span>
                                <Link to={'/login'} className="
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
                                    <p className="flex justify-center mt-[13px]">Go to Log in!</p>
                                </Link>
                            </>
                        </>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default RegisterForm;
