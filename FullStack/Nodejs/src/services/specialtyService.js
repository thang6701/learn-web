const db = require("../models");

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name
                || !data.imageBase64
                || !data.descriptionMarkdown
                || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missingparameter!!!'
                })
            }
            else {
                await db.Specialty.create({
                    name: data.name,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML,
                    image: data.imageBase64
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Ok!!!'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();

            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Ok!!!',
                data
            })
        }
        catch (error) {
            reject(error);
        }
    })
}
let getAllDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missingparameter!!!'
                })
            }
            else {
                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['descriptionMarkdown', 'descriptionHTML']
                })

                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }

                    data.doctorSpecialty = doctorSpecialty;

                }
                else data = {}
                resolve({
                    errCode: 0,
                    errMessage: 'Ok!!!',
                    data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getAllDetailSpecialtyById: getAllDetailSpecialtyById
}