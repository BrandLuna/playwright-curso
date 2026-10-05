// Clase 6 — genera un reporte HTML alternativo (muy usado junto a Cucumber)
// a partir del formatter "json" configurado en cucumber.json.
// Ejecutar: npm run cucumber && npm run cucumber:html-report
import report from 'multiple-cucumber-html-reporter';

report.generate({
  jsonDir: 'cucumber-report-json',
  reportPath: './multiple-cucumber-html-report',
  displayDuration: true,
  metadata: {
    browser: { name: 'chromium', version: '-' },
    device: 'Local',
    platform: { name: process.platform, version: '-' },
  },
});
