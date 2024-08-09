export class Formatter {
  static currency(value: number, decimal = 2) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: decimal
    }).format(value)
  }
}
