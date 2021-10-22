import fs from 'fs'

import pdfTable from 'pdf-table-extractor'

import pkg from '../../packages/data-analyzer/src/data/isoToCountryName.js'
const { isoCountries, countryToISO } = pkg

const INPUT_FILE = './file.pdf'
const OUTPUT_FILE =
  '../../packages/data-analyzer/src/data/co2PerKwhPerCountry.json'
const res = {}
const missingCountries = []
const START_PAGE = 0
const END_PAGE = 3

const parse = (result) => {
  const tables = result.pageTables.slice(START_PAGE, END_PAGE)

  for (const page of tables) {
    for (const table of page.tables) {
      let country = table[1]
      country = country.replace(/[\n\r]/g, '')
      country = country.replace(/ *\([^)]*\) */g, '')
      country = country.trim()
      const isoCode = countryToISO[country]
      if (isoCode) {
        let CO2perkWh = Number(table[2])

        if (isNaN(CO2perkWh)) {
          if (table[2].includes('or')) {
            CO2perkWh = Number(table[2].split(' ')[0])
          } else if (table[2].includes('Gen')) {
            const split = table[2].split('\n')
            const gen = Number(split[0].substring(5))
            const TD = Number(split[1].substring(5))
            CO2perkWh = gen + TD
          }
        }

        const source = table[4].replace(/[\n\r]/g, '').trim()
        const year = Number(table[5].trim())
        res[isoCode] = {
          country,
          CO2perkWh,
          source,
          year
        }
      } else {
        if (country !== '' && country !== 'Country') {
          missingCountries.push(country)
        }
      }
    }
  }
}

const save = () => {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(res))
  console.log(`Wrote ${Object.keys(res).length} to ${OUTPUT_FILE}`)
}

const load = () => {
  return new Promise((resolve, reject) => {
    pdfTable(INPUT_FILE, resolve, reject)
  })
}

const start = async () => {
  try {
    const result = await load()
    parse(result)
    console.log(res)
    console.log(missingCountries)
    save()
  } catch (e) {
    console.log(e)
  }
}

start().catch(() => process.exit(1))
