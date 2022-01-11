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
  country?: CountryDoc | HostToCountry
  specificHost: string
  aliasMap: Map<string, string>
}

const CountryDetails: FunctionalComponent<Props> = ({
  country,
  specificHost,
  aliasMap
}) => {
  const [hostsForCountry, setHostsForCountry] = useState<HostToCountry[]>([])
  const { usageHandler } = useContext(UsageContext)
  const [loading, setLoading] = useState(false)

  const co2ForCountry = useMemo(() => {
    const res = {
      CO2perGB: 'Unkown',
      CO2perkWh: 'Unkown',
      source: 'Unkown',
      year: 0
    }
    if (!country?.countryCode || !co2PerCountry) return res
    const details = co2PerCountry[country.countryCode]
    if (!details) return res
    return {
      CO2perGB: (details.CO2perkWh * 0.09).toFixed(4),
      CO2perkWh: details.CO2perkWh,
      source: details.source,
      year: details.year
    }
  }, [country])

  const loadDataForCountry = useCallback(async () => {
    if (!country || !usageHandler || specificHost) return
    setLoading(true)
    const result = await usageHandler?.getCountryUsagePerHost(
      country.countryCode
    )
    setHostsForCountry(result)
    setLoading(false)
  }, [country, usageHandler, specificHost])

  useEffect(() => {
    loadDataForCountry()
  }, [loadDataForCountry])

  const countryName = useMemo(() => {
    if (country?.countryName?.endsWith('s')) return `the ${country.countryName}`
    else return country?.countryName
  }, [country])

  return (
    <div>
      <div className="text-lg text-primary">Details for {countryName}</div>
      <div className="text-sm">
        Average CO2e per GB: {co2ForCountry.CO2perGB} kg.
      </div>
      <div className="text-xs">
        Based on average CO2e per kWh: {co2ForCountry.CO2perkWh}. Source:{' '}
        {co2ForCountry.source} ({co2ForCountry.year})
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : country ? (
        <div className="pt-4">
          <div className="text-sm font-medium">
            {specificHost.length > 0 ? specificHost : 'Your total'} usage in{' '}
            {countryName} is:
            <ul className="list-inside list-disc">
              <li>CO2: {co2Formatter(country.CO2)}</li>
              <li>Bytes: {byteFormatter(country.size)}</li>
              <li>kWh: {country.kWh?.toFixed(2)}</li>
              <li>Requests: {country.numberOfCalls}</li>
            </ul>
          </div>
          {!specificHost.length && country.numberOfCallsWithoutSize > 0 && (
            <div className="pt-2 font-semibold">
              Unfortunately we have been unable to calculate the size of{' '}
              {country.numberOfCallsWithoutSize}/{country.numberOfCalls} calls
              in this country.
            </div>
          )}
          {hostsForCountry.length > 0 && (
            <div className="py-2">
              <div className="font-semibold">
                Websites that have polluted most in this country:
              </div>
              <ul className="list-disc list-inside">
                {hostsForCountry.slice(0, 5).map((host) => (
                  <li key={host.countryCode}>
                    {aliasMap.get(host.hostOrigin) || host.hostOrigin}:{' '}
                    {co2Formatter(host.CO2)}{' '}
                    <span className="text-sm">
                      ({host.numberOfCalls} calls)
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
