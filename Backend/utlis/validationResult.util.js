import { validationResult } from "express-validator";

export const validationResultUtil = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
        return true; // indicate response sent
    }
    return false;
}   