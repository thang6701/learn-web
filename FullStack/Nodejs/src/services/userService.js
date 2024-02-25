import db from "../models/index";
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName'],
                    where: { email: email },
                    raw: true
                });
                if (user) {
                    let checkPassword = await bcrypt.compareSync(password, user.password);

                    if (checkPassword) {
                        userData.errCode = 0;
                        userData.errMessage = 'Password ok';
                        console.log(user);
                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                }
                else {
                    userData.errCode = 2;
                    userData.errMessage = 'User not found';
                }

            }
            else {
                userData.errCode = 1;
                userData.errMessage = 'Email not exist in system. Plz try other email!';

            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    })
}
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getAllUser = (userid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if (userid === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userid && userid !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userid },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (error) {
            reject(error);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    })
}
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkEmail = await checkUserEmail(data.email);
            if (checkEmail === true) {
                resolve({
                    errCode: 1,
                    message: 'Email is used!. Plz try another email!'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    message: 'Create a new user success!!'
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}
let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {//!data.id||!data.roleId||data.positionId||data.gender
                resolve({
                    errCode: 2,
                    message: 'Missing parameters!!'
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id }, raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phonenumber = data.phonenumber;
                user.gender = data.gender;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                if (data.avata) {
                    user.image = data.avata
                }

                await user.save();
                // await db.User.save({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address: data.address,
                //     phoneNumber: data.phoneNumber,
                //     gender: data.gender
                // });
                // let allUsers = await db.User.findAll();
                resolve({
                    errCode: 0,
                    message: 'Edit user success!!'
                });
            }
            else {
                resolve(
                    {
                        errCode: 1,
                        message: 'User not found!!'
                    }
                );
            }
        } catch (error) {
            reject(error);
        }
    })
}
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: userId }, raw: false })
            if (!user) {
                resolve({
                    errCode: 2,
                    message: 'User not found'
                })
            }
            await user.destroy();
            resolve({
                errCode: 0,
                message: 'Delete user success!!'
            })
        } catch (error) {
            reject(error);
        }

    })
}
let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
                resolve(data);
            }
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    editUser: editUser,
    deleteUser: deleteUser,
    getAllCodeService: getAllCodeService,
}