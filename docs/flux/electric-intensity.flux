// Electric intensity query template.
// Bucket: gems_test
// Output: total kWh, total production quantity, and kWh per unit.

energy =
  from(bucket: "gems_test")
    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
    |> filter(fn: (r) => r._measurement == "gems_power")
    |> filter(fn: (r) => r._field == "sum_kwh")
    |> group(columns: ["factory", "process", "meter", "feeder", "furnace"])
    |> difference(nonNegative: true)
    |> group()
    |> sum()
    |> map(fn: (r) => ({ r with metric: "energy_kwh" }))

production =
  from(bucket: "gems_test")
    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
    |> filter(fn: (r) => r._measurement == "production_input")
    |> filter(fn: (r) => r._field == "quantity")
    |> group()
    |> sum()
    |> map(fn: (r) => ({ r with metric: "production_quantity" }))

join(tables: {energy: energy, production: production}, on: ["_start", "_stop"])
  |> map(
    fn: (r) => ({
      _time: now(),
      energy_kwh: r._value_energy,
      production_quantity: r._value_production,
      unit_kwh_per_unit: if r._value_production == 0.0 then 0.0 else r._value_energy / r._value_production,
    }),
  )
