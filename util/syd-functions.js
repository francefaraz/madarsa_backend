const { validationResult } = require('express-validator');
exports.validators = (req) => {
    let errorMessage = null;
    console.log("enter ed in validators ")
    // console.log(req)
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.log('(SYD FUNCTIONS) VALIDATION ERROR', validationErrors.array()[0]);
        errorMessage = validationErrors.array()[0].msg;
        // if (req.file) {
        //     this.deleteImage(req.file.path.replace("\\", "/"));
        // }

    }
    return errorMessage;
}