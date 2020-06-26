declare const validateSignIn: (data: any) => {
    errors: {
        email: string;
        password: string;
    };
    isValid: any;
};
export default validateSignIn;
