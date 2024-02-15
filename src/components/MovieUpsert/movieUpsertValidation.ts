/* eslint-disable @typescript-eslint/no-explicit-any */
export type ErrorType = {
    error: boolean;
    errorMessage: string
}

type ValidatorFunction = {
    (value: string | File | null): boolean | ErrorType | Promise<boolean | ErrorType>;
}

type ValidatorObject = {
    [key: string]: ValidatorFunction;
}

export const validateField = (fieldName: string, fieldValue: string | File | null): boolean | ErrorType | Promise<boolean | ErrorType>=> {
    const validateMethod = validateMethods[fieldName as keyof typeof validateMethods];
    if (validateMethod === undefined) {
        return {
            error: true,
            errorMessage: "Could not validate field"
        }
    }

    return validateMethod(fieldValue);
}

export const validateFormData = async (formData: any): Promise<boolean | ErrorType> => {
    const fieldNames = Object.keys(formData);
    const errors: any = {};
    let allValid = true;
    await fieldNames.forEach(async field => {
        const validationResult = await validateField(field, formData[field]);

        if (validationResult !== true) {
            errors[field] = (validationResult as ErrorType).errorMessage ;
            allValid = false;
        }
    });

    return allValid === true ? true : errors;
}

const validateMethods: ValidatorObject = {
    title: (value) => {
        if (typeof value !== 'string'){
            return {
                error: true,
                errorMessage: "Title must be a string"
            }
        }
        const isOK = /.+/.test(value);
        if (isOK) return true;

        return {
            error: true,
            errorMessage: "Title must contain at least one character"
        }
    },
    director: (value) => {
        if (typeof value !== 'string'){
            return {
                error: true,
                errorMessage: "Director name must be a string"
            }
        }

        const isOK = /.+/.test(value);
        if (isOK) return true;

        return {
            error: true,
            errorMessage: "Director name must contain at least one character"
        }
    },
    distributor: (value) => {
        if (typeof value !== 'string'){
            return {
                error: true,
                errorMessage: "Distributor name must be a string"
            }
        }

        const isOK = /.+/.test(value);
        if (isOK) return true;

        return {
            error: true,
            errorMessage: "Distributor name must contain at least one character"
        }
    },
    imdbRating: (value) => {
        const newValue = Number(value);
        if (typeof newValue !== 'number'){
            return {
                error: true,
                errorMessage: "IMDB Rating must be a number"
            }
        }

        const isOK = newValue >= 1 && newValue <= 10;
        if (isOK) return true;

        return {
            error: true,
            errorMessage: "IMDB Rating must be between 1 and 10"
        }
    },
    imdbVotes: (value) => {
        const newValue = Number(value);
        if (typeof newValue !== 'number') {
            return {
                error: true,
                errorMessage: "IMDB Votes must be a number"
            }
        }
    
        const isOK = newValue >= 1;
        if (isOK) return true;

        return {
            error: true,
            errorMessage: "IMDB Votes must be greater than 1"
        }
    },
    posterImage: async (value) => {
        if (!(value instanceof File)) {
            return {
                error: true,
                errorMessage: "Movie poster must be a file"
            }
        }

        try {
            const imageSize = await loadImage(value) as {width: number,height: number};
            if (imageSize.width > 480 && imageSize.height > imageSize.width + 100) {
                return true;
            } else {
                return {
                    error: true,
                    errorMessage: "Movie poster must be at least 480 pixels wide and 580 pixels tall"
                }
            }
        } catch {
            return {
                error: true,
                errorMessage: "Movie poster is not a valid image file"
            }
        }
    }
}

const loadImage = (file: File) => {
    return new Promise((res, rej) => {
        const img = new Image();
        const dataURL = URL.createObjectURL(file);
        img.src = dataURL;

        img.onload = () => {
            const imageSize = {
                width: img.width,
                height: img.height
            };

            URL.revokeObjectURL(dataURL);

            if (img.width === 0 || img.height === 0 ||
                img.naturalHeight === 0 || img.naturalWidth === 0) {

                img.onerror && img.onerror('Not a valid image file');
            }

            res(imageSize);
        }

        img.onerror = () => {
            rej();
        }
    });
}