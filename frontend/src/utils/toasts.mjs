import { toast } from "react-toastify";

export const toastSuccess = (msg) => {
    toast.success(
        msg,
        {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "colored",
        }
    );
}

export const toastError = (msg) => {
    toast.error(
        msg,
        {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "colored",
        }
    );
}