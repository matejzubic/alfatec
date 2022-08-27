import {readFileSync} from 'fs'
import mongoose from '../node_modules/mongoose/index.js'

const Souvenir = mongoose.model('Souvenir')
// Logic to create db and seed all data if not present in db

export const initiDB = (async () => {
    var result = []

    await Souvenir.find()
    .then((souvenirs) => {
        result = souvenirs
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });

    if(result.length == 0) {
            // The collection does'nt exists

            // Reed seed files from json file
            const fileContent = readFileSync('seed.json', 'utf8')
        
            if(fileContent) {
                const seedData = JSON.parse(fileContent);

                // Insert seed data to table
                seedData['Souvenirs'].forEach(async (souvenir) => {
                    const newSouvenir = new Souvenir(souvenir);
                    await newSouvenir.save()
                        .catch((err) => {
                            console.log(err);
                            res.send('Sorry! Something went wrong.');
                        });
                })
            }
    }
})

// Example service to fetch all products
export const getAllData = async () => {
    var result = []

    await Souvenir.find()
    .then((souvenirs) => {
        result = souvenirs
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });

    return result
}