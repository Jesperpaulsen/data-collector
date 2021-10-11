import { FunctionalComponent } from 'preact'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'preact/hooks'

import { UsageContext } from '../../contexts/Usage/UsageContext'
import * as co2PerCountry from '../../data/co2PerKwhPerCountry.json'
import { CountryDoc } from '../../types/country-doc'
import { HostToCountry } from '../../types/host-to-country'
import { byteFormatter } from '../../utils/byteFormatter'
import { co2Formatter } from '../../utils/co2Formatter'
import LoadingSpinner from '../common/LoadingSpinner'

interface Props {
  country?: CountryDoc
}

const CountryDetails: FunctionalComponent<Props> = ({ country }) => {
  const [hostsForCountry, setHostsForCountry] = useState<HostToCountry[]>([])
  const { usageHandler } = useContext(UsageContext)
  const [loading, setLoading] = useState(false)

  const co2ForCountry = useMemo(() => {
    const res = { CO2perKWH: 'Unkown', source: 'Unkown', year: 0 }
    if (!country?.countryCode || !co2PerCountry) return res
    const details = co2PerCountry[country.countryCode]
    if (!details) return res
    return {
      CO2perKWH: details.CO2perKWH,
      source: details.source,
      year: details.year
    }
  }, [country])

  const loadDataForCountry = useCallback(async () => {
    if (!country || !usageHandler) return
    setLoading(true)
    const result = await usageHandler?.getCountryUsagePerHost(
      country.countryCode
    )
    setHostsForCountry(result)
    setLoading(false)
  }, [country, usageHandler])

  useEffect(() => {
    loadDataForCountry()
  }, [loadDataForCountry])

  return (
    <div>
      <div className="text-lg text-primary">
        Details for {country?.countryName}
      </div>
      <div className="text-sm">
        Average kg CO2e per KWH: {co2ForCountry.CO2perKWH}.
      </div>
      <div className="text-xs">
        Source: {co2ForCountry.source} ({co2ForCountry.year})
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : country ? (
        <div className="pt-4">
          <div className="text-sm font-medium">
            Your total usage in {country.countryName} is:
            <ul className="list-inside list-disc">
              <li>CO2: {co2Formatter(country.CO2)}</li>
              <li>KWH: {country.KWH.toFixed(2)}</li>
              <li>Bytes: {byteFormatter(country.size)}</li>
            </ul>
          </div>
          {country.numberOfCallsWithoutSize > 0 && (
            <div className="pt-2 font-semibold">
              Unfortunately we have been unable to calculate the size of{' '}
              {country.numberOfCallsWithoutSize}/{country.numberOfCalls} calls
              in this country.
            </div>
          )}
          {hostsForCountry.length > 0 && (
            <div className="py-2">
              <div className="font-semibold">
                Websites that has polluted most in this country:
              </div>
              <ul className="list-disc list-inside">
                {hostsForCountry.slice(0, 5).map((host) => (
                  <li key={host.countryCode}>
                    {host.hostOrigin}: {co2Formatter(host.CO2)}{' '}
                    <span className="text-sm">
                      ({host.numberOfCalls - host.numberOfCallsWithoutSize}{' '}
                      calls)
                    </span>
                  </li>
                ))}
              </ul>
              {hostsForCountry.length > 5 && (
                <div className="text-sm">
                  {hostsForCountry.length - 5} more websites have polluted here
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>Something strange happened. Try to select another country</div>
      )}
    </div>
  )
}

export default CountryDetails
