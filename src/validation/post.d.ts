declare const validatePostInput: (data: any) => {
    errors: {
        title: string;
        body: string;
    };
    isValid: any;
};
export default validatePostInput;
