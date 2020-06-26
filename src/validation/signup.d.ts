interface IErrors {
    username: string;
    email: string;
    password: string;
}
declare const validateSignUp: (data: any) => {
    errors: IErrors;
    isValid: (IErrors: any) => boolean;
};
export default validateSignUp;
