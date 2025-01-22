
const userModel = require('../Models/User');
const sendResponse = require('../Utils/Response');



// !Fetching All Users
exports.AllUsers = async (req, res) => {
    try {
        const allUsers = await userModel.find();
        if(allUsers) {
            sendResponse(res, 200, true, "All Users", allUsers);
        }
        else {
            sendResponse(res, 400, false, "No Users Found");
        }
        
    } catch (err) {
        console.log(err);
        sendResponse(res, 500, false, "Internal Server Error");
    }
}


// !Fetch Single User
exports.singleUser = async (req, res) => {
    const { id } = req.body;

    try {
        const user = await userModel.findById(id).select('-password');

        if (!user) {
            return sendResponse(res, 400, true, "User Not Found");
        }

        sendResponse(res, 200, true, "User Found", user);

    } catch (error) {
        console.log(error);
        sendResponse(res, 500, false, "Internal Server Error");
    }

}

// !Delete User
exports.deleteUser = async (req, res) => {
    const { id } = req.body;

    try {
        const user = await userModel.findByIdAndDelete(id);
        if (user) {
            sendResponse(res, 200, true, "User Deleted Successfully");
        }
        else {
            return sendResponse(res, 400, false, "User Not Found");
        }

    } catch (error) {
        console.log(error);
        sendResponse(res, 500, false, "Internal Server Error");
    }
}

// !Update User
exports.updateUser = async (req, res) => {
    const { id } = req.body;

    try {
        const user = await userModel.findByIdAndUpdate(id, req.body);
        if (user) {
            sendResponse(res, 200, true, "User Updated Successfully");
        }
        else {
            return sendResponse(res, 400, false, "User Not Found");
        }

    } catch (error) {
        console.log(error);
        sendResponse(res, 500, false, "Internal Server Error");
    }
}


// // !Delete all user     
// exports.deleteAllUser = async (req, res) => {
//     try {
//         await userModel.deleteMany({});
//         sendResponse(res, 200, true, "All Users Deleted Successfully");
//     } catch (error) {
//         console.log(error);
//         sendResponse(res, 500, false, "Internal Server Error");
//     }
// }


