const fetch = require('node-fetch');
const cheerio = require('cheerio');
const cloudscraper = require('cloudscraper');
const readline = require('readline-sync');

const search = (judul) => new Promise((resolve, reject) => {
    const slug = judul.replace(/\s+/g, "+")
    cloudscraper.get(`https://pahe.ph/?s=${slug}`)
        .then(res => {
            const $ = cheerio.load(res)
            let hasil = []
            $('[class="post-box-title"] > a').map((i, el) => {
                hasil.push({
                    judul: $(el).text(),
                    link: $(el).attr('href')
                })
            })
            resolve(hasil)
        })
        .catch(e => reject(e))
});

const movie = (url) => new Promise((resolve, reject) => {
    cloudscraper.get(url)
        .then(res => {
            const $ = cheerio.load(res)
            let hasil;
            if ($('[class="entry"] > script').length > 1) {
                hasil = $('[class="entry"] > script').get()[1].children[0].data
            } else {
                hasil = $('[class="entry"] > script').get()[0].children[0].data
            }
            const script = eval(hasil.replace('eval', 'tes ='))
            const link = script.split('{')[3].split('}')[0].split(',').map(el => el.split('\\/\\/')[1].replace('"', '').replace('pahe', 'https://pahe').replace('.ph', '.ph/'))
            resolve(link)
        })
})

const intercalestial = (url) => new Promise((resolve, reject) => {
    cloudscraper.get(url)
        .then(res => {
            cheerio.load(res)
            console.log(res)
        })
});

(async () => {
    const judul = readline.question('Masukkan Judul : ')
    const hasil = await search(judul)
    hasil.map((res, i) => {
        console.log(`[${i+1}] ` + res.judul)
    })
    const pilih = readline.questionInt('Masukkan Judul yang dipilih : ') - 1
    const film = await movie(hasil[pilih].link)
    film.map((res, i) => {
        console.log(`[${i+1}] ` + res)
    })
    // const bypass = await intercalestial('https://pahe.ph/?c182413af3=YnFpREZyaVYvYTUwNVFoRkgwR0VuQ0RNSkY1YkVKUnlVaDJ0TmdMYkR4YitpYTlOVE1Mb3gyemlxOFhvdDNwaGhndHpCRzJIOFZ1Qmk0Q1JBRjZRdUdDek1jOUR5dWZTaVVBL1lLY1Vock5wNWVmNzhBM3AvUk8zN0tFdEhQVlN5cHh2ZE1RbzBLSGt3WkR3UWtGTVJjc3FBcStaaUZ2OVMrcHo5MjdRZDJRaVRGK3YrbUtmOTJmU2h3aFQzUElMSkFxRG1mOSttZE9uSTdTejhxbURsQT09')
})()