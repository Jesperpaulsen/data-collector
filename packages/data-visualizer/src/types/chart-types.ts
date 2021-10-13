export type Labels = { label: string; value: string | number }[]
export type Dataset = {
  label: string
  data: { [label: string | number]: number }
}
