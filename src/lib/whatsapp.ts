/**
 * Arma un link wa.me a partir de un teléfono ingresado en cualquier
 * formato (+56 9 1234 5678, 912345678, etc). Asume Chile si no viene
 * con código de país.
 */
export function toWhatsappLink(telefono: string) {
  const digits = telefono.replace(/\D/g, "");
  const withCountry = digits.startsWith("56")
    ? digits
    : `56${digits.replace(/^0/, "")}`;
  return `https://wa.me/${withCountry}`;
}
