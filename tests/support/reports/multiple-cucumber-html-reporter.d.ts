// El paquete no publica tipos propios ni existe @types/multiple-cucumber-html-reporter
declare module 'multiple-cucumber-html-reporter' {
  function generate(options: Record<string, unknown>): void;
  // export default debe ser un identificador en un módulo ambient, no un objeto literal
  const reporter: { generate: typeof generate };
  export default reporter;
}
